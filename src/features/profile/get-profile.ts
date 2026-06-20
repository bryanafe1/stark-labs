import "server-only";
import type { RankTier } from "@prisma/client";
import type { DisciplineElo } from "@/features/arena/get-arena";

// ---------------------------------------------------------------------------
//  Profile view-model (mock). Swap for Prisma reads when DB + auth are live.
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

function ago(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export async function getProfile(): Promise<ProfileViewModel> {
  return {
    user: {
      username: "tony.s",
      displayName: "Tony Stark",
      image: null,
      bio: "Mechanical + aerospace. Prepping for senior structures interviews. Coffee-driven FEA enjoyer.",
      rankTier: "PLATINUM",
      overallElo: 1840,
      xp: 12450,
      streakDays: 14,
      joinedAt: ago(212),
      globalRank: 16,
    },
    disciplines: [
      { discipline: "MECHANICAL", elo: 1920, wins: 41, losses: 19 },
      { discipline: "AEROSPACE", elo: 1985, wins: 37, losses: 12 },
      { discipline: "ELECTRICAL", elo: 1760, wins: 28, losses: 22 },
      { discipline: "COMPUTER", elo: 1845, wins: 33, losses: 21 },
      { discipline: "CIVIL", elo: 1610, wins: 14, losses: 16 },
      { discipline: "CHEMICAL", elo: 1690, wins: 19, losses: 17 },
      { discipline: "MECHATRONICS", elo: 1880, wins: 31, losses: 18 },
      { discipline: "INDUSTRIAL", elo: 1575, wins: 12, losses: 14 },
      { discipline: "BIOMEDICAL", elo: 1720, wins: 22, losses: 20 },
      { discipline: "ENVIRONMENTAL", elo: 1540, wins: 9, losses: 13 },
    ],
    stats: { problemsSolved: 327, lessonsCompleted: 18, matchesPlayed: 254, winRate: 68 },
    achievements: [
      { id: "a1", icon: "flame", title: "On Fire", description: "14-day solving streak", earned: true },
      { id: "a2", icon: "trophy", title: "Top 20", description: "Reached global top 20", earned: true },
      { id: "a3", icon: "swords", title: "Duelist", description: "Win 50 ranked sprints", earned: true },
      { id: "a4", icon: "graduation", title: "Scholar", description: "Complete 15 lessons", earned: true },
      { id: "a5", icon: "target", title: "Sharpshooter", description: "Solve 500 problems", earned: false },
      { id: "a6", icon: "sparkles", title: "Grandmaster", description: "Reach 2700 Elo in any track", earned: false },
    ],
    recentActivity: [
      { id: "r1", kind: "RANK", title: "Promoted to Platinum", detail: "Aerospace · 1985 Elo", at: ago(0) },
      { id: "r2", kind: "SOLVED", title: "Solved “Euler Buckling Load”", detail: "Civil · +18 XP", at: ago(0) },
      { id: "r3", kind: "MATCH", title: "Won ranked sprint vs prandtl", detail: "Aerospace · +14 Elo", at: ago(1) },
      { id: "r4", kind: "LESSON", title: "Completed “Beam Bending & Deflection”", detail: "Mechanical", at: ago(2) },
      { id: "r5", kind: "SOLVED", title: "Solved “Heat Exchanger Sizing”", detail: "Mechanical · +22 XP", at: ago(3) },
    ],
  };
}
