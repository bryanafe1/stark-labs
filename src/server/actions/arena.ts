"use server";

import { z } from "zod";
import { applyElo, expectedScore } from "@/lib/elo";
import { gradeAnswer, type AnswerInput } from "@/lib/grading";
import { getProblemBySlug } from "@/features/practice/problems";
import { findOpponent, simulateOpponentScore } from "@/features/arena/opponents";
import type { FindMatchState, SprintResolution } from "@/types/arena";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import type { RankTier } from "@prisma/client";

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

// ---------------------------------------------------------------------------
//  Persist a ranked result to the signed-in user's account. The new Elo is
//  computed server-side from the stored rating (clients can't set it directly),
//  so rank survives logout/login and is consistent across devices.
// ---------------------------------------------------------------------------

const ARENA_K = 32;

export async function recordSprintResult(input: {
  opponentElo: number;
  outcome: "WIN" | "LOSS" | "DRAW";
}): Promise<{ eloBefore: number; eloAfter: number; delta: number; tier: RankTier } | { error: string }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Not signed in." };

  const opp = z.coerce.number().int().min(100).max(4000).safeParse(input.opponentElo);
  if (!opp.success) return { error: "Invalid opponent rating." };
  const actual = input.outcome === "WIN" ? 1 : input.outcome === "DRAW" ? 0.5 : 0;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { overallElo: true } });
  const before = user?.overallElo ?? 1200;
  const update = applyElo(before, opp.data, actual as 0 | 0.5 | 1, ARENA_K);

  await prisma.user.update({
    where: { id: userId },
    data: { overallElo: update.elo, rankTier: update.tier, lastActive: new Date() },
  });

  return { eloBefore: before, eloAfter: update.elo, delta: update.delta, tier: update.tier };
}
