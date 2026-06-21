"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tryEval } from "@/lib/expr";
import { useLessonProgress } from "@/components/lessons/lesson-progress";
import type { SandboxBlock as SandboxBlockData } from "@/types/lessons";

/** Format with sensible significant figures (handles tiny + huge magnitudes). */
function fmt(n: number, precision: number): string {
  if (n !== 0 && (Math.abs(n) >= 1e6 || Math.abs(n) < 1e-3)) {
    return n.toExponential(2);
  }
  return n.toFixed(precision);
}

export function SandboxBlock({ block }: { block: SandboxBlockData }) {
  const { markDone } = useLessonProgress();
  const defaults = useMemo(
    () => Object.fromEntries(block.variables.map((v) => [v.key, v.default])),
    [block.variables],
  );
  const [values, setValues] = useState<Record<string, number>>(defaults);

  const setVar = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    markDone(block.id); // playing with it counts as engagement
  };

  const result = tryEval(block.expression, values);
  const precision = block.precision ?? 2;

  const dirty = block.variables.some((v) => values[v.key] !== v.default);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-5 py-2.5">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="size-4 text-primary" />
          {block.title ?? "Interactive sandbox"}
        </span>
        {dirty && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setValues(defaults)}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        )}
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          {block.description && (
            <p className="text-sm text-muted-foreground">{block.description}</p>
          )}
          {block.variables.map((v) => (
            <div key={v.key}>
              <div className="mb-1 flex items-baseline justify-between">
                <label className="text-sm font-medium">
                  {v.label}
                  {v.unit && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      [{v.unit}]
                    </span>
                  )}
                </label>
                <span className="font-mono text-sm tabular-nums text-primary">
                  {fmt(values[v.key] ?? v.default, 3)}
                </span>
              </div>
              <input
                type="range"
                min={v.min}
                max={v.max}
                step={v.step}
                value={values[v.key] ?? v.default}
                onChange={(e) => setVar(v.key, Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[hsl(var(--terminal))]"
              />
            </div>
          ))}
        </div>

        {/* Live output */}
        <div className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/[0.04] p-4 text-center sm:p-6 md:min-w-44">
          <p className="text-xs text-muted-foreground">{block.outputLabel}</p>
          <p className="mt-1 break-all font-mono text-2xl font-bold tabular-nums text-primary sm:text-3xl">
            {result === null ? "—" : fmt(result, precision)}
          </p>
          {block.outputUnit && (
            <p className="mt-0.5 text-sm text-muted-foreground">{block.outputUnit}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
