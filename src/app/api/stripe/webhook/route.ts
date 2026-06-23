import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe, tierForPrice, PASS_DAYS, type PlanTier } from "@/lib/stripe";
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
  const price = sub.items.data[0]?.price;
  // For a subscription the billing interval is the source of truth for the tier
  // (survives admin price changes AND plan switches in the portal, where stamped
  // metadata would be stale). Fall back to metadata / known price ids otherwise.
  const interval = price?.recurring?.interval;
  const tier: PlanTier | null =
    interval === "year"
      ? "annual"
      : interval === "month"
        ? "monthly"
        : ((sub.metadata?.tier as PlanTier | undefined) ?? tierForPrice(price?.id ?? null));
  const data = {
    subscriptionStatus: mapStatus(sub.status),
    subscriptionTier: tier,
    stripeSubscriptionId: sub.id,
    stripeCustomerId: customerId,
    currentPeriodEnd: new Date(sub.current_period_end * 1000),
    cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
  };
  const res = await prisma.user.updateMany({ where: { stripeCustomerId: customerId }, data });
  if (res.count === 0) {
    console.warn("[stripe webhook] no user found for customer", customerId);
  }
}

/**
 * Record a creator commission for a paid conversion, if the paying user was
 * referred by a creator. Idempotent on the Stripe event id.
 */
async function creditCreator(opts: {
  userId?: string | null;
  customerId?: string | null;
  grossCents: number;
  eventId: string;
  description: string;
}) {
  if (!opts.grossCents || opts.grossCents <= 0) return;
  const user = opts.userId
    ? await prisma.user.findUnique({
        where: { id: opts.userId },
        select: { id: true, referredByCreatorId: true },
      })
    : opts.customerId
      ? await prisma.user.findFirst({
          where: { stripeCustomerId: opts.customerId },
          select: { id: true, referredByCreatorId: true },
        })
      : null;
  if (!user?.referredByCreatorId) return;
  const creator = await prisma.creator.findUnique({
    where: { id: user.referredByCreatorId },
    select: { id: true, commissionPercent: true },
  });
  if (!creator) return;
  const commissionCents = Math.round((opts.grossCents * creator.commissionPercent) / 100);
  try {
    await prisma.creatorEarning.create({
      data: {
        creatorId: creator.id,
        userId: user.id,
        stripeEventId: opts.eventId,
        grossCents: opts.grossCents,
        commissionCents,
        description: opts.description,
      },
    });
  } catch {
    // Unique stripeEventId violation → this event was already credited.
  }
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
            // One-time pass is paid in full here → credit the creator now.
            await creditCreator({
              userId,
              grossCents: s.amount_total ?? 0,
              eventId: event.id,
              description: "Season Pass",
            });
          }
        } else if (s.subscription) {
          // Subscription → pull the full object for period end, tier, flags.
          // (Commission is credited on invoice.paid, covering first + renewals.)
          const subId = typeof s.subscription === "string" ? s.subscription : s.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await applySubscription(sub);
        }
        break;
      }
      case "invoice.paid": {
        const inv = event.data.object as Stripe.Invoice;
        // Credit ONLY the initial charge and true renewals. Skip plan-change
        // prorations (subscription_update) and one-off invoices, which would
        // otherwise over-pay the creator on every upgrade/downgrade.
        if (inv.billing_reason !== "subscription_create" && inv.billing_reason !== "subscription_cycle") {
          break;
        }
        const customerId = typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
        await creditCreator({
          customerId,
          grossCents: inv.amount_paid ?? 0,
          eventId: event.id,
          description: inv.billing_reason === "subscription_create" ? "First subscription payment" : "Subscription renewal",
        });
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
