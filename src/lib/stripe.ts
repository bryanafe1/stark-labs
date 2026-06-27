import "server-only";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// Single Stripe client. Key is read at runtime; an empty key still lets the
// module load at build time (calls only happen at request time).
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export type PlanTier = "monthly" | "annual" | "pass";

/** Default sticker prices (USD), used when no Stripe price is configured yet. */
export const DEFAULT_AMOUNTS: Record<PlanTier, number> = { monthly: 20, annual: 190, pass: 39 };

export const STRIPE_PRICE_MONTHLY = process.env.STRIPE_PRICE_ID ?? "";
export const STRIPE_PRICE_ANNUAL = process.env.STRIPE_PRICE_ID_ANNUAL ?? "";
export const STRIPE_PRICE_PASS = process.env.STRIPE_PRICE_ID_PASS ?? "";

/** A one-time Season Pass grants this many days of access (no auto-renew). */
export const PASS_DAYS = 90;

/** Price id for a chosen plan tier. */
export function priceIdFor(tier: PlanTier): string {
  if (tier === "annual") return STRIPE_PRICE_ANNUAL;
  if (tier === "pass") return STRIPE_PRICE_PASS;
  return STRIPE_PRICE_MONTHLY;
}

/** Map a Stripe price id back to our tier label. */
export function tierForPrice(priceId: string | null | undefined): PlanTier | null {
  if (!priceId) return null;
  if (priceId === STRIPE_PRICE_ANNUAL) return "annual";
  if (priceId === STRIPE_PRICE_PASS) return "pass";
  if (priceId === STRIPE_PRICE_MONTHLY) return "monthly";
  return null;
}

// ---------------------------------------------------------------------------
//  Admin-controlled pricing — the active price ids live in AppSetting so they
//  can be changed from the admin without a redeploy (env is the fallback).
// ---------------------------------------------------------------------------

const PRICE_KEY = (tier: PlanTier) => `price_${tier}`;

/** The price id checkout should currently use for a tier (DB override → env). */
export async function getActivePriceId(tier: PlanTier): Promise<string> {
  const row = await prisma.appSetting.findUnique({ where: { key: PRICE_KEY(tier) } });
  return row?.value || priceIdFor(tier);
}

/** Current sticker amounts (USD) for each tier, read from the live Stripe price. */
export async function getPlanAmounts(): Promise<Record<PlanTier, number>> {
  const out: Record<PlanTier, number> = { ...DEFAULT_AMOUNTS };
  await Promise.all(
    (["monthly", "annual", "pass"] as PlanTier[]).map(async (t) => {
      try {
        const id = await getActivePriceId(t);
        if (!id) return;
        const p = await stripe.prices.retrieve(id);
        if (p.unit_amount != null) out[t] = p.unit_amount / 100;
      } catch {
        /* keep default */
      }
    }),
  );
  return out;
}

/**
 * Change a plan's price: Stripe prices are immutable, so create a NEW price on
 * the same product and point the active-price setting at it. Existing
 * subscribers keep their old price; new checkouts use the new one.
 */
export async function createPlanPrice(tier: PlanTier, unitAmountCents: number): Promise<string> {
  const currentId = await getActivePriceId(tier);
  let productId: string | undefined;
  if (currentId) {
    try {
      const cur = await stripe.prices.retrieve(currentId);
      productId = typeof cur.product === "string" ? cur.product : cur.product.id;
    } catch {
      /* fall through to creating a product */
    }
  }
  if (!productId) {
    const product = await stripe.products.create({ name: `Overclocker ${tier}` });
    productId = product.id;
  }
  const price = await stripe.prices.create({
    product: productId,
    currency: "usd",
    unit_amount: unitAmountCents,
    ...(tier === "pass" ? {} : { recurring: { interval: tier === "annual" ? "year" : "month" } }),
  });
  await prisma.appSetting.upsert({
    where: { key: PRICE_KEY(tier) },
    create: { key: PRICE_KEY(tier), value: price.id },
    update: { value: price.id },
  });
  return price.id;
}

// ---------------------------------------------------------------------------
//  Coupons / promotion codes (creator codes + general promos)
// ---------------------------------------------------------------------------

/** Create a creator's discount: a forever percent-off coupon + a promo code. */
export async function createCreatorPromo(code: string, percentOff: number) {
  const coupon = await stripe.coupons.create({
    percent_off: percentOff,
    duration: "forever",
    name: `Creator ${code.toUpperCase()}`,
  });
  const promo = await stripe.promotionCodes.create({ coupon: coupon.id, code: code.toUpperCase() });
  return { couponId: coupon.id, promoId: promo.id };
}

/** Create a standalone promo (general coupon manager). */
export async function createPromo(opts: {
  code: string;
  percentOff?: number;
  amountOffCents?: number;
  durationMonths?: number;
}) {
  const coupon = await stripe.coupons.create({
    name: opts.code.toUpperCase(),
    ...(opts.percentOff
      ? { percent_off: opts.percentOff }
      : { amount_off: opts.amountOffCents ?? 0, currency: "usd" }),
    ...(opts.durationMonths
      ? { duration: "repeating", duration_in_months: opts.durationMonths }
      : { duration: "once" }),
  });
  const promo = await stripe.promotionCodes.create({ coupon: coupon.id, code: opts.code.toUpperCase() });
  return { couponId: coupon.id, promoId: promo.id };
}

/** Enable/disable a promotion code. */
export async function setPromoActive(promoId: string, active: boolean) {
  await stripe.promotionCodes.update(promoId, { active });
}

// ---------------------------------------------------------------------------
//  New two-tier model (Standard / Pro) + one-time Voice Session credit.
//  Price ids come from the Stripe setup script (scripts/stripe-setup.js).
// ---------------------------------------------------------------------------

export type PlanTierName = "standard" | "pro";
export type BillingInterval = "monthly" | "annual";

export const VOICE_SESSION_PRICE_ID = process.env.STRIPE_VOICE_SESSION_PRICE_ID ?? "";
export const VOICE_SESSION_EXPIRY_DAYS = Number(process.env.VOICE_SESSION_EXPIRY_DAYS ?? 90);

/** The Stripe price id for a plan tier + interval. */
export function planPriceId(tier: PlanTierName, interval: BillingInterval): string {
  if (tier === "pro") {
    return interval === "annual"
      ? (process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? "")
      : (process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "");
  }
  return interval === "annual"
    ? (process.env.STRIPE_STANDARD_ANNUAL_PRICE_ID ?? "")
    : (process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID ?? "");
}

/** Map a Stripe price id back to a plan tier + interval (the webhook's source of truth). */
export function planForPrice(priceId: string | null | undefined): { tier: PlanTierName; interval: BillingInterval } | null {
  if (!priceId) return null;
  const m: Record<string, { tier: PlanTierName; interval: BillingInterval }> = {};
  const add = (id: string | undefined, tier: PlanTierName, interval: BillingInterval) => {
    if (id) m[id] = { tier, interval };
  };
  add(process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID, "standard", "monthly");
  add(process.env.STRIPE_STANDARD_ANNUAL_PRICE_ID, "standard", "annual");
  add(process.env.STRIPE_PRO_MONTHLY_PRICE_ID, "pro", "monthly");
  add(process.env.STRIPE_PRO_ANNUAL_PRICE_ID, "pro", "annual");
  return m[priceId] ?? null;
}
