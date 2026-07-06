"use client";

import { motion } from "framer-motion";
import { Swords, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { rankForElo, nextRank, rankProgress } from "./ranks";

function fmtTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function QueuePanel({
  queueing,
  elapsedMs,
  elo,
  onJoin,
  onCancel,
}: {
  queueing: boolean;
  elapsedMs: number;
  elo: number;
  onJoin: () => void;
  onCancel: () => void;
}) {
  const rank = rankForElo(elo);
  const next = nextRank(elo);
  const pct = Math.round(rankProgress(elo) * 100);

  return (
    <div className="mx-auto max-w-md text-center">
      {/* Rank header */}
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {rank.label}
        </p>
        <p className="mt-1 font-mono text-5xl font-black tabular-nums">{elo}</p>
        <div className="mx-auto mt-3 max-w-xs">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-terminal" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
            {next ? `${next.minElo - elo} Elo to ${next.label}` : "Top rank reached"}
          </p>
        </div>
      </div>

      {!queueing ? (
        <Button size="lg" className="w-full" onClick={onJoin}>
          <Swords className="size-4" />
          Join Ranked Queue
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <Radar />
          <div>
            <p className="font-mono text-sm text-terminal">Finding an opponent…</p>
            <p className="mt-1 font-mono text-2xl font-bold tabular-nums">{fmtTime(elapsedMs)}</p>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            <X className="size-4" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

/** Pure-CSS radar: pulsing rings + a sweeping conic beam, terminal green. */
function Radar() {
  return (
    <div className="relative size-44">
      {[0, 4, 8].map((inset, i) => (
        <span
          key={i}
          className="absolute rounded-full border border-terminal/25"
          style={{ inset: `${inset * 4}px` }}
        />
      ))}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 290deg, hsl(var(--terminal) / 0.35) 360deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, ease: "linear", repeat: Infinity }}
      />
      <span className="absolute inset-0 animate-ping rounded-full border border-terminal/40" />
      <span
        className={cn(
          "absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terminal",
        )}
      />
    </div>
  );
}
