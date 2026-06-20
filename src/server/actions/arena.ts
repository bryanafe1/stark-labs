"use server";

import { z } from "zod";
import { applyElo, expectedScore } from "@/lib/elo";
import { gradeAnswer, type AnswerInput } from "@/lib/grading";
import { getProblemBySlug } from "@/features/practice/problems";
import { findOpponent, simulateOpponentScore } from "@/features/arena/opponents";
import type { FindMatchState, SprintResolution } from "@/types/arena";

const DISCIPLINE = z.enum([
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
]);
const DIFFICULTY = z.enum(["INTRODUCTORY", "EASY", "MEDIUM", "HARD", "EXPERT"]);

// K-factor scales with difficulty — riskier sprints move your rating more.
const K_BY_DIFFICULTY = {
  INTRODUCTORY: 16,
  EASY: 20,
  MEDIUM: 28,
  HARD: 36,
  EXPERT: 44,
} as const;

// ---------------------------------------------------------------------------
//  Matchmaking — find an opponent and project the Elo swings (useFormState).
// ---------------------------------------------------------------------------

const findMatchSchema = z.object({
  discipline: DISCIPLINE,
  difficulty: DIFFICULTY,
  userElo: z.coerce.number().int().min(100).max(4000),
});

export async function findMatch(
  _prev: FindMatchState,
  formData: FormData,
): Promise<FindMatchState> {
  const parsed = findMatchSchema.safeParse({
    discipline: formData.get("discipline"),
    difficulty: formData.get("difficulty"),
    userElo: formData.get("userElo"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Pick a discipline and difficulty to queue." };
  }

  const { discipline, difficulty, userElo } = parsed.data;
  const opponent = findOpponent(userElo);
  const k = K_BY_DIFFICULTY[difficulty];

  const onWin = applyElo(userElo, opponent.elo, 1, k);
  const onLoss = applyElo(userElo, opponent.elo, 0, k);

  return {
    ok: true,
    discipline,
    difficulty,
    userElo,
    opponent,
    winDelta: onWin.delta,
    lossDelta: onLoss.delta,
    winChancePct: Math.round(expectedScore(userElo, opponent.elo) * 100),
  };
}

// ---------------------------------------------------------------------------
//  Sprint grading — grade one answer server-side (answer keys never reach the
//  client). Reuses the shared Evaluation Engine.
// ---------------------------------------------------------------------------

export async function gradeSprintProblem(
  slug: string,
  answer: AnswerInput,
): Promise<{ correct: boolean; status: string }> {
  const problem = await getProblemBySlug(slug);
  if (!problem) return { correct: false, status: "error" };
  const result = gradeAnswer(problem, answer);
  // In a sprint, GRADING (LLM) counts as solved-for-credit pending review.
  const correct = result.status === "CORRECT" || result.status === "GRADING";
  return { correct, status: result.status };
}

// ---------------------------------------------------------------------------
//  Resolution — compare scores, apply the real Elo update.
// ---------------------------------------------------------------------------

const resolveSchema = z.object({
  discipline: DISCIPLINE,
  difficulty: DIFFICULTY,
  eloBefore: z.number().int().min(100).max(4000),
  opponentElo: z.number().int().min(100).max(4000),
  correct: z.number().int().min(0),
  total: z.number().int().min(1),
});

export async function resolveSprint(
  input: z.input<typeof resolveSchema>,
): Promise<SprintResolution | { error: string }> {
  const parsed = resolveSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid sprint payload." };
  const { difficulty, eloBefore, opponentElo, correct, total } = parsed.data;

  const userScore = Math.round((correct / total) * 100);
  const oppScore = simulateOpponentScore(opponentElo);

  const actual = userScore > oppScore ? 1 : userScore < oppScore ? 0 : 0.5;
  const update = applyElo(eloBefore, opponentElo, actual, K_BY_DIFFICULTY[difficulty]);

  return {
    result: actual === 1 ? "WIN" : actual === 0 ? "LOSS" : "DRAW",
    userScore,
    oppScore,
    eloBefore,
    eloAfter: update.elo,
    delta: update.delta,
    tier: update.tier,
  };
}
