import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Public creator referral link: overclocker.dev/r/JANE20
// Stores the (validated) code in a cookie that survives sign-up, then sends the
// visitor to pricing. Checkout reads the cookie so the discount + attribution
// apply even after the auth detour.
export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code.trim().toUpperCase();
  const base = process.env.AUTH_URL ?? new URL(req.url).origin;
  const creator = await prisma.creator.findUnique({ where: { code } });
  const res = NextResponse.redirect(`${base}/pricing`);
  if (creator?.active) {
    res.cookies.set("oc_ref", creator.code, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }
  return res;
}
