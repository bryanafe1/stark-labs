"use client";

import { RANK_TIERS, tierForElo } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The full rank ladder (Diamond → Bronze) with Elo ranges, so a player can see
 * every tier and exactly where they currently stand.
 */
export function RankLadder({ elo }: { elo: number }) {
  const current = tierForElo(elo);
  const ordered = [...RANK_TIERS].reverse(); // highest tier first

  return (
    <div className="elevated rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Rank ladder</h2>
        <span className="font-mono text-xs text-muted-foreground">
          You: {elo} Elo · {current.label}
        </span>
      </div>

      <div className="space-y-2">
        {ordered.map((t) => {
          const idx = RANK_TIERS.findIndex((x) => x.key === t.key);
          const next = RANK_TIERS[idx + 1];
          const range = next ? `${t.minElo}–${next.minElo - 1}` : `${t.minElo}+`;
          const isCurrent = t.key === current.key;
          return (
            <div
              key={t.key}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                isCurrent ? "border-primary bg-primary/5" : "border-border",
              )}
            >
              <span
                className={cn("size-8 shrink-0 rounded-full bg-gradient-to-br", t.gradient)}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-semibold", t.textClass)}>{t.label}</p>
                <p className="font-mono text-xs text-muted-foreground">{range} Elo</p>
              </div>
              {isCurrent && (
                <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  You
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
