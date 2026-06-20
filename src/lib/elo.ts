import { tierForElo } from "@/lib/constants";
import type { RankTier } from "@prisma/client";

/**
 * Classic Elo expectation: probability that A beats B.
 */
export function expectedScore(eloA: number, eloB: number): number {
  return 1 / (1 + 10 ** ((eloB - eloA) / 400));
}

export interface EloUpdate {
  elo: number;
  delta: number;
  tier: RankTier;
}

/**
 * Compute a player's new Elo after a match.
 * @param actual 1 = win, 0.5 = draw, 0 = loss
 * @param k      K-factor (problem-weighted in ranked sprints)
 */
export function applyElo(
  current: number,
  opponent: number,
  actual: 0 | 0.5 | 1,
  k = 32,
): EloUpdate {
  const expected = expectedScore(current, opponent);
  const next = Math.round(current + k * (actual - expected));
  const clamped = Math.max(100, next);
  return {
    elo: clamped,
    delta: clamped - current,
    tier: tierForElo(clamped).key,
  };
}
