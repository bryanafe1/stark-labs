"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Timer, Loader2, CheckCircle2, XCircle, Trophy, Swords } from "lucide-react";
import type { Difficulty, Discipline } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnswerInput } from "@/components/practice/answer-input";
import { DisciplinePill, DifficultyBadge } from "@/components/practice/badges";
import { cn } from "@/lib/utils";
import { tierForElo } from "@/lib/constants";
import { gradeSprintProblem, resolveSprint } from "@/server/actions/arena";
import type { AnswerInput as AnswerValue } from "@/lib/grading";
import type { SanitizedProblem, SprintResolution } from "@/types/arena";

export interface SprintConfig {
  discipline: Discipline;
  difficulty: Difficulty;
  opponentElo: number;
  eloBefore: number;
  durationSeconds: number;
}

export function SprintRunner({
  problems,
  config,
}: {
  problems: SanitizedProblem[];
  config: SprintConfig;
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [grading, setGrading] = useState(false);
  const [flash, setFlash] = useState<"correct" | "incorrect" | null>(null);
  const [resolution, setResolution] = useState<SprintResolution | null>(null);
  const [resolving, setResolving] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(config.durationSeconds);
  const finishedRef = useRef(false);

  const finish = useCallback(
    async (finalResults: boolean[]) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setResolving(true);
      const correct = finalResults.filter(Boolean).length;
      const res = await resolveSprint({
        discipline: config.discipline,
        difficulty: config.difficulty,
        eloBefore: config.eloBefore,
        opponentElo: config.opponentElo,
        correct,
        total: problems.length,
      });
      if ("error" in res) {
        setResolving(false);
        finishedRef.current = false;
        return;
      }
      setResolution(res);
      setResolving(false);
    },
    [config, problems.length],
  );

  // Countdown — ends the sprint when it hits zero.
  useEffect(() => {
    if (resolution || resolving) return;
    if (secondsLeft <= 0) {
      void finish(results);
      return;
    }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft, resolution, resolving, results, finish]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (grading) return;
    const fd = new FormData(e.currentTarget);
    const numStr = fd.get("numericAnswer");
    const answer: AnswerValue = {
      numericAnswer: numStr != null && numStr !== "" ? Number(numStr) : undefined,
      textAnswer: (fd.get("textAnswer") as string | null) || undefined,
      choiceId: (fd.get("choiceId") as string | null) || undefined,
    };

    setGrading(true);
    const current = problems[index]!;
    const { correct } = await gradeSprintProblem(current.slug, answer);
    setGrading(false);
    setFlash(correct ? "correct" : "incorrect");

    const nextResults = [...results, correct];
    setResults(nextResults);

    setTimeout(() => {
      setFlash(null);
      if (index + 1 >= problems.length) {
        void finish(nextResults);
      } else {
        setIndex((i) => i + 1);
      }
    }, 650);
  };

  if (resolution) return <SprintSummary res={resolution} />;

  const current = problems[index];
  if (!current) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-10">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Tallying results…</span>
        </CardContent>
      </Card>
    );
  }

  const solved = results.filter(Boolean).length;
  const oppProgress = Math.min(
    100,
    ((config.durationSeconds - secondsLeft) / config.durationSeconds) * 100,
  );
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const low = secondsLeft <= 30;

  return (
    <div className="space-y-4">
      {/* Sprint HUD */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-lg font-bold tabular-nums",
              low ? "border-destructive/40 text-destructive" : "border-border",
            )}
          >
            <Timer className="size-4" />
            {mm}:{ss}
          </div>
          <div className="flex items-center gap-2">
            <DisciplinePill discipline={config.discipline} />
            <DifficultyBadge difficulty={config.difficulty} />
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Problem</p>
            <p className="font-semibold tabular-nums">
              {index + 1} / {problems.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Live progress: you vs opponent */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-card/40 p-3">
          <p className="mb-1.5 text-xs font-medium text-primary">You · {solved} solved</p>
          <Progress value={(solved / problems.length) * 100} indicatorClassName="bg-primary" />
        </div>
        <div className="rounded-lg border border-border bg-card/40 p-3">
          <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Swords className="size-3.5" /> Opponent
          </p>
          <Progress value={oppProgress} indicatorClassName="bg-muted-foreground/80" />
        </div>
      </div>

      {/* Problem card */}
      <Card className="relative overflow-hidden">
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm",
                flash === "correct" ? "bg-success/15" : "bg-destructive/15",
              )}
            >
              {flash === "correct" ? (
                <CheckCircle2 className="size-16 text-success" />
              ) : (
                <XCircle className="size-16 text-destructive" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader>
          <CardTitle className="text-lg">{current.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap break-words rounded-lg border border-border bg-card/40 p-4 text-sm leading-relaxed text-foreground/90">
            {current.prompt}
          </div>
          <form
            key={index}
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col gap-4"
          >
            <AnswerInput problem={current} />
            <Button type="submit" disabled={grading} className="self-start">
              {grading && <Loader2 className="size-4 animate-spin" />}
              {index + 1 >= problems.length ? "Submit & Finish" : "Submit & Next"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SprintSummary({ res }: { res: SprintResolution }) {
  const win = res.result === "WIN";
  const draw = res.result === "DRAW";
  const tier = tierForElo(res.eloAfter);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
    >
      <Card className="overflow-hidden">
        <div
          className={cn(
            "flex flex-col items-center gap-2 bg-gradient-to-b p-8 text-center",
            win
              ? "from-primary/20"
              : draw
                ? "from-muted/40"
                : "from-destructive/20",
          )}
        >
          <Trophy
            className={cn(
              "size-12",
              win ? "text-primary" : draw ? "text-muted-foreground" : "text-destructive",
            )}
          />
          <h2 className="text-3xl font-black tracking-tight">
            {win ? "Victory" : draw ? "Draw" : "Defeat"}
          </h2>
          <p className="text-sm text-muted-foreground">
            You scored {res.userScore} · Opponent {res.oppScore}
          </p>
        </div>

        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-center gap-4">
            <span className="text-2xl font-bold tabular-nums text-muted-foreground">
              {res.eloBefore}
            </span>
            <span className="text-muted-foreground">→</span>
            <div className="text-center">
              <span className="text-3xl font-black tabular-nums">{res.eloAfter}</span>
              <p
                className={cn(
                  "text-sm font-semibold",
                  res.delta > 0 ? "text-primary" : res.delta < 0 ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {res.delta > 0 ? "+" : ""}
                {res.delta} Elo
              </p>
            </div>
          </div>

          <p className="text-center text-sm">
            <span className="text-muted-foreground">New rank: </span>
            <span className={cn("font-semibold", tier.textClass)}>{tier.label}</span>
          </p>

          <div className="flex gap-3 pt-2">
            <Button asChild variant="secondary" className="flex-1">
              <Link href="/arena">Back to Arena</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/arena">Queue Again</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
