import type { EvaluationMode } from "@prisma/client";

// ---------------------------------------------------------------------------
//  Pure, dependency-free grading core for the Evaluation Engine.
//  Shared by the DB-backed `submitSolution` action and the Practice page so
//  the *logic* is identical everywhere and trivially unit-testable.
// ---------------------------------------------------------------------------

export interface Choice {
  id: string;
  label: string;
  correct?: boolean;
}

/** The subset of a Problem needed to grade an answer (Prisma- and mock-compatible). */
export interface GradableProblem {
  evaluationMode: EvaluationMode;
  expectedValue?: number | null;
  tolerance?: number | null;
  unit?: string | null;
  choices?: Choice[] | null;
  expectedText?: string | null;
}

export interface AnswerInput {
  numericAnswer?: number | null;
  textAnswer?: string | null;
  choiceId?: string | null;
}

export type GradeStatus = "CORRECT" | "INCORRECT" | "PARTIAL" | "GRADING";

export interface GradeResult {
  status: GradeStatus;
  score: number; // 0–100
  feedback: string;
}

export function gradeAnswer(
  problem: GradableProblem,
  answer: AnswerInput,
): GradeResult {
  switch (problem.evaluationMode) {
    case "NUMERIC_TOLERANCE": {
      if (answer.numericAnswer == null || problem.expectedValue == null) {
        return { status: "INCORRECT", score: 0, feedback: "Enter a numeric answer." };
      }
      // Effective tolerance = max(the problem's absolute band, a 1% relative
      // floor). The relative floor means using g = 9.8 instead of 9.81, rounding
      // π, or rounding intermediate steps never costs a correct answer.
      const REL_FLOOR = 0.01;
      const tol = Math.max(
        problem.tolerance ?? 0,
        REL_FLOOR * Math.abs(problem.expectedValue),
      );
      const delta = Math.abs(answer.numericAnswer - problem.expectedValue);
      const correct = delta <= tol;
      const u = problem.unit ?? "";
      return {
        status: correct ? "CORRECT" : "INCORRECT",
        score: correct ? 100 : 0,
        feedback: correct
          ? `Within tolerance ✔ (expected ${problem.expectedValue}${u})`
          : `Off by ${delta.toPrecision(3)}${u} — outside the ±${tol.toPrecision(3)}${u} band.`,
      };
    }

    case "MULTIPLE_CHOICE": {
      const choices = problem.choices ?? [];
      const picked = choices.find((c) => c.id === answer.choiceId);
      const correct = picked?.correct === true;
      return {
        status: correct ? "CORRECT" : "INCORRECT",
        score: correct ? 100 : 0,
        feedback: !picked
          ? "Select an option."
          : correct
            ? "Correct ✔"
            : "Not quite — review the concept and retry.",
      };
    }

    case "EXACT_MATCH": {
      const expected = problem.expectedText?.trim().toLowerCase() ?? "";
      const got = answer.textAnswer?.trim().toLowerCase() ?? "";
      const correct = got.length > 0 && got === expected;
      return {
        status: correct ? "CORRECT" : "INCORRECT",
        score: correct ? 100 : 0,
        feedback: correct ? "Exact match ✔" : "Doesn't match the expected answer.",
      };
    }

    case "LLM_GRADED": {
      // Deterministic part is "did they write enough to grade?". The actual
      // rubric scoring is performed asynchronously by the Anthropic API.
      const len = answer.textAnswer?.trim().length ?? 0;
      if (len < 20) {
        return {
          status: "INCORRECT",
          score: 0,
          feedback: "Add more detail to your design rationale before submitting.",
        };
      }
      return {
        status: "GRADING",
        score: 0,
        feedback: "Submitted for AI rubric grading — results arrive shortly.",
      };
    }
  }
}
