import type { Difficulty, Discipline } from "@prisma/client";
import type { GradableProblem } from "@/lib/grading";

/**
 * One step of a conceptual (open-ended, interview-style) question. Later parts
 * change the constraints of the same scenario, the way a real interviewer does.
 */
export interface ConceptualPart {
  /** The question for this step. */
  prompt: string;
  /** Grading guide for the AI grader: the key points an ideal answer should hit. */
  rubric: string;
}

/**
 * A practice problem. Mirrors the Prisma `Problem` shape so the Practice surface
 * renders and grades today without a database. `GradableProblem` supplies the
 * evaluation config (mode, expectedValue, tolerance, choices, expectedText).
 */
export interface PracticeProblem extends GradableProblem {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  discipline: Discipline;
  difficulty: Difficulty;
  eloWeight: number;
  tags: string[];
  /** SkillArea slugs (subjects + technical) this problem trains — see SKILL_AREAS in lib/constants. */
  skillAreas?: string[];
  /** Progressive hints, revealed one at a time when the candidate is stuck. Each
   *  nudges over a technical hump WITHOUT giving away the final numeric answer. */
  hints?: string[];
  /** Full step-by-step worked solution (markdown + LaTeX), shown only when the
   *  candidate gives up. Teaches the reasoning and ends with the final answer. */
  solution?: string;
  /** Grading rubric for LLM_GRADED problems (consumed by the LLM grader). */
  rubric?: string;
  /** When present, this is an open-ended CONCEPTUAL question: the candidate
   *  writes a free-form answer to each part (constraints change between parts),
   *  graded by the AI. evaluationMode is "LLM_GRADED" for these. */
  parts?: ConceptualPart[];
}
