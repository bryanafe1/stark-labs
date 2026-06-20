import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DisciplinePill, DifficultyBadge } from "@/components/practice/badges";
import type { LessonSummary } from "@/types/lessons";

export function LessonCard({ lesson }: { lesson: LessonSummary }) {
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
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {lesson.estMinutes} min
          </span>
          <span className="flex items-center gap-1 font-medium text-primary opacity-60 transition-opacity group-hover:opacity-100">
            Start <ArrowRight className="size-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
