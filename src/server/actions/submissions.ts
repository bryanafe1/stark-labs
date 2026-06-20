"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { gradeAnswer, type Choice } from "@/lib/grading";

/**
 * Reference Server Action for the Evaluation Engine (DB-backed path).
 *
 * Canonical flow: validate -> grade (shared `gradeAnswer`) -> persist ->
 * revalidate. LLM_GRADED returns GRADING and would enqueue an Anthropic API
 * job that updates the submission asynchronously.
 *
 * NOTE: wire `userId` to the authenticated session before production use.
 */

const submitSchema = z.object({
  problemId: z.string().cuid(),
  numericAnswer: z.coerce.number().finite().optional(),
  textAnswer: z.string().max(20_000).optional(),
  choiceId: z.string().optional(),
  timeMs: z.number().int().nonnegative().optional(),
});

export type SubmitState =
  | { ok: true; status: string; score: number; feedback?: string }
  | { ok: false; error: string };

export async function submitSolution(
  userId: string,
  input: z.input<typeof submitSchema>,
): Promise<SubmitState> {
  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { problemId, numericAnswer, textAnswer, choiceId, timeMs } = parsed.data;

  const problem = await prisma.problem.findUnique({ where: { id: problemId } });
  if (!problem) return { ok: false, error: "Problem not found" };

  const { status, score, feedback } = gradeAnswer(
    {
      evaluationMode: problem.evaluationMode,
      expectedValue: problem.expectedValue,
      tolerance: problem.tolerance,
      unit: problem.unit,
      choices: (problem.choices as Choice[] | null) ?? null,
      expectedText: problem.expectedText,
    },
    { numericAnswer, textAnswer, choiceId },
  );

  await prisma.submission.create({
    data: {
      userId,
      problemId,
      status,
      score,
      feedback,
      numericAnswer,
      textAnswer,
      choiceId,
      timeMs,
      llmModel: problem.evaluationMode === "LLM_GRADED" ? process.env.GRADING_MODEL : null,
    },
  });

  revalidatePath("/practice");
  return { ok: true, status, score, feedback };
}
