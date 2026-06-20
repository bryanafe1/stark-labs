import "server-only";
import { tierForElo } from "@/lib/constants";
import type { Opponent } from "@/types/arena";

// Synthetic opponent pool. Real matchmaking would pop a player off a Redis
// queue; here we fabricate a believable rival near the user's Elo so the
// ranked loop is fully playable without live infrastructure.
const HANDLES = [
  "ada.l",
  "tesla_n",
  "g.kármán",
  "prandtl",
  "n.bohr",
  "k.johnson",
  "h.reynolds",
  "e.torvalds",
  "m.curie",
  "j.boyd",
  "r.feynman",
  "s.timoshenko",
];

/**
 * Find an opponent within ±120 Elo of the player (clamped to ≥100), seeded by
 * the player's Elo so repeated searches feel varied but stay deterministic per
 * call site is not required — variance here is intentional.
 */
export function findOpponent(userElo: number): Opponent {
  const spread = Math.round((Math.random() - 0.5) * 240); // ±120
  const elo = Math.max(100, userElo + spread);
  const name = HANDLES[Math.floor(Math.random() * HANDLES.length)] ?? "rival";
  return { name, elo, rankTier: tierForElo(elo).key };
}

/** Simulate an opponent's sprint score (0–100) given their Elo and difficulty. */
export function simulateOpponentScore(opponentElo: number): number {
  // Stronger opponents trend higher; add noise for realism.
  const base = Math.min(0.95, Math.max(0.25, (opponentElo - 800) / 1600));
  const noise = (Math.random() - 0.5) * 0.3;
  return Math.round(Math.min(1, Math.max(0, base + noise)) * 100);
}
