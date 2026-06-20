import type { EvaluationMode } from "@prisma/client";

// ---------------------------------------------------------------------------
//  Ranked engine — shared types. Frontend-only; everything is simulated with
//  local React state + timers (no DB, no sockets).
// ---------------------------------------------------------------------------

export interface Bot {
  id: string;
  username: string;
  elo: number;
}

export type RankedPhase =
  | "idle"
  | "queueing"
  | "matchFound"
  | "sprinting"
  | "result";

export type Outcome = "WIN" | "LOSS";

/** A self-contained timed-sprint problem (numeric, auto-gradable). */
export interface SprintProblem {
  id: string;
  title: string;
  prompt: string;
  evaluationMode: Extract<EvaluationMode, "NUMERIC_TOLERANCE">;
  expectedValue: number;
  tolerance: number;
  unit: string;
}

/** The live match plan, fixed the instant a match starts. */
export interface MatchPlan {
  opponent: Bot;
  problem: SprintProblem;
  /** How long (ms) until the bot submits its answer. The Dopamine Rule lives here. */
  botFinishMs: number;
  /** True in the ~20% of matches where the bot plays perfectly. */
  perfectBot: boolean;
  startedAt: number;
}

export interface ResultState {
  outcome: Outcome;
  opponent: Bot;
  eloBefore: number;
  eloAfter: number;
  delta: number;
}
