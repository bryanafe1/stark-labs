"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Readiness } from "@/lib/readiness";

export function ReadinessCard({ readiness }: { readiness: Readiness }) {
  const [shown, setShown] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(readiness.score * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [readiness.score]);

  const R = 54;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - shown / 100);
  const ready = readiness.score >= 70;
  const arc = ready ? "hsl(var(--success))" : "hsl(var(--primary))";

  return (
    <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/[0.06] to-transparent p-5 sm:p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        {/* Gauge */}
        <div className="relative flex size-24 shrink-0 items-center justify-center sm:size-32">
          <svg viewBox="0 0 120 120" className="size-24 -rotate-90 sm:size-32">
            <circle cx="60" cy="60" r={R} fill="none" strokeWidth="9" style={{ stroke: "hsl(var(--secondary))" }} />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              strokeWidth="9"
              strokeLinecap="round"
              style={{ stroke: arc, strokeDasharray: C, strokeDashoffset: offset }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("font-mono text-2xl font-black tabular-nums sm:text-3xl", ready && "text-success")}>
              {shown}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">/ 100</span>
          </div>
        </div>

        {/* Level + next action */}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Interview readiness
          </p>
          <p className={cn("mt-0.5 text-xl font-bold tracking-tight", ready && "text-success")}>
            {readiness.level.label}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{readiness.level.blurb}</p>
          <Link
            href={readiness.topAction.href}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
          >
            <Target className="size-3.5" />
            Next: {readiness.topAction.label}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Component bars — click any to go improve it */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {readiness.components.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="group rounded-lg border border-border bg-background/50 p-3 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{c.label}</span>
              <span className="font-mono text-muted-foreground">{c.summary}</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out"
                style={{ width: `${mounted ? c.value : 0}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
