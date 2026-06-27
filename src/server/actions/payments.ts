"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { getAccess } from "@/lib/access";
import {
  stripe,
  planPriceId,
  ensurePortalConfiguration,
  VOICE_SESSION_PRICE_ID,
  type PlanTierName,
  type BillingInterval,
} from "@/lib/stripe";

function baseUrl(): string {
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

async function ensureCustomer(userId: string, email: string, existing: string | null): Promise<string> {
  if (existing) return existing;
  const customer = await stripe.customers.create({ email, metadata: { userId } });
  await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customer.id } });
  return customer.id;
}

/**
 * Flow 1 — subscription checkout (Standard or Pro, monthly or annual), with an
 * optional creator discount code (also recorded for attribution + commission).
 */
export async function startSubscription(formData: FormData): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/sign-in");

  const tier: PlanTierName = formData.get("tier") === "pro" ? "pro" : "standard";
  const interval: BillingInterval = formData.get("interval") === "annual" ? "annual" : "monthly";
  const priceId = planPriceId(tier, interval);
  if (!priceId) redirect("/pricing?error=notconfigured");

  // Optional creator code → attribution + discount.
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  let promotionCodeId: string | null = null;
  if (code) {
    const creator = await prisma.creator.findUnique({ where: { code } });
    if (creator?.active) {
      promotionCodeId = creator.stripePromoCodeId ?? null;
      if (creator.id !== user.referredByCreatorId) {
        await prisma.user.update({ where: { id: userId }, data: { referredByCreatorId: creator.id } });
      }
    }
  }

  const customer = await ensureCustomer(userId, user.email, user.stripeCustomerId);
  const base = baseUrl();
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    customer,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/dashboard?upgraded=1`,
    cancel_url: `${base}/pricing?canceled=1`,
    metadata: { userId, planTier: tier, interval },
    subscription_data: { metadata: { userId, planTier: tier, interval } },
    ...(promotionCodeId
      ? { discounts: [{ promotion_code: promotionCodeId }] }
      : { allow_promotion_codes: true }),
  };
  const session = await stripe.checkout.sessions.create(params);
  if (!session.url) redirect("/pricing?error=1");
  redirect(session.url);
}

/** Flow 2 — buy a single voice session ($12 one-time → one 90-day credit). */
export async function buyVoiceSession(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/sign-in");
  if (!VOICE_SESSION_PRICE_ID) redirect("/pricing?error=notconfigured");

  // Voice credits only work for Standard-tier accounts. Free users must
  // subscribe first; Pro already gets monthly sessions (credits wouldn't apply).
  const access = await getAccess(userId);
  if (!access.paid) redirect("/pricing");
  if (access.pro) redirect("/simulation");

  const customer = await ensureCustomer(userId, user.email, user.stripeCustomerId);
  const base = baseUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer,
    line_items: [{ price: VOICE_SESSION_PRICE_ID, quantity: 1 }],
    success_url: `${base}/dashboard?voice=1`,
    cancel_url: `${base}/simulation?canceled=1`,
    metadata: { userId, type: "voice_session" },
    payment_intent_data: { metadata: { userId, type: "voice_session" } },
  });
  if (!session.url) redirect("/simulation?error=1");
  redirect(session.url);
}

/** Flow 3 — Customer Portal (manage/cancel/switch plan, update card, invoices). */
export async function openPortal(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.stripeCustomerId) redirect("/pricing");
  // Use a portal configuration that lists the Standard + Pro products, so the
  // "Switch plan" option actually offers plans to switch to (the default config
  // enables subscription_update but with zero products → nothing to switch to).
  const configuration = await ensurePortalConfiguration();
  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${baseUrl()}/settings`,
    ...(configuration ? { configuration } : {}),
  });
  redirect(portal.url);
}
