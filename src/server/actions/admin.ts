"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin-auth";
import {
  createCreatorPromo,
  createPromo,
  setPromoActive,
  createPlanPrice,
  type PlanTier,
} from "@/lib/stripe";

// Every action is admin-only. Throwing here is fine: the admin UI is the only
// caller and a non-admin can't reach it.
async function requireAdmin() {
  if (!isAdminAuthed()) throw new Error("Not authorized");
}

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function cleanCode(s: string): string {
  return s.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

function refresh() {
  revalidatePath("/admin");
}

// ---- Creators -------------------------------------------------------------

export async function createCreator(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase() || null;
  const code = cleanCode(String(formData.get("code") ?? ""));
  const discountPercent = clampPct(Number(formData.get("discountPercent")) || 20);
  const commissionPercent = clampPct(Number(formData.get("commissionPercent")) || 10);
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!name || !code) throw new Error("Name and code are required.");
  if (await prisma.creator.findUnique({ where: { code } })) {
    throw new Error("That code already exists.");
  }
  // Keep creator emails unique so comp-linking on signup is unambiguous.
  if (email && (await prisma.creator.findFirst({ where: { email } }))) {
    throw new Error("A creator with that email already exists.");
  }

  // Stripe coupon + promotion code backing the creator code.
  const { couponId, promoId } = await createCreatorPromo(code, discountPercent);
  const creator = await prisma.creator.create({
    data: {
      name,
      email,
      code,
      discountPercent,
      commissionPercent,
      notes,
      stripeCouponId: couponId,
      stripePromoCodeId: promoId,
    },
  });

  // If they already have an account, link + comp it immediately. Otherwise the
  // link happens automatically when they sign up (linkCreatorByEmail).
  if (email) {
    const u = await prisma.user.findUnique({ where: { email } });
    if (u) {
      await prisma.creator.update({ where: { id: creator.id }, data: { userId: u.id } });
      await prisma.user.update({
        where: { id: u.id },
        data: { comped: true, compReason: `Creator: ${name}` },
      });
    }
  }
  refresh();
}

export async function setCreatorActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const active = String(formData.get("active")) === "true";
  const creator = await prisma.creator.findUnique({ where: { id } });
  if (!creator) return;
  if (creator.stripePromoCodeId) {
    try {
      await setPromoActive(creator.stripePromoCodeId, active);
    } catch {
      /* promo may have been deleted in Stripe; keep DB state authoritative */
    }
  }
  await prisma.creator.update({ where: { id }, data: { active } });
  refresh();
}

// ---- Comp access ----------------------------------------------------------

export async function grantComp(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const reason = String(formData.get("reason") ?? "").trim() || "Comp";
  if (!email) throw new Error("Email required.");
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u) throw new Error("No account with that email yet. They must sign up first.");
  await prisma.user.update({ where: { id: u.id }, data: { comped: true, compReason: reason } });
  refresh();
}

export async function revokeComp(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId"));
  await prisma.user.update({ where: { id: userId }, data: { comped: false } });
  refresh();
}

// ---- Pricing --------------------------------------------------------------

export async function updatePlanPrice(formData: FormData) {
  await requireAdmin();
  const tier = String(formData.get("tier")) as PlanTier;
  const dollars = Number(formData.get("amount"));
  if (!["monthly", "annual", "pass"].includes(tier) || !(dollars > 0)) {
    throw new Error("Enter a valid amount.");
  }
  await createPlanPrice(tier, Math.round(dollars * 100));
  revalidatePath("/admin");
  revalidatePath("/pricing");
}

// ---- Coupons --------------------------------------------------------------

export async function createCouponAction(formData: FormData) {
  await requireAdmin();
  const code = cleanCode(String(formData.get("code") ?? ""));
  const kind = String(formData.get("kind"));
  const value = Number(formData.get("value"));
  const durationMonths = Number(formData.get("durationMonths")) || undefined;
  if (!code || !(value > 0)) throw new Error("Code and a positive value are required.");
  await createPromo({
    code,
    ...(kind === "amount" ? { amountOffCents: Math.round(value * 100) } : { percentOff: clampPct(value) }),
    durationMonths,
  });
  refresh();
}

export async function setCouponActiveAction(formData: FormData) {
  await requireAdmin();
  const promoId = String(formData.get("promoId"));
  const active = String(formData.get("active")) === "true";
  try {
    await setPromoActive(promoId, active);
  } catch {
    /* ignore */
  }
  refresh();
}
