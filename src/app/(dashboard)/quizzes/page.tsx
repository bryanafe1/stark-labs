import type { Metadata } from "next";
import { getQuizzes } from "@/features/quizzes/quizzes-data";
import { QuizCard } from "@/components/quizzes/quiz-card";

export const metadata: Metadata = { title: "Quizzes" };

export default async function QuizzesPage() {
  const quizzes = await getQuizzes();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quizzes</h1>
        <p className="text-sm text-muted-foreground">
          Timed-style assessments across disciplines. Every question is
          auto-graded by the Evaluation Engine — finish to see your score and
          whether you cleared the passing bar.
        </p>
      </div>

      <p className="font-mono text-sm text-muted-foreground">
        {quizzes.length} quizzes available
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
}
