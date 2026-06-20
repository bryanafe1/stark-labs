import type { Difficulty, Discipline } from "@prisma/client";
import type { GradableProblem } from "@/lib/grading";

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
}
