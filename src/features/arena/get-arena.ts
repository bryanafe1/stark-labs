import "server-only";
import type { Discipline, MatchResult } from "@prisma/client";

// ---------------------------------------------------------------------------
//  Arena hub view-model (mock). Swap for Prisma reads when DB + auth are live:
//    eloRatings -> prisma.eloRating.findMany({ where: { userId } })
//    history    -> prisma.matchParticipant.findMany({ where: { userId }, ... })
// ---------------------------------------------------------------------------

export interface DisciplineElo {
  discipline: Discipline;
  elo: number;
  wins: number;
  losses: number;
}

export interface MatchHistoryItem {
  id: string;
  discipline: Discipline;
  opponent: string;
  result: MatchResult;
  eloDelta: number;
  createdAt: string;
}

export interface ArenaViewModel {
  overallElo: number;
  disciplines: DisciplineElo[];
  history: MatchHistoryItem[];
  queueEstimateSec: number;
  onlineNow: number;
}

export async function getArena(): Promise<ArenaViewModel> {
  return {
    overallElo: 1840,
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
    history: [
      { id: "m1", discipline: "AEROSPACE", opponent: "prandtl", result: "WIN", eloDelta: 14, createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
      { id: "m2", discipline: "MECHANICAL", opponent: "s.timoshenko", result: "WIN", eloDelta: 11, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
      { id: "m3", discipline: "MECHANICAL", opponent: "h.reynolds", result: "LOSS", eloDelta: -16, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
      { id: "m4", discipline: "ELECTRICAL", opponent: "tesla_n", result: "DRAW", eloDelta: 1, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
    ],
    queueEstimateSec: 12,
    onlineNow: 1284,
  };
}
