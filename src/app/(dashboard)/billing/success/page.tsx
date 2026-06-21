import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

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
      if (session.status === "complete" || session.payment_status === "paid") {
        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;
        await prisma.user.update({
          where: { id: userId },
          data: { subscriptionStatus: "active", stripeCustomerId: customerId ?? undefined },
        });
        activated = true;
      }
    } catch (err) {
      console.error("[billing success] verify failed", err);
    }
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <Card className="p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
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
