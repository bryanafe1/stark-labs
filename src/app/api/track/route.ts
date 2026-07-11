import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { deriveAttribution, deviceFromUA, isBot } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VID = "oc_vid"; // anonymous visitor id (1yr)
const FT = "oc_ft"; // first-touch attribution (1yr)
const YEAR = 60 * 60 * 24 * 365;

// First-party pageview beacon. The client posts { path, referrer, query } on
// each route change. We derive traffic source, log a PageView, keep a stable
// anonymous visitor id, and — for signed-in users — stamp their first-touch
// source onto the User once (so every signup is attributable).
export async function POST(req: Request) {
  const res = new NextResponse(null, { status: 204 });
  try {
    const ua = req.headers.get("user-agent");
    if (isBot(ua)) return res;

    let body: { path?: string; referrer?: string; query?: string } = {};
    try {
      body = (await req.json()) as typeof body;
    } catch {
      return res;
    }
    const path = String(body.path ?? "").slice(0, 300);
    if (!path || path.startsWith("/admin") || path.startsWith("/api")) return res;

    // Strip same-origin referrers so internal navigation doesn't masquerade as a source.
    const host = (await headers()).get("host") ?? "";
    let referrer = String(body.referrer ?? "").slice(0, 500) || null;
    if (referrer) {
      try {
        if (new URL(referrer).host === host) referrer = null;
      } catch {
        referrer = null;
      }
    }

    const params = new URLSearchParams(String(body.query ?? ""));
    const attr = deriveAttribution(params, referrer);
    const country = req.headers.get("x-vercel-ip-country") ?? null;
    const device = deviceFromUA(ua);

    const jar = await cookies();
    let visitorId = jar.get(VID)?.value;
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      res.cookies.set(VID, visitorId, { httpOnly: true, sameSite: "lax", maxAge: YEAR, path: "/" });
    }

    const userId = await getCurrentUserId();

    await prisma.pageView.create({
      data: {
        visitorId,
        userId: userId ?? null,
        path,
        referrer,
        source: attr.source,
        medium: attr.medium,
        campaign: attr.campaign ?? null,
        country,
        device,
      },
    });

    // First-touch attribution: remember the very first source for this visitor.
    let firstTouch = jar.get(FT)?.value;
    if (!firstTouch) {
      firstTouch = JSON.stringify({
        source: attr.source,
        medium: attr.medium,
        campaign: attr.campaign ?? null,
        referrer,
        landing: path,
      });
      res.cookies.set(FT, firstTouch, { httpOnly: true, sameSite: "lax", maxAge: YEAR, path: "/" });
    }

    // Stamp the signup's source once, on a signed-in user who isn't attributed yet.
    if (userId) {
      const u = await prisma.user.findUnique({ where: { id: userId }, select: { signupSource: true } });
      if (u && !u.signupSource) {
        let ft: { source?: string; medium?: string; campaign?: string; referrer?: string; landing?: string } = {};
        try {
          ft = firstTouch ? JSON.parse(firstTouch) : {};
        } catch {
          /* ignore */
        }
        await prisma.user
          .update({
            where: { id: userId },
            data: {
              signupSource: (ft.source ?? attr.source).slice(0, 40),
              signupMedium: (ft.medium ?? attr.medium).slice(0, 20),
              signupCampaign: (ft.campaign ?? attr.campaign ?? null)?.slice(0, 120) ?? null,
              signupReferrer: (ft.referrer ?? referrer ?? null)?.slice(0, 500) ?? null,
              signupLanding: (ft.landing ?? path).slice(0, 300),
            },
          })
          .catch(() => {});
      }
    }
  } catch {
    /* analytics must never break navigation */
  }
  return res;
}
