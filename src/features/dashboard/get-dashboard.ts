import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { getUserProgress } from "@/lib/user-stats";
import { DISCIPLINE_LIST } from "@/lib/constants";
import type { DashboardViewModel } from "@/types/dashboard";

// Real dashboard, derived from the signed-in user's saved attempts.
// A brand-new user has no submissions → everything reads zero.

function empty(): DashboardViewModel {
  return {
    user: { username: "you", displayName: "Engineer", image: null, overallElo: 1200, xp: 0, streakDays: 0 },
    disciplines: DISCIPLINE_LIST.map((d) => ({
      discipline: d.key,
      elo: 1200,
      masteredNodes: 0,
      totalNodes: 0,
      masteryPct: 0,
    })),
    stats: [
      { label: "Global Rank", value: "—", icon: "trophy" },
      { label: "Day Streak", value: "0", icon: "flame" },
      { label: "Problems Solved", value: "0", icon: "target" },
      { label: "Accuracy", value: "—", icon: "swords" },
    ],
    notifications: [],
  };
}

export async function getDashboard(): Promise<DashboardViewModel> {
  const userId = await getCurrentUserId();
  if (!userId) return empty();

  const [user, prog, ratings, notifs] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    getUserProgress(userId),
    prisma.eloRating.findMany({ where: { userId } }),
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  if (!user) return empty();

  const eloByDisc = new Map(ratings.map((r) => [r.discipline, r.elo]));
  const rank = (await prisma.user.count({ where: { overallElo: { gt: user.overallElo } } })) + 1;

  return {
    user: {
      username: user.username,
      displayName: user.displayName ?? user.name ?? user.username,
      image: user.image,
      overallElo: user.overallElo,
      xp: prog.xp,
      streakDays: prog.streakDays,
    },
    disciplines: DISCIPLINE_LIST.map((d) => {
      const st = prog.byDiscipline[d.key];
      return {
        discipline: d.key,
        elo: eloByDisc.get(d.key) ?? 1200,
        masteredNodes: st?.solved ?? 0,
        totalNodes: st?.total ?? 0,
        masteryPct: st?.masteryPct ?? 0,
      };
    }),
    stats: [
      { label: "Global Rank", value: `#${rank}`, icon: "trophy" },
      { label: "Day Streak", value: String(prog.streakDays), icon: "flame" },
      { label: "Problems Solved", value: String(prog.totalSolved), icon: "target" },
      { label: "Accuracy", value: prog.totalAttempts ? `${prog.accuracyPct}%` : "—", icon: "swords" },
    ],
    notifications: notifs.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      href: n.href,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}
