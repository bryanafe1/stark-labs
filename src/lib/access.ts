import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

// ---------------------------------------------------------------------------
//  The single source of truth for access decisions (server-side). Three tiers:
//  free → standard → pro. Voice simulation is gated separately by credits
//  (Standard) or a monthly allotment (Pro). Legacy active subs + comped
//  accounts are treated as Standard.
// ---------------------------------------------------------------------------

const PRO_MONTHLY_MINUTE_CAP = Number(process.env.PRO_MONTHLY_MINUTE_CAP ?? 300);
const PAST_DUE_GRACE_MS = 3 * 86_400_000; // keep access ~3 days while Stripe retries

export type Tier = "free" | "standard" | "pro";

export interface Access {
  tier: Tier;
  paid: boolean; // Standard-or-above (the general paywall gate)
  pro: boolean;
  comped: boolean;
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

const FREE: Access = {
  tier: "free",
  paid: false,
  pro: false,
  comped: false,
  status: "none",
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
};

/** Resolve a user's full access state. Pass a userId or it uses the session. */
export async function getAccess(userId?: string | null): Promise<Access> {
  const uid = userId ?? (await getCurrentUserId());
  if (!uid) return FREE;

  const u = await prisma.user.findUnique({
    where: { id: uid },
    select: {
      role: true,
      comped: true,
      subscriptionStatus: true,
      planTier: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
    },
  });
  if (!u) return FREE;

  // Admins get the top tier, no billing.
  if (u.role === "ADMIN") {
    return { tier: "pro", paid: true, pro: true, comped: false, status: "admin", currentPeriodEnd: null, cancelAtPeriodEnd: false };
  }

  const now = Date.now();
  const periodEnd = u.currentPeriodEnd ?? null;
  const active = u.subscriptionStatus === "active" && !!periodEnd && periodEnd.getTime() > now;
  const pastDueOk =
    u.subscriptionStatus === "past_due" && !!periodEnd && periodEnd.getTime() > now - PAST_DUE_GRACE_MS;

  let tier: Tier = "free";
  if (active || pastDueOk) tier = u.planTier === "pro" ? "pro" : "standard";
  else if (u.comped) tier = "standard";

  const pro = (active || pastDueOk) && u.planTier === "pro";
  const paid = active || pastDueOk || u.comped;

  return {
    tier,
    paid,
    pro,
    comped: u.comped,
    status: u.subscriptionStatus,
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: u.cancelAtPeriodEnd,
  };
}

/** General paywall gate — Standard or above (active sub, comp, or grace period). */
export async function hasPaidAccess(userId?: string | null): Promise<boolean> {
  return (await getAccess(userId)).paid;
}

/** True only for an active Pro subscriber (or admin). */
export async function isPro(userId?: string | null): Promise<boolean> {
  return (await getAccess(userId)).pro;
}

function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function startOfNextMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}

/** Voice MINUTES a Pro user has consumed this calendar month (refunds excluded).
 *  Sums completed-session durations; an in-progress session isn't counted until
 *  it ends, and the cap is only ever evaluated when STARTING a new session. */
export async function proMinutesUsedThisMonth(userId: string): Promise<number> {
  const agg = await prisma.interviewSession.aggregate({
    where: { userId, createdAt: { gte: startOfMonth() }, refunded: false },
    _sum: { durationSeconds: true },
  });
  return Math.round((agg._sum.durationSeconds ?? 0) / 60);
}

export type VoiceCheck =
  | { ok: true; via: "pro"; remainingMinutes: number; resetAt: Date }
  | { ok: true; via: "credit"; creditId: string; remaining: number }
  | { ok: false; reason: "free" }
  | { ok: false; reason: "pro_exhausted"; resetAt: Date }
  | { ok: false; reason: "need_credits" };

/**
 * Can this user START a voice simulation right now, and how is it paid for?
 *  - free          → no (upgrade wall)
 *  - pro           → yes until the monthly allotment is used, then resets
 *  - standard/comp → yes only with an unused, non-expired credit (soonest first)
 */
export async function canStartVoiceSimulation(userId?: string | null): Promise<VoiceCheck> {
  const uid = userId ?? (await getCurrentUserId());
  if (!uid) return { ok: false, reason: "free" };

  const access = await getAccess(uid);
  if (access.tier === "free") return { ok: false, reason: "free" };

  // Admins get unlimited voice sessions for testing/ops.
  if (access.status === "admin") {
    return { ok: true, via: "pro", remainingMinutes: 99999, resetAt: startOfNextMonth() };
  }

  if (access.pro) {
    // Cost guard: cap monthly voice MINUTES, evaluated ONLY at start so any
    // session already in progress always finishes (never cut off mid-interview).
    const usedMinutes = await proMinutesUsedThisMonth(uid);
    const remainingMinutes = Math.max(0, PRO_MONTHLY_MINUTE_CAP - usedMinutes);
    const resetAt = startOfNextMonth();
    if (remainingMinutes > 0) return { ok: true, via: "pro", remainingMinutes, resetAt };
    // Monthly minutes used up → fall through to any extra sessions they bought.
    const credit = await findAvailableCredit(uid);
    if (credit) return { ok: true, via: "credit", creditId: credit.id, remaining: credit.remaining };
    return { ok: false, reason: "pro_exhausted", resetAt };
  }

  // Standard (or comped) — needs a credit, spending the soonest-expiring first.
  const credit = await findAvailableCredit(uid);
  if (!credit) return { ok: false, reason: "need_credits" };
  return { ok: true, via: "credit", creditId: credit.id, remaining: credit.remaining };
}

/** The soonest-expiring available credit for a user + how many remain, or null. */
async function findAvailableCredit(uid: string): Promise<{ id: string; remaining: number } | null> {
  const now = new Date();
  const credit = await prisma.sessionCredit.findFirst({
    where: { userId: uid, status: "available", expiresAt: { gt: now } },
    orderBy: { expiresAt: "asc" },
    select: { id: true },
  });
  if (!credit) return null;
  const remaining = await prisma.sessionCredit.count({
    where: { userId: uid, status: "available", expiresAt: { gt: now } },
  });
  return { id: credit.id, remaining };
}
