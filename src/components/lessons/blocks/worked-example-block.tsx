"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PencilRuler, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { useLessonProgress } from "@/components/lessons/lesson-progress";
import type { WorkedExampleBlock as WorkedExampleBlockData } from "@/types/lessons";

export function WorkedExampleBlock({ block }: { block: WorkedExampleBlockData }) {
  const { markDone } = useLessonProgress();
  // Encourage an attempt before revealing the full solution.
  const [shown, setShown] = useState(false);

  const toggle = () => {
    setShown((s) => !s);
    markDone(block.id);
  };

  return (
    <Card className="overflow-hidden border-primary/20">
      <div className="flex items-center gap-2 border-b border-border bg-primary/[0.04] px-5 py-2.5">
        <PencilRuler className="size-4 text-primary" />
        <span className="text-sm font-semibold">
          {block.title ?? "Worked example"}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-lg border border-border bg-card/40 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Problem
          </p>
          <Markdown content={block.problem} className="text-sm" />
        </div>

        <Button
          variant={shown ? "ghost" : "secondary"}
          onClick={toggle}
        >
          {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {shown ? "Hide solution" : "Reveal solution"}
        </Button>

        <AnimatePresence initial={false}>
          {shown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-3">
                {block.steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span
                      aria-label={`Step ${i + 1}`}
                      className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm font-medium">{step.label}</p>
                      <Markdown content={step.markdown} className="text-sm" />
                    </div>
                  </div>
                ))}
                <div className="rounded-lg border border-success/40 bg-success/10 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-success">
                    Answer
                  </p>
                  <Markdown content={block.answer} className="text-sm" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
