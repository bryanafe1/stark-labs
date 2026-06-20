import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DisciplinePill, DifficultyBadge } from "@/components/practice/badges";
import type { PracticeProblem } from "@/features/practice/problems";

const MODE_LABEL: Record<PracticeProblem["evaluationMode"], string> = {
  NUMERIC_TOLERANCE: "Numeric",
  MULTIPLE_CHOICE: "Multiple choice",
  EXACT_MATCH: "Short answer",
  LLM_GRADED: "AI-graded",
};

export function ProblemCard({ problem }: { problem: PracticeProblem }) {
  return (
    <Link href={`/practice/${problem.slug}`} className="group block">
      <Card className="p-4 transition-colors hover:border-primary/40 hover:bg-accent/40">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <DisciplinePill discipline={problem.discipline} />
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
            <h3 className="mt-2 truncate font-semibold group-hover:text-primary">
              {problem.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {problem.prompt}
            </p>
          </div>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded bg-secondary px-1.5 py-0.5">
            {MODE_LABEL[problem.evaluationMode]}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="size-3.5 text-primary" />
            {problem.eloWeight} Elo
          </span>
        </div>
      </Card>
    </Link>
  );
}
