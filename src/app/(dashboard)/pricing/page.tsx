import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { isSubscribed, hasProAccess } from "@/lib/entitlements";
import { startCheckout, openBillingPortal } from "@/server/actions/billing";

export const metadata: Metadata = { title: "Pricing" };

const FREE = ["Easy Mechanical lessons", "Sample practice problems", "Progress tracking"];
const PRO = [
  "All 162 interview-grade problems",
  "Every lesson, all 10 disciplines",
  "Unlimited AI mock interviews",
  "Hints & full worked solutions",
  "The ranked Arena",
];

function CheckItem({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <Check
        className={muted ? "mt-0.5 size-4 shrink-0 text-muted-foreground" : "mt-0.5 size-4 shrink-0 text-emerald-500"}
      />
      {children}
    </li>
  );
}

export default async function PricingPage() {
  const userId = await getCurrentUserId();
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true, cancelAtPeriodEnd: true, currentPeriodEnd: true },
      })
    : null;
  const subbed = await isSubscribed();
  const pro = await hasProAccess();

  // CTA for a paid plan card.
  function PaidCTA({ plan }: { plan: "monthly" | "annual" | "pass" }) {
    if (subbed) {
      if (user?.subscriptionTier === "pass") {
        return (
          <Button variant="secondary" className="mt-6 w-full" disabled>
            Pass active
          </Button>
        );
      }
      const isCurrent = user?.subscriptionTier === plan;
      return (
        <form action={openBillingPortal} className="mt-6">
          <Button type="submit" variant={isCurrent ? "default" : "secondary"} className="w-full">
            {isCurrent ? "Manage subscription" : "Switch plan"}
          </Button>
        </form>
      );
    }
    if (pro) {
      return (
        <Button variant="secondary" className="mt-6 w-full" disabled>
          Unlocked (admin)
        </Button>
      );
    }
    const label =
      plan === "pass" ? "Get the Season Pass" : plan === "annual" ? "Choose Annual" : "Choose Monthly";
    return (
      <form action={startCheckout} className="mt-6">
        <input type="hidden" name="plan" value={plan} />
        <Button type="submit" size="lg" className="w-full">
          {label}
        </Button>
      </form>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Choose your plan</h1>
        <p className="mt-1 text-muted-foreground">
          Prepping for interview season? Grab the pass. In it for the long haul? Go annual.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Season Pass — hero */}
        <Card className="relative flex flex-col border-primary/50 bg-gradient-to-br from-primary/10 to-transparent p-6 pt-9 sm:pt-6">
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3" /> Most popular
          </span>
          <p className="text-sm font-semibold text-primary">Season Pass</p>
          <p className="mt-2 text-3xl font-bold">
            $39<span className="text-base font-normal text-muted-foreground"> one-time</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">3 months full access · no auto-renew</p>
          <ul className="mt-5 flex-1 space-y-2">
            {PRO.map((f) => (
              <CheckItem key={f}>{f}</CheckItem>
            ))}
          </ul>
          <PaidCTA plan="pass" />
        </Card>

        {/* Annual */}
        <Card className="flex flex-col p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Annual</p>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Best value
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold">
            $15.83<span className="text-base font-normal text-muted-foreground">/mo</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">$190 billed yearly · save $50</p>
          <ul className="mt-5 flex-1 space-y-2">
            {PRO.map((f) => (
              <CheckItem key={f}>{f}</CheckItem>
            ))}
          </ul>
          <PaidCTA plan="annual" />
        </Card>

        {/* Monthly */}
        <Card className="flex flex-col p-6">
          <p className="text-sm font-semibold">Monthly</p>
          <p className="mt-2 text-3xl font-bold">
            $20<span className="text-base font-normal text-muted-foreground">/mo</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Full access, billed monthly</p>
          <ul className="mt-5 flex-1 space-y-2">
            {PRO.map((f) => (
              <CheckItem key={f}>{f}</CheckItem>
            ))}
          </ul>
          <PaidCTA plan="monthly" />
        </Card>

        {/* Free */}
        <Card className="flex flex-col p-6">
          <p className="text-sm font-semibold text-muted-foreground">Free</p>
          <p className="mt-2 text-3xl font-bold">
            $0<span className="text-base font-normal text-muted-foreground">/mo</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">A taste of the platform, forever</p>
          <ul className="mt-5 flex-1 space-y-2">
            {FREE.map((f) => (
              <CheckItem key={f} muted>
                {f}
              </CheckItem>
            ))}
          </ul>
          <Button variant="secondary" className="mt-6 w-full" disabled>
            {pro ? "Included" : "Your current plan"}
          </Button>
        </Card>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Cancel anytime from Settings · Secure checkout by Stripe
      </p>

      {subbed && (
        <p className="text-center text-sm font-medium text-emerald-500">
          ✓ You&apos;re on the{" "}
          {user?.subscriptionTier === "pass" ? "Season Pass" : (user?.subscriptionTier ?? "Pro")} plan.
          {user?.currentPeriodEnd
            ? ` Access through ${user.currentPeriodEnd.toLocaleDateString()}.`
            : ""}
        </p>
      )}
      {!subbed && pro && (
        <p className="text-center text-sm font-medium text-emerald-500">
          ✓ Admin access. Everything is unlocked.
        </p>
      )}
    </div>
  );
}
