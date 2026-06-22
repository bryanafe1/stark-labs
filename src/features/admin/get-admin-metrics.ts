import "server-only";
import { prisma } from "@/lib/prisma";

export interface AdminMetrics {
  totalUsers: number;
  signupsToday: number;
  signups7: number;
  signups30: number;
  payingTotal: number;
  monthly: number;
  annual: number;
  pass: number;
  mrr: number; // recurring only (subs); passes are one-time
  conversionPct: number;
  active7: number; // distinct users with a submission in the last 7 days
  submissions: number;
  lessonsInProgress: number;
  signupsByDay: { day: string; count: number }[]; // last 14 days
  recent: { email: string; tier: string; status: string; createdAt: Date }[];
}

const DAY = 86_400_000;

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const d7 = new Date(now.getTime() - 7 * DAY);
  const d30 = new Date(now.getTime() - 30 * DAY);
  const d14 = new Date(now.getTime() - 14 * DAY);

  const [
    totalUsers,
    signupsToday,
    signups7,
    signups30,
    activeSubs,
    submissions,
    lessonsInProgress,
    recentRows,
    last14,
    active7rows,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startToday } } }),
    prisma.user.count({ where: { createdAt: { gte: d7 } } }),
    prisma.user.count({ where: { createdAt: { gte: d30 } } }),
    prisma.user.findMany({
      where: { subscriptionStatus: "active", currentPeriodEnd: { gt: now } },
      select: { subscriptionTier: true },
    }),
    prisma.submission.count(),
    prisma.lessonProgress.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { email: true, subscriptionTier: true, subscriptionStatus: true, createdAt: true, role: true },
    }),
    prisma.user.findMany({ where: { createdAt: { gte: d14 } }, select: { createdAt: true } }),
    prisma.submission.findMany({ where: { createdAt: { gte: d7 } }, distinct: ["userId"], select: { userId: true } }),
  ]);

  const monthly = activeSubs.filter((u) => u.subscriptionTier === "monthly").length;
  const annual = activeSubs.filter((u) => u.subscriptionTier === "annual").length;
  const pass = activeSubs.filter((u) => u.subscriptionTier === "pass").length;
  const payingTotal = activeSubs.length;
  const mrr = monthly * 20 + annual * (190 / 12); // pass excluded (one-time)

  // signups per day, last 14 days
  const buckets = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    buckets.set(new Date(now.getTime() - i * DAY).toISOString().slice(0, 10), 0);
  }
  for (const u of last14) {
    const k = u.createdAt.toISOString().slice(0, 10);
    if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + 1);
  }

  return {
    totalUsers,
    signupsToday,
    signups7,
    signups30,
    payingTotal,
    monthly,
    annual,
    pass,
    mrr: Math.round(mrr * 100) / 100,
    conversionPct: totalUsers ? Math.round((payingTotal / totalUsers) * 1000) / 10 : 0,
    active7: active7rows.length,
    submissions,
    lessonsInProgress,
    signupsByDay: [...buckets.entries()].map(([day, count]) => ({ day, count })),
    recent: recentRows.map((r) => ({
      email: r.email,
      tier: r.role === "ADMIN" ? "admin" : (r.subscriptionTier ?? "free"),
      status: r.subscriptionStatus,
      createdAt: r.createdAt,
    })),
  };
}
