"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Timer, Loader2, Bot as BotIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gradeAnswer } from "@/lib/grading";
import { cn } from "@/lib/utils";
import { botStage } from "./bots";
import type { MatchPlan, Outcome } from "./types";

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function SprintArena({
  plan,
  onResult,
}: {
  plan: MatchPlan;
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
    const res = gradeAnswer(plan.problem, { numericAnswer: num });
    if (res.status === "CORRECT") {
      resolved.current = true;
      onResult("WIN");
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
    }
  };

  const botProgress = Math.min(1, elapsed / plan.botFinishMs);
  const stage = botStage(botProgress);

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
            <h2 className="text-lg font-semibold tracking-tight">{plan.problem.title}</h2>
            <div className="mt-2 whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-foreground/90">
              {plan.problem.prompt}
            </div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <label className="block font-mono text-xs uppercase tracking-wide text-muted-foreground">
              answer
            </label>
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
              {plan.problem.unit && (
                <span className="shrink-0 font-mono text-sm text-muted-foreground">
                  {plan.problem.unit}
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
              <BotIcon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-mono text-sm font-medium">{plan.opponent.username}</p>
              <p className="font-mono text-xs text-muted-foreground">{plan.opponent.elo} Elo</p>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              {stage.label}
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-muted-foreground/80 transition-[width] duration-200"
                style={{ width: `${Math.round(botProgress * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-muted-foreground/70">
              step {Math.min(stage.index + 1, 6)} / 6
            </p>
          </div>

          <p className="border-t border-border pt-3 font-mono text-[11px] leading-relaxed text-muted-foreground/70">
            Submit a correct answer before your opponent finishes to take the match.
          </p>
        </div>
      </Card>
    </div>
  );
}
