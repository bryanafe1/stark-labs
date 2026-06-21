"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { gradeAnswer } from "@/lib/grading";
import { getProblemBySlug } from "@/features/practice/problems";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { PracticeFormState } from "@/types/practice";

// ---------------------------------------------------------------------------
//  Form adapter for the Practice page.
//
//  `useFormState`-compatible: (prevState, formData) -> nextState. It loads the
//  problem from the catalog, grades with the shared `gradeAnswer`, and returns
//  UI state. The grading engine here is identical to the DB-backed
//  `submitSolution` — when auth + DB are live, uncomment the persistence call.
// ---------------------------------------------------------------------------

const formSchema = z.object({
  slug: z.string().min(1),
  numericAnswer: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? Number(v) : undefined))
    .refine((v) => v === undefined || Number.isFinite(v), "Enter a valid number"),
  textAnswer: z.string().max(20_000).optional(),
  choiceId: z.string().optional(),
  timeMs: z.coerce.number().int().nonnegative().optional(),
});

export async function submitPracticeAnswer(
  _prev: PracticeFormState,
  formData: FormData,
): Promise<PracticeFormState> {
  const userId = await getCurrentUserId();
  if (!userId) return { status: "error", feedback: "You must be signed in." };

  const parsed = formSchema.safeParse({
    slug: formData.get("slug"),
    numericAnswer: formData.get("numericAnswer") ?? undefined,
    textAnswer: formData.get("textAnswer") ?? undefined,
    choiceId: formData.get("choiceId") ?? undefined,
    timeMs: formData.get("timeMs") ?? undefined,
  });
  if (!parsed.success) {
    return {
      status: "error",
      feedback: parsed.error.issues[0]?.message ?? "Invalid submission.",
    };
  }

  const { slug, numericAnswer, textAnswer, choiceId } = parsed.data;
  const problem = await getProblemBySlug(slug);
  if (!problem) return { status: "error", feedback: "Problem not found." };

  const result = gradeAnswer(problem, { numericAnswer, textAnswer, choiceId });

  // Persist the attempt for the signed-in user so progress accrues. Grading
  // never fails the user if the write hiccups.
  try {
    const dbProblem = await prisma.problem.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (dbProblem) {
      await prisma.submission.create({
        data: {
          userId,
          problemId: dbProblem.id,
          status: result.status,
          score: result.score,
          feedback: result.feedback,
          numericAnswer: numericAnswer ?? null,
          textAnswer: textAnswer ?? null,
          choiceId: choiceId ?? null,
          timeMs: parsed.data.timeMs ?? null,
        },
      });
      revalidatePath("/skills");
      revalidatePath("/profile");
      revalidatePath("/dashboard");
    }
  } catch (err) {
    console.error("[practice] failed to persist submission", err);
  }

  return { status: result.status, score: result.score, feedback: result.feedback };
}
