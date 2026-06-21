import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isSubscribed, hasProAccess } from "@/lib/entitlements";
import { startCheckout, openBillingPortal } from "@/server/actions/billing";

export const metadata: Metadata = { title: "Pricing" };

const FREE = ["Easy Mechanical lessons", "8 sample practice problems", "Progress tracking"];
const PRO = [
  "All 162 interview-grade problems",
  "Every lesson, all 10 disciplines",
  "Unlimited AI mock interviews",
  "Hints & full worked solutions",
  "Resume lessons across devices",
];

export default async function PricingPage() {
  const subbed = await isSubscribed();
  const pro = await hasProAccess(); // subscribed OR admin/comp

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Simple pricing</h1>
        <p className="mt-1 text-muted-foreground">
          Start free. Go Pro when you&apos;re serious about landing the offer.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Free */}
        <Card className="flex flex-col p-6">
          <p className="text-sm font-semibold text-muted-foreground">Free</p>
          <p className="mt-2 text-3xl font-bold">
            $0<span className="text-base font-normal text-muted-foreground">/mo</span>
          </p>
          <ul className="mt-5 flex-1 space-y-2">
            {FREE.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                {f}
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="mt-6 w-full" disabled>
            {pro ? "Included" : "Your current plan"}
          </Button>
        </Card>

        {/* Pro */}
        <Card className="relative flex flex-col border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-6 pt-9 sm:pt-6">
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3" /> Most popular
          </span>
          <p className="text-sm font-semibold text-primary">Pro</p>
          <p className="mt-2 text-3xl font-bold">
            $20<span className="text-base font-normal text-muted-foreground">/mo</span>
          </p>
          <ul className="mt-5 flex-1 space-y-2">
            {PRO.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                {f}
              </li>
            ))}
          </ul>
          {subbed ? (
            <form action={openBillingPortal} className="mt-6">
              <Button type="submit" variant="secondary" className="w-full">
                Manage subscription
              </Button>
            </form>
          ) : pro ? (
            <Button variant="secondary" className="mt-6 w-full" disabled>
              Unlocked (admin)
            </Button>
          ) : (
            <form action={startCheckout} className="mt-6">
              <Button type="submit" size="lg" className="w-full">
                Upgrade to Pro · $20/mo
              </Button>
            </form>
          )}
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Cancel anytime · Secure checkout by Stripe
          </p>
        </Card>
      </div>

      {pro && (
        <p className="text-center text-sm font-medium text-emerald-500">
          ✓ Everything is unlocked.
        </p>
      )}
    </div>
  );
}
