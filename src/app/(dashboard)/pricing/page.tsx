import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Check, Sparkles, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { getAccess } from "@/lib/access";
import { startSubscription, openPortal } from "@/server/actions/payments";

export const metadata: Metadata = { title: "Pricing" };
export const dynamic = "force-dynamic";

const FREE = [
  "Full diagnostic + personalized study plan",
  "The entire first Mechanical topic — every lesson & problem",
  "Weekly Open Challenge",
  "Public profile page",
];
const STANDARD = [
  "Everything in Free",
  "All disciplines, every lesson, problem & solution",
  "Spaced repetition + readiness scores",
  "AI tutor (20/day) & full Arena",
];
const PRO = [
  "Everything in Standard",
  "5 voice interview simulations every month",
  "Full post-session debrief on every session",
  "Priority access to new disciplines",
];

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
      {children}
    </li>
  );
}

export default async function PricingPage({ searchParams }: { searchParams: { code?: string } }) {
  const userId = await getCurrentUserId();
  const access = await getAccess(userId);

  // Creator code from ?code= or the /r/<code> cookie → pre-applies the discount.
  const rawCode = (searchParams.code ?? cookies().get("oc_ref")?.value ?? "").trim().toUpperCase();
  const creator = rawCode ? await prisma.creator.findUnique({ where: { code: rawCode } }) : null;
  const code = creator?.active ? creator.code : "";
  const discountPct = creator?.active ? creator.discountPercent : 0;

  // CTA for a paid tier column.
  function PaidCTA({ tier }: { tier: "standard" | "pro" }) {
    if (access.paid) {
      const isCurrent = access.tier === tier;
      return (
        <form action={openPortal} className="mt-6">
          <Button type="submit" variant={isCurrent ? "default" : "secondary"} className="w-full" disabled={isCurrent && access.status === "admin"}>
            {isCurrent ? "Current plan — manage" : "Switch plan"}
          </Button>
        </form>
      );
    }
    return (
      <div className="mt-6 space-y-2">
        <form action={startSubscription}>
          <input type="hidden" name="tier" value={tier} />
          <input type="hidden" name="interval" value="monthly" />
          {code && <input type="hidden" name="code" value={code} />}
          <Button type="submit" size="lg" className="w-full">
            {tier === "pro" ? "Get Pro" : "Get Standard"}
          </Button>
        </form>
        <form action={startSubscription} className="text-center">
          <input type="hidden" name="tier" value={tier} />
          <input type="hidden" name="interval" value="annual" />
          {code && <input type="hidden" name="code" value={code} />}
          <button type="submit" className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
            or pay annually & save
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Choose your plan</h1>
        <p className="mt-1 text-muted-foreground">Land the interview. Cancel anytime.</p>
      </div>

      {code && (
        <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary">
          <Tag className="size-4" />
          Code <span className="font-mono">{code}</span> applied — {discountPct}% off at checkout
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* FREE (left) */}
        <Card className="flex flex-col p-6">
          <p className="text-sm font-semibold text-muted-foreground">Free</p>
          <p className="mt-2 text-3xl font-bold">
            $0<span className="text-base font-normal text-muted-foreground">/mo</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">No credit card. See what it&apos;s about.</p>
          <ul className="mt-5 flex-1 space-y-2">
            {FREE.map((f) => (
              <Item key={f}>{f}</Item>
            ))}
          </ul>
          {access.paid ? (
            <Button variant="secondary" className="mt-6 w-full" disabled>
              Included
            </Button>
          ) : (
            <Button asChild variant="secondary" className="mt-6 w-full">
              <Link href="/learn">Get started</Link>
            </Button>
          )}
        </Card>

        {/* PRO (center, highlighted) */}
        <Card className="relative flex flex-col border-primary/50 bg-gradient-to-br from-primary/10 to-transparent p-6 pt-9 sm:pt-6">
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3" /> Most popular
          </span>
          <p className="text-sm font-semibold text-primary">Pro</p>
          <p className="mt-2 text-3xl font-bold">
            $40<span className="text-base font-normal text-muted-foreground">/mo</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">$349/yr — $29.08/mo, save $131</p>
          <ul className="mt-5 flex-1 space-y-2">
            {PRO.map((f) => (
              <Item key={f}>{f}</Item>
            ))}
          </ul>
          <PaidCTA tier="pro" />
        </Card>

        {/* STANDARD (right) */}
        <Card className="flex flex-col p-6">
          <p className="text-sm font-semibold">Standard</p>
          <p className="mt-2 text-3xl font-bold">
            $20<span className="text-base font-normal text-muted-foreground">/mo</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">$190/yr — $15.83/mo, save $50</p>
          <ul className="mt-5 flex-1 space-y-2">
            {STANDARD.map((f) => (
              <Item key={f}>{f}</Item>
            ))}
          </ul>
          <p className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
            Voice interview sessions available as an add-on — <span className="text-foreground">$12 each</span>.
          </p>
          <PaidCTA tier="standard" />
        </Card>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Cancel anytime — no questions asked, no email required.
      </p>
    </div>
  );
}
