import "server-only";
import Stripe from "stripe";

// Single Stripe client. Key is read at runtime; an empty key still lets the
// module load at build time (calls only happen at request time).
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID ?? "";
