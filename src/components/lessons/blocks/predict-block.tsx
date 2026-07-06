"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import { useLessonProgress } from "@/components/lessons/lesson-progress";
import { cn } from "@/lib/utils";
import type { PredictBlock as PredictBlockData } from "@/types/lessons";

/**
 * Predict-then-reveal. The learner must commit a guess before the answer
 * unlocks — the curiosity gap is the hook. Awards XP on reveal.
 */
export function PredictBlock({ block }: { block: PredictBlockData }) {
  const { markDone } = useLessonProgress();
  const [picked, setPicked] = useState<string | null>(null);
  const committed = picked !== null;
  const correct = picked === block.answerId;

  function choose(id: string) {
    if (committed) return;
    setPicked(id);
    markDone(block.id);
  }

  return (
    <Card className="overflow-hidden border-terminal/20">
      <div className="flex items-center gap-2 border-b border-border bg-terminal/[0.04] px-5 py-2.5">
        <Lightbulb className="size-4 text-terminal" />
        <span className="text-sm font-semibold">Make your prediction</span>
        <span className="ml-auto font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          guess first
        </span>
      </div>

      <div className="space-y-3 p-5">
        <p className="text-sm font-medium">{block.question}</p>

        <div className="grid gap-2">
          {block.options.map((o) => {
            const isAnswer = o.id === block.answerId;
            const isPicked = o.id === picked;
            return (
              <button
                key={o.id}
                type="button"
                disabled={committed}
                onClick={() => choose(o.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                  !committed && "border-input hover:border-terminal/50 hover:bg-terminal/[0.04]",
                  committed && isAnswer && "border-success/50 bg-success/10",
                  committed && isPicked && !isAnswer && "border-destructive/50 bg-destructive/10",
                  committed && !isAnswer && !isPicked && "border-input opacity-60",
                )}
              >
                <span className="flex-1">{o.label}</span>
                {committed && isAnswer && <CheckCircle2 className="size-4 text-success" />}
                {committed && isPicked && !isAnswer && <XCircle className="size-4 text-destructive" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {committed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <div className="rounded-lg border border-border bg-card/60 p-3">
                <p className={cn("mb-1 text-sm font-semibold", correct ? "text-success" : "text-foreground")}>
                  {correct ? "Nailed it ✦" : "Good guess — here's the truth"}
                </p>
                <Markdown content={block.reveal} className="text-sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
