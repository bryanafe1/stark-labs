import type {
  Difficulty,
  Discipline,
  EvaluationMode,
  MatchResult,
  RankTier,
} from "@prisma/client";

// ---------------------------------------------------------------------------
//  Arena shared types. Kept out of the "use server" action module so plain
//  constants (initial states) can live alongside the types they describe.
// ---------------------------------------------------------------------------

export interface Opponent {
  name: string;
  elo: number;
  rankTier: RankTier;
}

/** Result of a successful matchmaking search — includes projected Elo swings. */
export interface MatchPreview {
  ok: true;
  discipline: Discipline;
  difficulty: Difficulty;
  userElo: number;
  opponent: Opponent;
  winDelta: number; // projected Elo gain on a win
  lossDelta: number; // projected Elo loss (negative)
  winChancePct: number;
}

export type FindMatchState =
  | { ok: false; error?: string }
  | MatchPreview;

export const INITIAL_FIND_MATCH: FindMatchState = { ok: false };

/** A problem as exposed to the sprint client — answer keys stripped out. */
export interface SanitizedChoice {
  id: string;
  label: string;
}

export interface SanitizedProblem {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  discipline: Discipline;
  difficulty: Difficulty;
  evaluationMode: EvaluationMode;
  unit?: string | null;
  choices?: SanitizedChoice[] | null;
}

export interface SprintResolution {
  result: MatchResult;
  userScore: number; // 0–100
  oppScore: number; // 0–100
  eloBefore: number;
  eloAfter: number;
  delta: number;
  tier: RankTier;
}
