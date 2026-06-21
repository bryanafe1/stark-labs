import type { Metadata } from "next";
import { getLessons } from "@/features/lessons/lessons-data";
import { getAllLessonProgress } from "@/features/lessons/lesson-progress-data";
import { DISCIPLINE_LIST } from "@/lib/constants";
import {
  DisciplineAccordion,
  type DisciplineGroup,
} from "@/components/lessons/discipline-accordion";

export const metadata: Metadata = { title: "Learn" };

export default async function LearnPage() {
  const [lessons, progressMap] = await Promise.all([getLessons(), getAllLessonProgress()]);
  // slug → number of interactive blocks the user has completed
  const progress: Record<string, number> = {};
  for (const [slug, blocks] of Object.entries(progressMap)) progress[slug] = blocks.length;

  // Group by discipline, preserving the canonical discipline order.
  const groups: DisciplineGroup[] = DISCIPLINE_LIST.map((d) => ({
    key: d.key,
    label: d.label,
    lessons: lessons.filter((l) => l.discipline === d.key),
  })).filter((g) => g.lessons.length > 0);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Learn</h1>
        <p className="text-sm text-muted-foreground">
          Pick a discipline to reveal its lessons — interactive walkthroughs with
          live formula sandboxes, each ending in a practice problem to lock it in.
        </p>
      </div>

      <DisciplineAccordion groups={groups} progress={progress} />
    </div>
  );
}
