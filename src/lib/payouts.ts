import "server-only";
import { prisma } from "@/lib/prisma";

export const PAYOUT_MINIMUM_CENTS = Number(process.env.PAYOUT_MINIMUM_CENTS ?? 2500);

// Monthly-equivalent revenue per active subscription, in cents.
const MONTHLY_EQUIV: Record<string, Record<string, number>> = {
  standard: { monthly: 2000, annual: Math.round(19000 / 12) }, // $15.83
  pro: { monthly: 4000, annual: Math.round(34900 / 12) }, // $29.08
};

/** Unreversed commission earned minus everything already paid/queued. */
export async function getCreatorOwedCents(creatorId: string): Promise<number> {
  const [earned, paidOut] = await Promise.all([
    prisma.creatorEarning.aggregate({
      where: { creatorId, reversed: false },
      _sum: { commissionCents: true },
    }),
    prisma.creatorPayout.aggregate({
      where: { creatorId, status: { in: ["pending", "paid"] } },
      _sum: { amountCents: true },
    }),
  ]);
  return (earned._sum.commissionCents ?? 0) - (paidOut._sum.amountCents ?? 0);
}

export interface PayoutCreatorRow {
  id: string;
  name: string;
  email: string | null;
  code: string;
  connected: boolean;
  payoutsEnabled: boolean;
  earnedCents: number;
  paidCents: number;
  owedCents: number;
  canPay: boolean;
  payouts: { id: string; amountCents: number; status: string; createdAt: Date; note: string | null }[];
}

export async function getPayoutRows(): Promise<PayoutCreatorRow[]> {
  const [creators, earnAgg, payAgg] = await Promise.all([
    prisma.creator.findMany({
      orderBy: { createdAt: "desc" },
      include: { payouts: { orderBy: { createdAt: "desc" }, take: 6 } },
    }),
    prisma.creatorEarning.groupBy({
      by: ["creatorId"],
      where: { reversed: false },
      _sum: { commissionCents: true },
    }),
    prisma.creatorPayout.groupBy({
      by: ["creatorId"],
      where: { status: { in: ["pending", "paid"] } },
      _sum: { amountCents: true },
    }),
  ]);
  const eMap = new Map(earnAgg.map((e) => [e.creatorId, e._sum.commissionCents ?? 0]));
  const pMap = new Map(payAgg.map((p) => [p.creatorId, p._sum.amountCents ?? 0]));

  return creators.map((c) => {
    const earnedCents = eMap.get(c.id) ?? 0;
    const paidCents = pMap.get(c.id) ?? 0;
    const owedCents = earnedCents - paidCents;
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      code: c.code,
      connected: !!c.stripeConnectId,
      payoutsEnabled: c.payoutsEnabled,
      earnedCents,
      paidCents,
      owedCents,
      canPay: c.payoutsEnabled && owedCents >= PAYOUT_MINIMUM_CENTS,
      payouts: c.payouts.map((p) => ({
        id: p.id,
        amountCents: p.amountCents,
        status: p.status,
        createdAt: p.createdAt,
        note: p.note,
      })),
    };
  });
}

export interface BusinessMetrics {
  mrrCents: number;
  paidUsers: number;
  tierCounts: { standard: number; pro: number };
  intervalCounts: { monthly: number; annual: number };
  totalUsers: number;
  conversionPct: number;
  newPaidThisMonth: number;
  cancellationsThisMonth: number;
  creatorRevenueCents: number;
  commissionOwedCents: number;
  voiceSessionsSold: number;
}

export async function getBusinessMetrics(): Promise<BusinessMetrics> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [activeUsers, totalUsers, newPaidThisMonth, cancellationsThisMonth, rev, comm, paidOut, voiceSessionsSold] =
    await Promise.all([
      prisma.user.findMany({
        where: { subscriptionStatus: "active", currentPeriodEnd: { gt: now } },
        select: { planTier: true, billingInterval: true },
      }),
      prisma.user.count(),
      prisma.user.count({
        where: { subscriptionStatus: "active", currentPeriodEnd: { gt: now }, createdAt: { gte: monthStart } },
      }),
      prisma.user.count({
        where: { subscriptionStatus: "canceled", currentPeriodEnd: { gte: monthStart } },
      }),
      prisma.creatorEarning.aggregate({ where: { reversed: false }, _sum: { grossCents: true } }),
      prisma.creatorEarning.aggregate({ where: { reversed: false }, _sum: { commissionCents: true } }),
      prisma.creatorPayout.aggregate({ where: { status: { in: ["pending", "paid"] } }, _sum: { amountCents: true } }),
      prisma.sessionCredit.count(),
    ]);

  let mrrCents = 0;
  const tierCounts = { standard: 0, pro: 0 };
  const intervalCounts = { monthly: 0, annual: 0 };
  for (const u of activeUsers) {
    const tier = u.planTier === "pro" ? "pro" : "standard";
    const interval = u.billingInterval === "annual" ? "annual" : "monthly";
    mrrCents += MONTHLY_EQUIV[tier]![interval]!;
    tierCounts[tier]++;
    intervalCounts[interval]++;
  }
  const paidUsers = activeUsers.length;

  return {
    mrrCents,
    paidUsers,
    tierCounts,
    intervalCounts,
    totalUsers,
    conversionPct: totalUsers ? Math.round((paidUsers / totalUsers) * 100) : 0,
    newPaidThisMonth,
    cancellationsThisMonth,
    creatorRevenueCents: rev._sum.grossCents ?? 0,
    commissionOwedCents: (comm._sum.commissionCents ?? 0) - (paidOut._sum.amountCents ?? 0),
    voiceSessionsSold,
  };
}
