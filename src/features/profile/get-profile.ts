import "server-only";
import type { RankTier } from "@prisma/client";
import type { DisciplineElo } from "@/features/arena/get-arena";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { getUserProgress } from "@/lib/user-stats";
import { DISCIPLINE_LIST } from "@/lib/constants";

// ---------------------------------------------------------------------------
//  Profile view-model — real, derived from the signed-in user + their attempts.
// ---------------------------------------------------------------------------

export interface Achievement {
  id: string;
  icon: "flame" | "trophy" | "target" | "graduation" | "swords" | "sparkles";
  title: string;
  description: string;
  earned: boolean;
}

export interface ActivityEntry {
  id: string;
  kind: "SOLVED" | "LESSON" | "MATCH" | "RANK";
  title: string;
  detail: string;
  at: string;
}

export interface ProfileViewModel {
  user: {
    username: string;
    displayName: string;
    image: string | null;
    bio: string;
    rankTier: RankTier;
    overallElo: number;
    xp: number;
    streakDays: number;
    joinedAt: string;
    globalRank: number;
  };
  disciplines: DisciplineElo[];
  stats: { problemsSolved: number; lessonsCompleted: number; matchesPlayed: number; winRate: number };
  achievements: Achievement[];
  recentActivity: ActivityEntry[];
}

export async function getProfile(): Promise<ProfileViewModel> {
  const userId = await getCurrentUserId();
  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
  const prog = userId ? await getUserProgress(userId) : null;
  const ratings = userId ? await prisma.eloRating.findMany({ where: { userId } }) : [];
  const eloByDisc = new Map(ratings.map((r) => [r.discipline, r.elo]));

  const overallElo = user?.overallElo ?? 1200;
  const solved = prog?.totalSolved ?? 0;
  const attempts = prog?.totalAttempts ?? 0;
  const accuracy = prog?.accuracyPct ?? 0;
  const streak = prog?.streakDays ?? 0;
  const xp = prog?.xp ?? 0;
  const rank = user ? (await prisma.user.count({ where: { overallElo: { gt: overallElo } } })) + 1 : 0;
  const disciplinesSolvedIn = prog
    ? Object.values(prog.byDiscipline).filter((d) => d.solved > 0).length
    : 0;

  const achievements: Achievement[] = [
    { id: "a1", icon: "target", title: "Getting Started", description: "Solve your first problem", earned: solved >= 1 },
    { id: "a2", icon: "flame", title: "On Fire", description: "7-day solving streak", earned: streak >= 7 },
    { id: "a3", icon: "target", title: "Century", description: "Solve 100 problems", earned: solved >= 100 },
    { id: "a4", icon: "sparkles", title: "Sharpshooter", description: "80%+ accuracy over 20+ attempts", earned: attempts >= 20 && accuracy >= 80 },
    { id: "a5", icon: "graduation", title: "Well Rounded", description: "Solve in 5+ disciplines", earned: disciplinesSolvedIn >= 5 },
    { id: "a6", icon: "trophy", title: "Completionist", description: "Solve every problem", earned: solved >= 162 },
  ];

  return {
    user: {
      username: user?.username ?? "you",
      displayName: user?.displayName ?? user?.name ?? user?.username ?? "Engineer",
      image: user?.image ?? null,
      bio: user?.bio ?? "",
      rankTier: (user?.rankTier ?? "BRONZE") as RankTier,
      overallElo,
      xp,
      streakDays: streak,
      joinedAt: (user?.createdAt ?? new Date()).toISOString(),
      globalRank: rank,
    },
    disciplines: DISCIPLINE_LIST.map(
      (d): DisciplineElo => ({
        discipline: d.key,
        elo: eloByDisc.get(d.key) ?? 1200,
        wins: 0,
        losses: 0,
      }),
    ),
    stats: { problemsSolved: solved, lessonsCompleted: 0, matchesPlayed: 0, winRate: accuracy },
    achievements,
    recentActivity: (prog?.recent ?? []).map(
      (r): ActivityEntry => ({
        id: `${r.problemId}-${r.at.toISOString()}`,
        kind: "SOLVED",
        title: `${r.status === "CORRECT" ? "Solved" : "Attempted"} “${r.title}”`,
        detail: DISCIPLINE_LIST.find((d) => d.key === r.discipline)?.label ?? r.discipline,
        at: r.at.toISOString(),
      }),
    ),
  };
}
