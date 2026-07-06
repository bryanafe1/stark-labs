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
}

const PRO_REQUIRED = "AI feedback is a paid feature. Upgrade to get your answers graded.";

/** Grade one part of a conceptual practice question (free-form answer → AI feedback + score). */
export async function gradeConceptualPractice(input: {
  slug: string;
  partIndex: number;
  answer: string;
  prior?: string;
}): Promise<ConceptResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, error: "Sign in to submit." };
  if (!(await hasPaidAccess())) return { ok: false, error: PRO_REQUIRED };

  const answer = (input.answer ?? "").trim();
  if (answer.length < 2) return { ok: false, error: "Write your answer first." };

  const problem = await getProblemBySlug(input.slug);
  const part = problem?.parts?.[input.partIndex];
  if (!problem || !part) return { ok: false, error: "Question not found." };

  const grade = await gradeConcept({
    scenario: problem.prompt,
    question: part.prompt,
    rubric: part.rubric,
    priorContext: input.prior,
    answer,
  });

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

  return { ok: true, score: grade.score, strengths: grade.strengths, improvements: grade.improvements };
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
