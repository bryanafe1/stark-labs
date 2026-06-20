"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Progressive hints. The candidate reveals one at a time only when stuck —
 * each nudges over a technical hump without handing over the answer.
 */
export function HintButton({ hints }: { hints?: string[] }) {
  const list = hints ?? [];
  const [shown, setShown] = useState(0);
  if (list.length === 0) return null;

  return (
    <div className="space-y-2 border-t border-border pt-4">
      {shown > 0 && (
        <ul className="space-y-2">
          {list.slice(0, shown).map((h, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-lg border border-border bg-secondary/40 p-3 text-sm"
            >
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="font-medium text-muted-foreground">Hint {i + 1}: </span>
                {h}
              </span>
            </li>
          ))}
        </ul>
      )}

      {shown < list.length ? (
        <Button variant="secondary" size="sm" onClick={() => setShown((s) => s + 1)}>
          <Lightbulb className="size-4" />
          {shown === 0 ? "Stuck? Reveal a hint" : `Next hint (${shown + 1} of ${list.length})`}
        </Button>
      ) : (
        <p className="font-mono text-xs text-muted-foreground/70">
          That&apos;s every hint — work the steps from here.
        </p>
      )}
    </div>
  );
}
