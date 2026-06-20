import "server-only";
import type { Discipline, RankTier } from "@prisma/client";
import { tierForElo } from "@/lib/constants";

// ---------------------------------------------------------------------------
//  Leaderboard view-model (mock, deterministic). Swap for Prisma when DB live:
//    overall      -> prisma.user.findMany({ orderBy:{ overallElo:'desc' } })
//    perDiscipline-> prisma.eloRating.findMany({ where:{discipline}, orderBy })
// ---------------------------------------------------------------------------

export interface LeaderRow {
  rank: number;
  username: string;
  displayName: string;
  image: string | null;
  elo: number;
  rankTier: RankTier;
  wins: number;
  losses: number;
}

const DISCIPLINE_ORDER: Discipline[] = [
  "MECHANICAL",
  "AEROSPACE",
  "ELECTRICAL",
  "COMPUTER",
  "CIVIL",
  "CHEMICAL",
  "MECHATRONICS",
  "INDUSTRIAL",
  "BIOMEDICAL",
  "ENVIRONMENTAL",
];

// Each player gets a distinct per-discipline strength profile so the boards
// reorder meaningfully when you switch tabs. Rather than hand-maintain a tuple
// per player, the offset is derived deterministically from (username,discipline)
// via a small pure hash centered into roughly [-220, +220]. No Math.random.
interface Player {
  username: string;
  displayName: string;
  base: number; // overall Elo
  wins: number;
  losses: number;
}

// Pure, deterministic per-(player, discipline) Elo offset in ~[-220, +220].
function disciplineOffset(username: string, discipline: Discipline): number {
  const key = `${username}:${discipline}`;
  let sum = 0;
  for (let i = 0; i < key.length; i++) {
    sum = (sum + key.charCodeAt(i) * (i + 1)) % 441; // 0..440
  }
  return sum - 220; // -220..220
}

const PLAYERS: Player[] = [
  { username: "vortex.k", displayName: "Katya Volkov", base: 2740, wins: 412, losses: 88 },
  { username: "n.tesla", displayName: "Niko Tesla", base: 2690, wins: 388, losses: 96 },
  { username: "prandtl", displayName: "Ludwig P.", base: 2655, wins: 370, losses: 102 },
  { username: "s.timoshenko", displayName: "Stepan T.", base: 2610, wins: 355, losses: 110 },
  { username: "ada.l", displayName: "Ada Lin", base: 2560, wins: 340, losses: 120 },
  { username: "h.reynolds", displayName: "Hana Reynolds", base: 2515, wins: 322, losses: 118 },
  { username: "g.karman", displayName: "Theo von K.", base: 2480, wins: 305, losses: 125 },
  { username: "m.curie", displayName: "Marie C.", base: 2435, wins: 290, losses: 130 },
  { username: "j.boyd", displayName: "John Boyd", base: 2390, wins: 270, losses: 140 },
  { username: "k.johnson", displayName: "Kelly Johnson", base: 2350, wins: 255, losses: 145 },
  { username: "e.torvalds", displayName: "Eli Torvalds", base: 2300, wins: 240, losses: 150 },
  { username: "r.feynman", displayName: "Ricky F.", base: 2255, wins: 228, losses: 152 },
  { username: "marco.r", displayName: "Marco Rossi", base: 2180, wins: 205, losses: 160 },
  { username: "sara.k", displayName: "Sara Khan", base: 2120, wins: 190, losses: 158 },
  { username: "jin.p", displayName: "Jin Park", base: 2040, wins: 170, losses: 150 },
  { username: "tony.s", displayName: "Tony Stark", base: 1840, wins: 155, losses: 99 },
  { username: "lia.m", displayName: "Lia Moreau", base: 1760, wins: 120, losses: 110 },
  { username: "omar.h", displayName: "Omar Hassan", base: 1680, wins: 98, losses: 102 },
  { username: "wei.c", displayName: "Wei Chen", base: 1590, wins: 80, losses: 95 },
  { username: "nora.b", displayName: "Nora Bauer", base: 1500, wins: 62, losses: 88 },
];

const CURRENT_USERNAME = "tony.s";

function toRows(sorted: { p: Player; elo: number }[]): LeaderRow[] {
  return sorted.map(({ p, elo }, i) => ({
    rank: i + 1,
    username: p.username,
    displayName: p.displayName,
    image: null,
    elo,
    rankTier: tierForElo(elo).key,
    wins: p.wins,
    losses: p.losses,
  }));
}

export interface LeaderboardViewModel {
  currentUsername: string;
  overall: LeaderRow[];
  byDiscipline: Record<Discipline, LeaderRow[]>;
}

export async function getLeaderboard(): Promise<LeaderboardViewModel> {
  const overall = toRows(
    [...PLAYERS]
      .map((p) => ({ p, elo: p.base }))
      .sort((a, b) => b.elo - a.elo),
  );

  const byDiscipline = Object.fromEntries(
    DISCIPLINE_ORDER.map((d) => {
      const rows = toRows(
        PLAYERS.map((p) => ({
          p,
          elo: Math.max(100, p.base + disciplineOffset(p.username, d)),
        })).sort((a, b) => b.elo - a.elo),
      );
      return [d, rows];
    }),
  ) as Record<Discipline, LeaderRow[]>;

  return { currentUsername: CURRENT_USERNAME, overall, byDiscipline };
}
