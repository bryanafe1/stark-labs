import type { Discipline, NotificationType } from "@prisma/client";

/** View-model the dashboard server component hands to its children. */
export interface DashboardViewModel {
  user: {
    username: string;
    displayName: string;
    image: string | null;
    overallElo: number;
    xp: number;
    streakDays: number;
  };
  disciplines: DisciplineProgress[];
  stats: DashboardStat[];
  notifications: DashboardNotification[];
}

export interface DisciplineProgress {
  discipline: Discipline;
  elo: number;
  masteredNodes: number;
  totalNodes: number;
  /** 0–100 */
  masteryPct: number;
}

export interface DashboardStat {
  label: string;
  value: string;
  /** Signed percentage change vs. previous period. */
  deltaPct?: number;
  icon: "trophy" | "flame" | "target" | "swords";
}

export interface DashboardNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  href: string | null;
  read: boolean;
  createdAt: string;
}
