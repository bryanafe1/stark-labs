"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListChecks, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import type { WalkthroughBlock as WalkthroughBlockData } from "@/types/lessons";

export function WalkthroughBlock({ block }: { block: WalkthroughBlockData }) {
  // Progressive reveal — start with the first step visible.
  const [revealed, setRevealed] = useState(1);
  const allShown = revealed >= block.steps.length;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/30 px-5 py-2.5">
        <ListChecks className="size-4 text-primary" />
        <span className="text-sm font-semibold">
          {block.title ?? "Walkthrough"}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {Math.min(revealed, block.steps.length)} / {block.steps.length}
        </span>
      </div>

      <div className="space-y-3 p-5">
        {block.steps.slice(0, revealed).map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-3"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-sm font-semibold">{step.title}</p>
              <Markdown content={step.markdown} className="text-sm" />
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {!allShown && (
            <motion.div exit={{ opacity: 0 }}>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => setRevealed((r) => r + 1)}
              >
                <ChevronDown className="size-4" />
                Reveal next step
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
