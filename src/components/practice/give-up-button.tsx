"use client";

import { useState } from "react";
import { Flag, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";

/**
 * "Give up" → confirm → reveal the full step-by-step worked solution.
 * Distinct from hints (which only nudge): this shows the complete reasoning.
 */
export function GiveUpButton({ solution }: { solution?: string }) {
  const [phase, setPhase] = useState<"idle" | "confirm" | "revealed">("idle");
  if (!solution) return null;

  if (phase === "revealed") {
    return (
      <div className="space-y-2 border-t border-border pt-4">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Flag className="size-4 text-muted-foreground" /> Worked solution
        </p>
        <div className="rounded-lg border border-border bg-secondary/40 p-4">
          <Markdown content={solution} />
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-4">
      {phase === "idle" ? (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setPhase("confirm")}
        >
          <Flag className="size-4" /> Give up &amp; see the solution
        </Button>
      ) : (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-3">
          <p className="flex items-center gap-2 text-sm font-medium">
            <TriangleAlert className="size-4 text-amber-400" />
            Are you sure? You&apos;ll see the full step-by-step solution.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            You learn most by struggling first — try a hint if you haven&apos;t.
          </p>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setPhase("idle")}>
              Keep trying
            </Button>
            <Button size="sm" onClick={() => setPhase("revealed")}>
              Yes, show me
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
