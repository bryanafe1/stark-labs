"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { getProblemBySlug } from "@/features/practice/problems";
import { gradeConcept } from "@/lib/concept-grader";
import { prisma } from "@/lib/prisma";
import { ensureProblemRow } from "@/lib/persist-problem";

// A conceptual answer scoring at/above this (0–100 from the AI grader) counts
// as "solved" for progress + accuracy.
const CONCEPT_PASS = 60;

export interface ConceptResult {
  ok: boolean;
  score?: number;
  strengths?: string; // practice: what you did well
  improvements?: string; // practice: what to improve on
  concepts?: string[]; // arena: key concepts the question tests
  modelAnswer?: string; // arena: the ideal answer (revealed post-submit)
  error?: string;
  limitReached?: boolean; // free taste used up → show the upgrade wall, not an error
  freeRemaining?: number; // graded answers left on the free taste (undefined for paid)
}

const PRO_REQUIRED = "AI feedback is a paid feature. Upgrade to get your answers graded.";

// Free users get a taste of AI-graded conceptual feedback (the product's aha)
// before the paywall — bounds Anthropic cost like the free mock interview does.
const FREE_CONCEPT_GRADES = Number(process.env.FREE_CONCEPT_GRADES ?? 5);

/** Grade one part of a conceptual practice question (free-form answer → AI feedback + score). */
export async function gradeConceptualPractice(input: {
  slug: string;
  partIndex: number;
  answer: string;
  prior?: string;
}): Promise<ConceptResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, error: "Sign in to submit." };

  const answer = (input.answer ?? "").trim();
  if (answer.length < 2) return { ok: false, error: "Write your answer first." };

  const problem = await getProblemBySlug(input.slug);
  const part = problem?.parts?.[input.partIndex];
  if (!problem || !part) return { ok: false, error: "Question not found." };

  // Paid → unlimited. Free → a taste of AI-graded feedback, then the upgrade wall.
  const paid = await hasPaidAccess();
  let usedFree = 0;
  if (!paid) {
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { freeConceptGrades: true },
    });
    usedFree = u?.freeConceptGrades ?? 0;
    if (usedFree >= FREE_CONCEPT_GRADES) {
      return {
        ok: false,
        limitReached: true,
        error: "That's your free graded answers used up. Upgrade for unlimited AI feedback.",
      };
    }
  }

  const grade = await gradeConcept({
    scenario: problem.prompt,
    question: part.prompt,
    rubric: part.rubric,
    priorContext: input.prior,
    answer,
  });

  // Meter the free taste after a successful grade (paid users are unlimited).
  if (!paid) {
    await prisma.user
      .update({ where: { id: userId }, data: { freeConceptGrades: { increment: 1 } } })
      .catch(() => {});
  }

  // Persist the graded attempt so progress / accuracy / readiness accrue.
  // (Conceptual practice previously wrote nothing at all.) Never fail the user
  // if the write hiccups.
  try {
    const problemId = await ensureProblemRow(input.slug);
    if (problemId) {
      await prisma.submission.create({
        data: {
          userId,
          problemId,
          status: grade.score >= CONCEPT_PASS ? "CORRECT" : "INCORRECT",
          score: grade.score,
          feedback: [grade.strengths, grade.improvements].filter(Boolean).join("\n\n") || null,
          textAnswer: answer.slice(0, 20_000),
          llmModel: process.env.GRADING_MODEL ?? "claude-sonnet-4-6",
        },
      });
      revalidatePath("/skills");
      revalidatePath("/profile");
      revalidatePath("/dashboard");
    }
  } catch (err) {
    console.error("[conceptual] failed to persist submission", err);
  }

  return {
    ok: true,
    score: grade.score,
    strengths: grade.strengths,
    improvements: grade.improvements,
    freeRemaining: paid ? undefined : Math.max(0, FREE_CONCEPT_GRADES - usedFree - 1),
  };
}

/** Grade a conceptual Arena answer. The client passes only the question slug;
 *  the rubric is looked up server-side so it never reaches the browser. */
export async function gradeConceptualSprint(input: {
  id: string; // practice problem slug
  answer: string;
}): Promise<ConceptResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, error: "Sign in to play." };
  if (!(await hasPaidAccess())) return { ok: false, error: PRO_REQUIRED };

  const answer = (input.answer ?? "").trim();
  if (answer.length < 2) return { ok: false, error: "Write your answer first." };

  const problem = await getProblemBySlug(input.id);
  const part = problem?.parts?.[0];
  if (!problem || !part) return { ok: false, error: "Question not found." };

  const grade = await gradeConcept({
    scenario: problem.prompt,
    question: part.prompt,
    rubric: part.rubric,
    answer,
  });
  return { ok: true, score: grade.score, concepts: grade.concepts, modelAnswer: part.rubric };
}
