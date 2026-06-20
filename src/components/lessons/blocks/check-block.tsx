"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import { useLessonProgress } from "@/components/lessons/lesson-progress";
import type { CheckBlock as CheckBlockData } from "@/types/lessons";

export function CheckBlock({ block }: { block: CheckBlockData }) {
  const { markDone } = useLessonProgress();
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const correct = picked === block.answerId;

  const pick = (id: string) => {
    if (answered) return;
    setPicked(id);
    markDone(block.id);
  };

  return (
    <Card className="overflow-hidden border-dashed">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/30 px-5 py-2.5">
        <HelpCircle className="size-4 text-primary" />
        <span className="text-sm font-semibold">Quick check</span>
      </div>

      <div className="space-y-3 p-5">
        <p className="text-sm font-medium">{block.question}</p>

        <div className="space-y-2">
          {block.choices.map((c) => {
            const isAnswer = c.id === block.answerId;
            const isPicked = c.id === picked;
            return (
              <button
                key={c.id}
                type="button"
                disabled={answered}
                onClick={() => pick(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  !answered && "border-input hover:border-primary/40 hover:bg-accent/40",
                  answered && isAnswer && "border-success/40 bg-success/10",
                  answered && isPicked && !isAnswer && "border-destructive/40 bg-destructive/10",
                  answered && !isAnswer && !isPicked && "border-input opacity-60",
                )}
              >
                <span className="flex-1">{c.label}</span>
                {answered && isAnswer && (
                  <CheckCircle2 className="size-4 text-success" />
                )}
                {answered && isPicked && !isAnswer && (
                  <XCircle className="size-4 text-destructive" />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "rounded-lg border p-3",
                  correct
                    ? "border-success/30 bg-success/5"
                    : "border-amber-500/30 bg-amber-500/5",
                )}
              >
                <p className="mb-1 text-sm font-semibold">
                  {correct ? "Correct ✔" : "Not quite"}
                </p>
                <Markdown content={block.explanation} className="text-sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
