"use server";

import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { stripe, getActivePriceId, type PlanTier } from "@/lib/stripe";

function baseUrl(): string {
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

/**
 * Start a Stripe Checkout for the chosen plan, then redirect to it.
 * Used as a form action — reads the hidden `plan` field ("monthly" | "annual").
 */
export async function startCheckout(formData?: FormData): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/sign-in");

  const planRaw = formData?.get("plan");
  const tier: PlanTier =
    planRaw === "annual" ? "annual" : planRaw === "pass" ? "pass" : "monthly";

  // Optional creator code → attribute this user to the creator + apply their
  // discount. Falls back to the oc_ref cookie set by a /r/<code> referral link.
  const code =
    (String(formData?.get("code") ?? "").trim().toUpperCase() ||
      cookies().get("oc_ref")?.value?.trim().toUpperCase()) ??
    "";
  let promotionCodeId: string | null = null;
  if (code) {
    const creator = await prisma.creator.findUnique({ where: { code } });
    if (creator?.active) {
      promotionCodeId = creator.stripePromoCodeId ?? null;
      if (creator.id !== user.referredByCreatorId) {
        await prisma.user.update({
          where: { id: userId },
          data: { referredByCreatorId: creator.id },
        });
      }
    }
  }

  // Ensure the user has a Stripe customer.
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
  }

  const base = baseUrl();
  const common: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    line_items: [{ price: await getActivePriceId(tier), quantity: 1 }],
    success_url: `${base}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/pricing?canceled=1`,
    metadata: { userId, plan: tier },
    ...(promotionCodeId
      ? { discounts: [{ promotion_code: promotionCodeId }] }
      : { allow_promotion_codes: true }),
  };

  // The Season Pass is a one-time payment; monthly/annual are subscriptions.
  const session =
    tier === "pass"
      ? await stripe.checkout.sessions.create({ ...common, mode: "payment" })
      : await stripe.checkout.sessions.create({
          ...common,
          mode: "subscription",
          subscription_data: { metadata: { userId, tier } },
        });

  if (!session.url) redirect("/pricing?error=1");
  redirect(session.url);
}

/** Open the Stripe billing portal so a subscriber can manage/cancel. */
export async function openBillingPortal(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.stripeCustomerId) redirect("/pricing");

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${baseUrl()}/profile`,
  });
  redirect(portal.url);
}
