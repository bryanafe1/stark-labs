import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe, planForPrice, VOICE_SESSION_EXPIRY_DAYS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// The ONLY place that updates tier, subscription status, and session credits.
// The client never tells the server what tier a user is — this webhook does.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mapStatus(s: Stripe.Subscription.Status): string {
  if (s === "active" || s === "trialing") return "active";
  if (s === "past_due") return "past_due";
  return "canceled"; // canceled, unpaid, incomplete, incomplete_expired, paused
}

function customerIdOf(c: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined): string | undefined {
  if (!c) return undefined;
  return typeof c === "string" ? c : c.id;
}

/** Mirror a subscription's tier/interval/status onto the matching user. */
async function applySubscription(sub: Stripe.Subscription) {
  const customerId = customerIdOf(sub.customer);
  if (!customerId) return;
  const price = sub.items.data[0]?.price;
  const interval = price?.recurring?.interval; // month | year
  const mapped = planForPrice(price?.id ?? null);
  const metaTier = sub.metadata?.planTier;
  const planTier =
    mapped?.tier ?? (metaTier === "pro" ? "pro" : metaTier === "standard" ? "standard" : null);
  const billingInterval =
    mapped?.interval ??
    (interval === "year" ? "annual" : interval === "month" ? "monthly" : sub.metadata?.interval ?? null);

  await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: {
      subscriptionStatus: mapStatus(sub.status),
      planTier,
      billingInterval,
      subscriptionTier: planTier, // keep the legacy field roughly in sync
      stripeSubscriptionId: sub.id,
      stripeCustomerId: customerId,
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
    },
  });
}

/** Create one voice-session credit (idempotent on the payment-intent id). */
async function createVoiceCredit(userId: string, stripeRef: string) {
  if (!userId || !stripeRef) return;
  try {
    await prisma.sessionCredit.create({
      data: {
        userId,
        stripeRef,
        status: "available",
        expiresAt: new Date(Date.now() + VOICE_SESSION_EXPIRY_DAYS * 86_400_000),
      },
    });
  } catch {
    /* unique stripeRef → already created (e.g. backup handler ran) */
  }
}

/** Record a creator commission for a paid invoice (idempotent on the event id). */
async function creditCreatorForInvoice(
  customerId: string | undefined,
  grossCents: number,
  eventId: string,
  invoiceId: string | null,
  description: string,
) {
  if (!customerId || !grossCents || grossCents <= 0) return;
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
    select: { id: true, referredByCreatorId: true },
  });
  if (!user?.referredByCreatorId) return;
  const creator = await prisma.creator.findUnique({
    where: { id: user.referredByCreatorId },
    select: { id: true, commissionPercent: true },
  });
  if (!creator) return;
  const commissionCents = Math.round((grossCents * creator.commissionPercent) / 100);
  try {
    await prisma.creatorEarning.create({
      data: {
        creatorId: creator.id,
        userId: user.id,
        stripeEventId: eventId,
        invoiceId,
        grossCents,
        commissionCents,
        description,
      },
    });
  } catch {
    /* unique stripeEventId → already credited */
  }
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_PAYMENTS_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET;
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
        if (s.mode === "subscription" && s.subscription) {
          const subId = typeof s.subscription === "string" ? s.subscription : s.subscription.id;
          await applySubscription(await stripe.subscriptions.retrieve(subId));
        } else if (s.mode === "payment" && s.metadata?.type === "voice_session") {
          const userId = s.metadata?.userId;
          const pi = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id;
          if (userId && pi) await createVoiceCredit(userId, pi);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const inv = event.data.object as Stripe.Invoice;
        const subId = typeof inv.subscription === "string" ? inv.subscription : inv.subscription?.id;
        if (subId) await applySubscription(await stripe.subscriptions.retrieve(subId));
        // Commission on the initial charge + true renewals (not prorations).
        if (inv.billing_reason === "subscription_create" || inv.billing_reason === "subscription_cycle") {
          await creditCreatorForInvoice(
            customerIdOf(inv.customer),
            inv.amount_paid ?? 0,
            event.id,
            inv.id ?? null,
            inv.billing_reason === "subscription_create" ? "First subscription payment" : "Subscription renewal",
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const customerId = customerIdOf(inv.customer);
        if (customerId) {
          // Don't revoke access — Stripe retries. Access continues via the grace window.
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: { subscriptionStatus: "past_due" },
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await applySubscription(event.data.object as Stripe.Subscription);
        break;
      }

      case "payment_intent.succeeded": {
        // Backup for the one-time voice session (in case checkout.session.completed was missed).
        const pi = event.data.object as Stripe.PaymentIntent;
        if (pi.metadata?.type === "voice_session" && pi.metadata?.userId) {
          await createVoiceCredit(pi.metadata.userId, pi.id);
        }
        break;
      }

      case "charge.refunded": {
        const ch = event.data.object as Stripe.Charge;
        const piId = typeof ch.payment_intent === "string" ? ch.payment_intent : ch.payment_intent?.id;
        // Voice-session refund → void the (unused) credit.
        if (piId) {
          await prisma.sessionCredit.updateMany({
            where: { stripeRef: piId, status: "available" },
            data: { status: "refunded" },
          });
        }
        // Subscription-payment refund → reverse the creator commission.
        const invId = typeof ch.invoice === "string" ? ch.invoice : ch.invoice?.id;
        if (invId) {
          await prisma.creatorEarning.updateMany({
            where: { invoiceId: invId, reversed: false },
            data: { reversed: true },
          });
        }
        break;
      }

      case "account.updated": {
        // A creator finished (or changed) Connect onboarding.
        const acct = event.data.object as Stripe.Account;
        const enabled = !!acct.payouts_enabled && !!acct.details_submitted;
        await prisma.creator.updateMany({
          where: { stripeConnectId: acct.id },
          data: { payoutsEnabled: enabled },
        });
        break;
      }
    }
  } catch (err) {
    console.error("[payments webhook] handler error", err);
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
