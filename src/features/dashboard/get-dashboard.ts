import "server-only";
import type { DashboardViewModel } from "@/types/dashboard";

/**
 * Server-only loader for the dashboard view-model.
 *
 * Today this returns a deterministic mock so the shell renders end-to-end with
 * zero database setup. Swap the body for the Prisma reads below once auth + DB
 * are wired — the return shape is the stable contract the UI depends on.
 *
 *   const [user, ratings, progress, notifications] = await prisma.$transaction([
 *     prisma.user.findUniqueOrThrow({ where: { id: userId } }),
 *     prisma.eloRating.findMany({ where: { userId } }),
 *     prisma.skillProgress.groupBy({ by: ["status"], where: { userId }, _count: true }),
 *     prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 8 }),
 *   ]);
 */
export async function getDashboard(): Promise<DashboardViewModel> {
  return {
    user: {
      username: "tony.s",
      displayName: "Tony Stark",
      image: null,
      overallElo: 1840,
      xp: 12450,
      streakDays: 14,
    },
    disciplines: [
      { discipline: "MECHANICAL", elo: 1920, masteredNodes: 18, totalNodes: 24, masteryPct: 75 },
      { discipline: "AEROSPACE", elo: 1985, masteredNodes: 16, totalNodes: 21, masteryPct: 76 },
      { discipline: "ELECTRICAL", elo: 1760, masteredNodes: 12, totalNodes: 22, masteryPct: 55 },
      { discipline: "COMPUTER", elo: 1845, masteredNodes: 15, totalNodes: 23, masteryPct: 65 },
      { discipline: "CIVIL", elo: 1610, masteredNodes: 8, totalNodes: 20, masteryPct: 40 },
      { discipline: "CHEMICAL", elo: 1690, masteredNodes: 10, totalNodes: 19, masteryPct: 53 },
      { discipline: "MECHATRONICS", elo: 1880, masteredNodes: 14, totalNodes: 19, masteryPct: 74 },
      { discipline: "INDUSTRIAL", elo: 1575, masteredNodes: 7, totalNodes: 17, masteryPct: 41 },
      { discipline: "BIOMEDICAL", elo: 1720, masteredNodes: 11, totalNodes: 21, masteryPct: 52 },
      { discipline: "ENVIRONMENTAL", elo: 1540, masteredNodes: 6, totalNodes: 18, masteryPct: 33 },
    ],
    stats: [
      { label: "Global Rank", value: "#412", deltaPct: 8.2, icon: "trophy" },
      { label: "Day Streak", value: "14", deltaPct: 0, icon: "flame" },
      { label: "Problems Solved", value: "327", deltaPct: 12.4, icon: "target" },
      { label: "Ranked W/L", value: "68%", deltaPct: 3.1, icon: "swords" },
    ],
    notifications: [
      {
        id: "n1",
        type: "MATCH_FOUND",
        title: "Ranked match found",
        body: "Aerospace sprint vs. an Elo 1990 opponent.",
        href: "/arena",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
      {
        id: "n2",
        type: "RANK_CHANGE",
        title: "Promoted to Platinum",
        body: "Mechanical Elo crossed 1800. Keep climbing.",
        href: "/leaderboard",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      },
      {
        id: "n3",
        type: "COMMENT_REPLY",
        title: "New reply in “Buckling of slender columns”",
        body: "@ada replied to your solution breakdown.",
        href: "/community",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: "n4",
        type: "SKILL_UNLOCKED",
        title: "Skill unlocked: Control systems basics",
        body: "Complete the lesson to start the Mechatronics track.",
        href: "/learn",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      },
    ],
  };
}
