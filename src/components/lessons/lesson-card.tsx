import Link from "next/link";
import { Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DisciplinePill, DifficultyBadge } from "@/components/practice/badges";
import { cn } from "@/lib/utils";
import type { LessonSummary } from "@/types/lessons";

export function LessonCard({
  lesson,
  completedCount = 0,
}: {
  lesson: LessonSummary;
  completedCount?: number;
}) {
  const total = lesson.interactiveCount ?? 0;
  const done = Math.min(completedCount, total);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const completed = total > 0 && done >= total;
  const inProgress = done > 0 && !completed;

  return (
    <Link href={`/learn/${lesson.slug}`} className="group block">
      <Card className="flex h-full flex-col p-4 transition-colors hover:border-primary/40 hover:bg-accent/40">
        <div className="flex flex-wrap items-center gap-2">
          <DisciplinePill discipline={lesson.discipline} />
          <DifficultyBadge difficulty={lesson.difficulty} />
        </div>
        <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary">
          {lesson.title}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {lesson.summary}
        </p>

        {(inProgress || completed) && (
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn("h-full rounded-full", completed ? "bg-emerald-500" : "bg-primary")}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {lesson.estMinutes} min
          </span>
          {completed ? (
            <span className="flex items-center gap-1 font-medium text-emerald-500">
              Completed <CheckCircle2 className="size-3.5" />
            </span>
          ) : inProgress ? (
            <span className="flex items-center gap-1 font-medium text-primary">
              Continue · {pct}% <ArrowRight className="size-3.5" />
            </span>
          ) : (
            <span className="flex items-center gap-1 font-medium text-primary opacity-60 transition-opacity group-hover:opacity-100">
              Start <ArrowRight className="size-3.5" />
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
