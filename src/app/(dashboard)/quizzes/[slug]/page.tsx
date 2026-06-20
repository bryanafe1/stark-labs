import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ListChecks, Target } from "lucide-react";
import {
  getQuizBySlug,
  getQuizSlugs,
} from "@/features/quizzes/quizzes-data";
import { DisciplinePill, DifficultyBadge } from "@/components/practice/badges";
import { QuizRunner } from "@/components/quizzes/quiz-runner";

interface Params {
  params: { slug: string };
}

// Pre-render every quiz at build time.
export async function generateStaticParams() {
  const slugs = await getQuizSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const quiz = await getQuizBySlug(params.slug);
  return { title: quiz ? quiz.title : "Quiz" };
}

export default async function QuizPage({ params }: Params) {
  const quiz = await getQuizBySlug(params.slug);
  if (!quiz) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        href="/quizzes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Quizzes
      </Link>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <DisciplinePill discipline={quiz.discipline} />
          <DifficultyBadge difficulty={quiz.difficulty} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
        <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ListChecks className="size-3.5" />
            {quiz.questions.length} questions
          </span>
          <span className="flex items-center gap-1">
            <Target className="size-3.5 text-primary" />
            {quiz.passingScore}% to pass
          </span>
        </div>
      </div>

      <QuizRunner quiz={quiz} />
    </div>
  );
}
