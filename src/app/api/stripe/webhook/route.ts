import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe, tierForPrice, PASS_DAYS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Stripe is the source of truth for subscription state. We mirror the full
// subscription onto the User row keyed by stripeCustomerId.

function mapStatus(s: Stripe.Subscription.Status): string {
  if (s === "active" || s === "trialing") return "active";
  if (s === "past_due") return "past_due";
  return "canceled"; // canceled, unpaid, incomplete, incomplete_expired, paused
}

/** Write a Stripe subscription's state onto the matching user. */
async function applySubscription(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const priceId = sub.items.data[0]?.price?.id ?? null;
  const data = {
    subscriptionStatus: mapStatus(sub.status),
    subscriptionTier: tierForPrice(priceId),
    stripeSubscriptionId: sub.id,
    stripeCustomerId: customerId,
    currentPeriodEnd: new Date(sub.current_period_end * 1000),
    cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
  };
  await prisma.user.updateMany({ where: { stripeCustomerId: customerId }, data });
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "missing signature/secret" }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.mode === "payment") {
          // One-time Season Pass → grant a fixed window of access, no renewal.
          const userId = s.metadata?.userId;
          const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id;
          if (userId) {
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
          }
        } else if (s.subscription) {
          // Subscription → pull the full object for period end, tier, flags.
          const subId = typeof s.subscription === "string" ? s.subscription : s.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await applySubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await applySubscription(event.data.object as Stripe.Subscription);
        break;
      }
    }
  } catch (err) {
    console.error("[stripe webhook] handler error", err);
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
