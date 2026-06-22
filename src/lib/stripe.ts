import "server-only";
import Stripe from "stripe";

// Single Stripe client. Key is read at runtime; an empty key still lets the
// module load at build time (calls only happen at request time).
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export type PlanTier = "monthly" | "annual" | "pass";

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
