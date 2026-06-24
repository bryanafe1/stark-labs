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
  kind?: "numeric";
  id: string;
  title: string;
  prompt: string;
  evaluationMode: Extract<EvaluationMode, "NUMERIC_TOLERANCE">;
  expectedValue: number;
  tolerance: number;
  unit: string;
  /** Governing equations shown in the on-screen Reference Sheet (tools, not the answer). */
  reference: string[];
}

/** An open-ended conceptual sprint — graded by the AI on a 0–100 accuracy %.
 *  The rubric stays server-side; the client only carries the displayed text. */
export interface ConceptualSprintProblem {
  kind: "conceptual";
  /** Practice problem slug — the server looks up the rubric by this. */
  id: string;
  title: string;
  scenario: string;
  question: string;
}

export type AnySprintProblem = SprintProblem | ConceptualSprintProblem;

/** The live match plan, fixed the instant a match starts. */
export interface MatchPlan {
  opponent: Bot;
  problem: AnySprintProblem;
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
  /** Conceptual matches: % scores for both sides + the AI feedback. */
  conceptual?: boolean;
  userScore?: number;
  oppScore?: number;
  feedback?: string;
}
