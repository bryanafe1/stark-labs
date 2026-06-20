"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  Check,
  X,
  Trophy,
} from "lucide-react";
import { gradeAnswer, type AnswerInput as GradeAnswerInput } from "@/lib/grading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Quiz, QuizQuestion } from "@/features/quizzes/quizzes-data";

interface QuestionResult {
  questionId: string;
  correct: boolean;
  earned: number;
}

/** Build a `gradeAnswer`-compatible answer object from raw user input. */
function toGradeInput(
  q: QuizQuestion,
  raw: { value: string; choiceId: string },
): GradeAnswerInput {
  switch (q.evaluationMode) {
    case "NUMERIC_TOLERANCE":
      return {
        numericAnswer: raw.value.trim() === "" ? null : Number(raw.value),
      };
    case "MULTIPLE_CHOICE":
      return { choiceId: raw.choiceId || null };
    case "EXACT_MATCH":
      return { textAnswer: raw.value };
  }
}

function isAnswered(
  q: QuizQuestion,
  raw: { value: string; choiceId: string },
): boolean {
  if (q.evaluationMode === "MULTIPLE_CHOICE") return raw.choiceId !== "";
  return raw.value.trim() !== "";
}

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const total = quiz.questions.length;
  const totalPoints = quiz.questions.reduce((s, q) => s + q.points, 0);

  const [index, setIndex] = React.useState(0);
  const [raw, setRaw] = React.useState({ value: "", choiceId: "" });
  const [results, setResults] = React.useState<QuestionResult[]>([]);
  const [done, setDone] = React.useState(false);

  const question = quiz.questions[index]!;
  const answered = isAnswered(question, raw);

  function handleNext() {
    if (!answered) return;
    const grade = gradeAnswer(question, toGradeInput(question, raw));
    const correct = grade.status === "CORRECT";
    setResults((prev) => [
      ...prev,
      {
        questionId: question.id,
        correct,
        earned: correct ? question.points : 0,
      },
    ]);
    setRaw({ value: "", choiceId: "" });

    if (index + 1 >= total) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function handleRetake() {
    setIndex(0);
    setRaw({ value: "", choiceId: "" });
    setResults([]);
    setDone(false);
  }

  if (done) {
    const earned = results.reduce((s, r) => s + r.earned, 0);
    const percent = totalPoints === 0 ? 0 : Math.round((earned / totalPoints) * 100);
    const passed = percent >= quiz.passingScore;

    return (
      <Card className="overflow-hidden">
        <PanelHeader label="// results" />
        <div className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <Trophy
              className={cn(
                "size-8",
                passed ? "text-terminal" : "text-muted-foreground",
              )}
            />
            <div>
              <p
                className={cn(
                  "font-mono text-5xl font-bold tabular-nums",
                  passed ? "text-terminal" : "text-destructive",
                )}
              >
                {percent}%
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {earned} / {totalPoints} points · pass ≥ {quiz.passingScore}%
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-sm font-semibold",
                passed
                  ? "bg-terminal/15 text-terminal"
                  : "bg-destructive/15 text-destructive",
              )}
            >
              {passed ? "Passed" : "Failed"}
            </span>
          </div>

          {/* Per-question recap */}
          <div className="space-y-2">
            {quiz.questions.map((q, i) => {
              const r = results[i];
              const correct = r?.correct === true;
              return (
                <div
                  key={q.id}
                  className="flex items-start gap-3 rounded-md border border-border bg-background p-3"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                      correct
                        ? "bg-terminal/15 text-terminal"
                        : "bg-destructive/15 text-destructive",
                    )}
                  >
                    {correct ? (
                      <Check className="size-3.5" />
                    ) : (
                      <X className="size-3.5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-muted-foreground">
                      Q{i + 1}
                    </p>
                    <p className="truncate text-sm text-foreground/90">
                      {q.prompt.split("\n")[0]}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-xs",
                      correct ? "text-terminal" : "text-destructive",
                    )}
                  >
                    {r?.earned ?? 0}/{q.points}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleRetake}>
              <RotateCcw className="size-4" />
              Retake
            </Button>
            <Button asChild variant="outline">
              <Link href="/quizzes">
                <ArrowLeft className="size-4" />
                Back to Quizzes
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const progressValue = (index / total) * 100;

  return (
    <Card className="overflow-hidden">
      <PanelHeader label="// quiz" />
      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>
              Question {index + 1} of {total}
            </span>
            <span className="tabular-nums">{question.points} pts</span>
          </div>
          <Progress value={progressValue} indicatorClassName="bg-terminal" />
        </div>

        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {question.prompt}
        </p>

        <QuestionInput question={question} raw={raw} onChange={setRaw} />

        <div className="flex justify-end">
          <Button onClick={handleNext} disabled={!answered}>
            {index + 1 >= total ? "Finish" : "Next"}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function QuestionInput({
  question,
  raw,
  onChange,
}: {
  question: QuizQuestion;
  raw: { value: string; choiceId: string };
  onChange: (next: { value: string; choiceId: string }) => void;
}) {
  if (question.evaluationMode === "MULTIPLE_CHOICE") {
    return (
      <fieldset className="space-y-2">
        <legend className="mb-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground">
          select one
        </legend>
        {(question.choices ?? []).map((c) => (
          <label
            key={c.id}
            className="flex cursor-pointer items-center gap-3 rounded-md border border-input bg-background p-3 text-sm transition-colors hover:border-foreground/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
          >
            <input
              type="radio"
              name={`choice-${question.id}`}
              value={c.id}
              checked={raw.choiceId === c.id}
              onChange={() => onChange({ value: "", choiceId: c.id })}
              className="size-4 accent-[hsl(var(--terminal))]"
            />
            <span className="font-mono text-xs text-muted-foreground">
              {c.id})
            </span>
            {c.label}
          </label>
        ))}
      </fieldset>
    );
  }

  const isNumeric = question.evaluationMode === "NUMERIC_TOLERANCE";
  return (
    <div>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
        answer
      </label>
      <div className="input-terminal flex h-11 max-w-md items-center gap-2 px-3">
        <ChevronRight className="size-4 shrink-0 text-terminal" />
        <input
          type={isNumeric ? "number" : "text"}
          step={isNumeric ? "any" : undefined}
          autoComplete="off"
          value={raw.value}
          onChange={(e) => onChange({ value: e.target.value, choiceId: "" })}
          placeholder={isNumeric ? "0.000" : "type your answer…"}
          className="h-full w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/50"
        />
        {isNumeric && question.unit && (
          <span className="shrink-0 font-mono text-sm text-muted-foreground">
            {question.unit}
          </span>
        )}
      </div>
    </div>
  );
}

function PanelHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card/60 px-5 py-2.5">
      <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="flex gap-1.5">
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-terminal/60" />
      </span>
    </div>
  );
}
