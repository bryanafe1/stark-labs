"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { stripe, STRIPE_PRICE_ID } from "@/lib/stripe";

function baseUrl(): string {
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

/** Start a Stripe Checkout for the $5/mo subscription, then redirect to it. */
export async function startCheckout(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/sign-in");

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
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${base}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/pricing?canceled=1`,
    allow_promotion_codes: true,
    subscription_data: { metadata: { userId } },
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
