import "server-only";
import type { Discipline } from "@prisma/client";
import { getProblems } from "@/features/practice/problems";
import type { PracticeProblem } from "@/features/practice/problems";
import type { SanitizedProblem } from "@/types/arena";

/** Strip answer keys before a problem crosses to the client during a sprint. */
export function sanitizeProblem(p: PracticeProblem): SanitizedProblem {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    prompt: p.prompt,
    discipline: p.discipline,
    difficulty: p.difficulty,
    evaluationMode: p.evaluationMode,
    unit: p.unit,
    choices: p.choices?.map((c) => ({ id: c.id, label: c.label })) ?? null,
  };
}

/**
 * Build a sprint set: prefer problems from the chosen discipline, then top up
 * from other disciplines if that track is thin. Returns sanitized problems.
 */
export async function getSprintProblems(
  discipline: Discipline,
  count = 3,
): Promise<SanitizedProblem[]> {
  const all = await getProblems();
  const inDiscipline = all.filter((p) => p.discipline === discipline);
  const rest = all.filter((p) => p.discipline !== discipline);
  return [...inDiscipline, ...rest].slice(0, count).map(sanitizeProblem);
}
