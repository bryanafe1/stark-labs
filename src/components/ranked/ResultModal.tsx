"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Skull, TrendingUp, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import { rankForElo, nextRank, rankProgress } from "./ranks";
import type { ResultState } from "./types";

/** Animate a number from→to over `ms` using rAF. */
function useCountUp(from: number, to: number, ms = 900): number {
  const [val, setVal] = useState(from);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, ms]);
  return val;
}

export function ResultModal({
  result,
  onQueueAgain,
  onLeave,
}: {
  result: ResultState;
  onQueueAgain: () => void;
  onLeave: () => void;
}) {
  const win = result.outcome === "WIN";
  const displayElo = useCountUp(result.eloBefore, result.eloAfter);

  const rank = rankForElo(result.eloAfter);
  const next = nextRank(result.eloAfter);
  const pct = Math.round(rankProgress(result.eloAfter) * 100);
  const promoted =
    win && rankForElo(result.eloBefore).key !== rank.key;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className={cn(
          "glass relative w-full overflow-hidden rounded-xl border",
          result.conceptual ? "max-w-md" : "max-w-sm",
        )}
      >
        {/* Banner */}
        <div
          className={cn(
            "flex flex-col items-center gap-2 border-b border-border p-7 text-center",
            win ? "bg-terminal/[0.06]" : "bg-destructive/[0.06]",
          )}
        >
          {win ? (
            <Trophy className="size-12 text-terminal" />
          ) : (
            <Skull className="size-12 text-destructive" />
          )}
          <h2
            className={cn(
              "font-mono text-3xl font-black tracking-tight",
              win ? "text-terminal" : "text-destructive",
            )}
          >
            {win ? "VICTORY" : "DEFEAT"}
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            vs {result.opponent.username} · {result.opponent.elo} Elo
          </p>
        </div>

        {/* Elo count-up */}
        <div className="space-y-5 p-6">
          <div className="text-center">
            <p className="font-mono text-4xl font-black tabular-nums">{displayElo}</p>
            <p
              className={cn(
                "mt-1 flex items-center justify-center gap-1 font-mono text-sm font-semibold",
                win ? "text-terminal" : "text-destructive",
              )}
            >
              {win ? <TrendingUp className="size-4" /> : null}
              {result.delta > 0 ? "+" : ""}
              {result.delta} Elo
            </p>
          </div>

          {/* Conceptual match: accuracy %s + the shared post-match review */}
          {result.conceptual && (
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="flex items-center justify-center gap-4 font-mono text-sm">
                  <span className={cn("font-bold", win ? "text-terminal" : "text-foreground")}>
                    You {result.userScore}%
                  </span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="font-bold text-foreground">
                    {result.opponent.username} {result.oppScore}%
                  </span>
                </div>
              </div>

              {result.gradeError ? (
                <p className="text-center text-xs text-muted-foreground">{result.gradeError}</p>
              ) : (
                <div className="max-h-72 space-y-3 overflow-y-auto rounded-lg border border-border bg-background p-3 text-left">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    {"// post-match review"}
                  </p>
                  {result.question && (
                    <div>
                      <p className="text-xs font-semibold text-foreground">Question</p>
                      <p className="mt-0.5 whitespace-pre-wrap text-xs leading-relaxed text-foreground/80">
                        {result.question}
                      </p>
                    </div>
                  )}
                  {result.concepts && result.concepts.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground">Concepts</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {result.concepts.map((c) => (
                          <span
                            key={c}
                            className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.modelAnswer && (
                    <div>
                      <p className="text-xs font-semibold text-foreground">Answer</p>
                      <div className="mt-0.5 text-xs leading-relaxed text-foreground/80">
                        <Markdown content={result.modelAnswer} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {promoted && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 rounded-lg border border-terminal/40 bg-terminal/10 py-2 font-mono text-sm font-semibold text-terminal"
            >
              <ArrowUpRight className="size-4" />
              Promoted to {rank.label}!
            </motion.div>
          )}

          {/* Rank progress */}
          <div>
            <div className="mb-1.5 flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span>{rank.label}</span>
              <span>{next ? next.label : "Max"}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-terminal"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" className="flex-1" onClick={onLeave}>
              Leave
            </Button>
            <Button className="flex-1" onClick={onQueueAgain}>
              Queue again
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
