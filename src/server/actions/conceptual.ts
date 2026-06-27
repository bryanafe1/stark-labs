"use server";

import { getCurrentUserId } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { getProblemBySlug } from "@/features/practice/problems";
import { gradeConcept } from "@/lib/concept-grader";

export interface ConceptResult {
  ok: boolean;
  score?: number;
  feedback?: string;
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
  return { ok: true, score: grade.score, feedback: grade.feedback };
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
  return { ok: true, score: grade.score, feedback: grade.feedback };
}
