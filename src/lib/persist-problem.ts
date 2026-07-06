import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getProblemBySlug, type PracticeProblem } from "@/features/practice/problems";

/**
 * The content catalog (not the DB) is the source of truth for problems, but
 * `Submission.problemId` is a required FK to `Problem`. So an attempt on a
 * problem that isn't mirrored into the DB Problem table can't be written at all
 * — which silently froze every user's progress. This lazily upserts the Problem
 * row from the catalog so every attempt can be recorded; the DB table self-heals
 * toward the catalog as problems are attempted.
 */
export function problemUpsertData(p: PracticeProblem): Prisma.ProblemCreateInput {
  const data: Prisma.ProblemCreateInput = {
    slug: p.slug,
    title: p.title,
    prompt: p.prompt,
    discipline: p.discipline,
    difficulty: p.difficulty,
    evaluationMode: p.evaluationMode,
    expectedValue: p.expectedValue ?? null,
    tolerance: p.tolerance ?? null,
    unit: p.unit ?? null,
    expectedText: p.expectedText ?? null,
    rubric: p.rubric ?? null,
    eloWeight: p.eloWeight ?? 20,
    skillAreas: p.skillAreas ?? [],
  };
  if (p.choices) data.choices = p.choices as unknown as Prisma.InputJsonValue;
  return data;
}

/** Ensure a DB Problem row exists for a catalog slug; returns its id, or null if the slug is unknown. */
export async function ensureProblemRow(slug: string): Promise<string | null> {
  const p = await getProblemBySlug(slug);
  if (!p) return null;
  const data = problemUpsertData(p);
  const row = await prisma.problem.upsert({
    where: { slug },
    update: data,
    create: data,
    select: { id: true },
  });
  return row.id;
}
