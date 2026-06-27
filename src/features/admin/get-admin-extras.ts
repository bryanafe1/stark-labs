import "server-only";
import { prisma } from "@/lib/prisma";
import { stripe, getPlanAmounts } from "@/lib/stripe";

export interface CreatorRow {
  id: string;
  name: string;
  email: string | null;
  code: string;
  notes: string | null;
  discountPercent: number;
  commissionPercent: number;
  active: boolean;
  hasAccount: boolean;
  signups: number; // users who used the code at checkout
  activePayers: number; // referred users currently paying
  grossCents: number; // revenue driven (all attributed payments)
  commissionCents: number; // commission owed/accrued
}

/** Creators + their attribution/earnings stats. */
export async function getCreatorsWithStats(): Promise<CreatorRow[]> {
  const now = new Date();
  const [creators, earnings, paying] = await Promise.all([
    prisma.creator.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { referredUsers: true } } },
    }),
    prisma.creatorEarning.groupBy({
      by: ["creatorId"],
      where: { reversed: false },
      _sum: { grossCents: true, commissionCents: true },
    }),
    prisma.user.groupBy({
      by: ["referredByCreatorId"],
      where: { subscriptionStatus: "active", currentPeriodEnd: { gt: now } },
      _count: { _all: true },
    }),
  ]);

  const eMap = new Map(earnings.map((e) => [e.creatorId, e._sum]));
  const pMap = new Map(paying.map((p) => [p.referredByCreatorId, p._count._all]));

  return creators.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    code: c.code,
    notes: c.notes,
    discountPercent: c.discountPercent,
    commissionPercent: c.commissionPercent,
    active: c.active,
    hasAccount: !!c.userId,
    signups: c._count.referredUsers,
    activePayers: pMap.get(c.id) ?? 0,
    grossCents: eMap.get(c.id)?.grossCents ?? 0,
    commissionCents: eMap.get(c.id)?.commissionCents ?? 0,
  }));
}

export interface CompedUser {
  id: string;
  email: string;
  reason: string | null;
  createdAt: Date;
}

/** Accounts with comped (free) access. */
export async function getCompedUsers(): Promise<CompedUser[]> {
  const rows = await prisma.user.findMany({
    where: { comped: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, compReason: true, createdAt: true },
    take: 50,
  });
  return rows.map((r) => ({ id: r.id, email: r.email, reason: r.compReason, createdAt: r.createdAt }));
}

/** Current per-tier sticker prices (USD), from the live Stripe price. */
export async function getPricingInfo(): Promise<{ monthly: number; annual: number; pass: number }> {
  return getPlanAmounts();
}

export interface CouponRow {
  id: string;
  code: string;
  active: boolean;
  label: string; // "20% off" / "$5 off"
  duration: string;
  timesRedeemed: number;
}

/** Stripe promotion codes (creator codes + general coupons). */
export async function getCoupons(): Promise<CouponRow[]> {
  try {
    const res = await stripe.promotionCodes.list({ limit: 60, expand: ["data.coupon"] });
    return res.data.map((pc) => {
      const c = pc.coupon;
      const label = c.percent_off
        ? `${c.percent_off}% off`
        : c.amount_off
          ? `$${(c.amount_off / 100).toFixed(2)} off`
          : "—";
      return {
        id: pc.id,
        code: pc.code,
        active: pc.active,
        label,
        duration: c.duration === "repeating" ? `${c.duration_in_months}mo` : c.duration,
        timesRedeemed: pc.times_redeemed,
      };
    });
  } catch {
    return [];
  }
}

export interface SalesInfo {
  recentVolumeCents: number; // sum of the recent charges below
  commissionOwedCents: number; // total accrued creator commission
  recent: { id: string; amountCents: number; email: string | null; created: Date; description: string | null }[];
}

/** Recent sales feed (live from Stripe) + total creator commission accrued. */
export async function getSalesInfo(): Promise<SalesInfo> {
  let recent: SalesInfo["recent"] = [];
  let recentVolumeCents = 0;
  try {
    const charges = await stripe.charges.list({ limit: 12 });
    recent = charges.data
      .filter((c) => c.paid && c.status === "succeeded")
      .map((c) => ({
        id: c.id,
        amountCents: c.amount,
        email: c.billing_details?.email ?? c.receipt_email ?? null,
        created: new Date(c.created * 1000),
        description: c.description ?? null,
      }));
    recentVolumeCents = recent.reduce((s, c) => s + c.amountCents, 0);
  } catch {
    /* Stripe unavailable → empty feed */
  }
  const commission = await prisma.creatorEarning.aggregate({
    where: { reversed: false },
    _sum: { commissionCents: true },
  });
  return {
    recentVolumeCents,
    commissionOwedCents: commission._sum.commissionCents ?? 0,
    recent,
  };
}
