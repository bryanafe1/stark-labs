"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Timer, User as UserIcon, Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gradeAnswer } from "@/lib/grading";
import { cn } from "@/lib/utils";
import { ReferenceSheet } from "./reference-sheet";
import type { MatchPlan, Outcome, SprintProblem, ConceptualSprintProblem } from "./types";

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function SprintArena({
  plan,
  onResult,
  onSubmitConceptual,
}: {
  plan: MatchPlan;
  onResult: (outcome: Outcome) => void;
  onSubmitConceptual?: (answer: string) => Promise<void> | void;
}) {
  const problem = plan.problem;
  if (problem.kind === "conceptual") {
    return <ConceptualSprintView plan={plan} problem={problem} onSubmit={onSubmitConceptual} />;
  }
  return <NumericSprintView plan={plan} problem={problem} onResult={onResult} />;
}

function NumericSprintView({
  plan,
  problem,
  onResult,
}: {
  plan: MatchPlan;
  problem: SprintProblem;
  onResult: (outcome: Outcome) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);
  const resolved = useRef(false);

  // Sprint clock. When the bot's planned finish elapses first → the user loses.
  useEffect(() => {
    const start = plan.startedAt;
    const iv = setInterval(() => {
      const e = Date.now() - start;
      setElapsed(e);
      if (!resolved.current && e >= plan.botFinishMs) {
        resolved.current = true;
        clearInterval(iv);
        onResult("LOSS");
      }
    }, 100);
    return () => clearInterval(iv);
  }, [plan.startedAt, plan.botFinishMs, onResult]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolved.current) return;
    const num = answer.trim() === "" ? undefined : Number(answer);
    const res = gradeAnswer(problem, { numericAnswer: num });
    if (res.status === "CORRECT") {
      resolved.current = true;
      onResult("WIN");
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1fr_260px]">
      {/* USER WORKSPACE */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-card/60 px-5 py-2.5">
          <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {"// your workspace"}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-sm tabular-nums">
            <Timer className="size-4 text-terminal" />
            {fmt(elapsed)}
          </span>
        </div>
        <div className="space-y-5 p-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{problem.title}</h2>
            <div className="mt-2 whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-foreground/90">
              {problem.prompt}
            </div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                answer
              </label>
              <ReferenceSheet equations={problem.reference} />
            </div>
            <motion.div
              animate={wrong ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "input-terminal flex h-11 items-center gap-2 px-3",
                wrong && "border-destructive/60",
              )}
            >
              <ChevronRight className="size-4 shrink-0 text-terminal" />
              <input
                autoFocus
                type="number"
                step="any"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="0.000"
                className="h-full w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/50"
              />
              {problem.unit && (
                <span className="shrink-0 font-mono text-sm text-muted-foreground">
                  {problem.unit}
                </span>
              )}
            </motion.div>
            {wrong && (
              <p className="font-mono text-xs text-destructive">
                Outside tolerance — recompute and resubmit.
              </p>
            )}
            <Button type="submit">Submit answer</Button>
          </form>
        </div>
      </Card>

      {/* OPPONENT SIDEBAR */}
      <Card className="h-fit overflow-hidden">
        <div className="border-b border-border bg-card/60 px-4 py-2.5">
          <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {"// opponent"}
          </span>
        </div>
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
              <UserIcon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-mono text-sm font-medium">{plan.opponent.username}</p>
              <p className="font-mono text-xs text-muted-foreground">{plan.opponent.elo} Elo</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="relative flex size-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal/60" />
              <span className="relative inline-flex size-2 rounded-full bg-terminal" />
            </span>
            In the sprint
          </div>

          <p className="border-t border-border pt-3 font-mono text-[11px] leading-relaxed text-muted-foreground/70">
            First to submit a correct answer takes the match. Solve fast.
          </p>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  Conceptual sprint — free-form answer, AI-graded on % accuracy. No first-to-
//  submit race: both answers are scored and the higher % wins.
// ---------------------------------------------------------------------------

function ConceptualSprintView({
  plan,
  problem,
  onSubmit,
}: {
  plan: MatchPlan;
  problem: ConceptualSprintProblem;
  onSubmit?: (answer: string) => Promise<void> | void;
}) {
  const [answer, setAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const s = Date.now();
    const iv = setInterval(() => setElapsed(Date.now() - s), 500);
    return () => clearInterval(iv);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || answer.trim().length < 2 || !onSubmit) return;
    setSubmitting(true);
    await onSubmit(answer); // parent grades (with paced reveal), then switches phase
  };

  // The opponent submits on its own clock, like a real async match.
  const botDone = elapsed >= plan.botFinishMs;

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1fr_260px]">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-card/60 px-5 py-2.5">
          <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {"// conceptual sprint"}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-sm tabular-nums">
            <Timer className="size-4 text-terminal" />
            {fmt(elapsed)}
          </span>
        </div>
        <div className="space-y-5 p-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{problem.title}</h2>
            <div className="mt-2 whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-foreground/90">
              {problem.scenario}
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">{problem.question}</p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <label className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              your answer
            </label>
            <textarea
              autoFocus
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitting}
              rows={7}
              placeholder="Explain your reasoning, like you would out loud in an interview."
              className="w-full rounded-lg border border-input bg-background p-3 text-sm leading-relaxed outline-none ring-ring transition focus-visible:ring-2 disabled:opacity-70 placeholder:text-muted-foreground/50"
            />
            <Button type="submit" disabled={submitting || answer.trim().length < 2}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit answer"}
            </Button>
            <p className="font-mono text-[11px] text-muted-foreground/70">
              Highest accuracy % wins. Answer fully — partial credit counts.
            </p>
          </form>
        </div>
      </Card>

      {/* OPPONENT */}
      <Card className="h-fit overflow-hidden">
        <div className="border-b border-border bg-card/60 px-4 py-2.5">
          <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {"// opponent"}
          </span>
        </div>
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
              <UserIcon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-mono text-sm font-medium">{plan.opponent.username}</p>
              <p className="font-mono text-xs text-muted-foreground">{plan.opponent.elo} Elo</p>
            </div>
          </div>
          {submitting ? (
            <div className="flex items-center gap-2 font-mono text-xs text-primary">
              <Loader2 className="size-4 animate-spin" />
              {botDone ? "Grading both answers…" : `${plan.opponent.username} is finishing…`}
            </div>
          ) : botDone ? (
            <div className="flex items-center gap-2 font-mono text-xs text-primary">
              <CheckCircle2 className="size-4" />
              Submitted · {fmt(plan.botFinishMs)}
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="relative flex size-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal/60" />
                <span className="relative inline-flex size-2 rounded-full bg-terminal" />
              </span>
              Answering…
            </div>
          )}
          <p className="border-t border-border pt-3 font-mono text-[11px] leading-relaxed text-muted-foreground/70">
            {botDone && !submitting
              ? "They're in. Submit your answer to see who scored higher."
              : "Whoever's answer scores the higher % accuracy wins the match."}
          </p>
        </div>
      </Card>
    </div>
  );
}
