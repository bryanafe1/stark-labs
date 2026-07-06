import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { stripe, tierForPrice, PASS_DAYS, type PlanTier } from "@/lib/stripe";

export const metadata: Metadata = { title: "Welcome to Pro" };

// After Checkout, Stripe redirects here. We confirm the session and flip the
// user to active immediately (so access works even before the webhook lands).
export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  const userId = await getCurrentUserId();
  let activated = false;

  if (sessionId && userId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const ok = session.status === "complete" || session.payment_status === "paid";
      if (ok && session.mode === "payment") {
        // One-time Season Pass.
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: "active",
            subscriptionTier: "pass",
            currentPeriodEnd: new Date(Date.now() + PASS_DAYS * 86_400_000),
            cancelAtPeriodEnd: true,
            stripeCustomerId: customerId ?? undefined,
          },
        });
        activated = true;
      } else if (ok && session.subscription) {
        const subId =
          typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        const sub = await stripe.subscriptions.retrieve(subId);
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const status =
          sub.status === "active" || sub.status === "trialing"
            ? "active"
            : sub.status === "past_due"
              ? "past_due"
              : "canceled";
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: status,
            subscriptionTier:
              (sub.metadata?.tier as PlanTier | undefined) ??
              tierForPrice(sub.items.data[0]?.price?.id ?? null),
            stripeCustomerId: customerId,
            stripeSubscriptionId: sub.id,
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
          },
        });
        activated = status === "active";
      }
    } catch (err) {
      console.error("[billing success] verify failed", err);
    }
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <Card className="p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-xl bg-success/10 text-success">
          <CheckCircle2 className="size-7" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          {activated ? "You're Pro! 🎉" : "Payment received"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {activated
            ? "Everything is unlocked — all problems, every lesson, and unlimited mock interviews."
            : "Your subscription is being activated. It'll be ready in a moment."}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild>
            <Link href="/learn">Start learning</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/interview">Try a mock interview</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
