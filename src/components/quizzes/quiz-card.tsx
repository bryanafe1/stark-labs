import Link from "next/link";
import { ChevronRight, ListChecks, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DisciplinePill, DifficultyBadge } from "@/components/practice/badges";
import type { Quiz } from "@/features/quizzes/quizzes-data";

export function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Link
      href={`/quizzes/${quiz.slug}`}
      className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="p-4 transition-colors hover:border-primary/40 hover:bg-accent/40">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <DisciplinePill discipline={quiz.discipline} />
              <DifficultyBadge difficulty={quiz.difficulty} />
            </div>
            <h3 className="mt-2 truncate font-semibold group-hover:text-primary">
              {quiz.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {quiz.description}
            </p>
          </div>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>
        <div className="mt-3 flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ListChecks className="size-3.5" />
            {quiz.questions.length} questions
          </span>
          <span className="flex items-center gap-1">
            <Target className="size-3.5 text-primary" />
            {quiz.passingScore}% to pass
          </span>
        </div>
      </Card>
    </Link>
  );
}
