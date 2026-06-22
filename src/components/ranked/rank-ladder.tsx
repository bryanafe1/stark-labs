"use client";

import { RANK_TIERS, tierForElo } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The full rank ladder, laid out horizontally (Bronze → Grandmaster) with Elo
 * ranges, so a player sees every tier and exactly where they stand.
 */
export function RankLadder({ elo }: { elo: number }) {
  const current = tierForElo(elo);

  return (
    <div className="elevated rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Rank ladder</h2>
        <span className="font-mono text-xs text-muted-foreground">
          You: {elo} Elo · {current.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {RANK_TIERS.map((t, idx) => {
          const next = RANK_TIERS[idx + 1];
          const range = next ? `${t.minElo}–${next.minElo - 1}` : `${t.minElo}+`;
          const isCurrent = t.key === current.key;
          return (
            <div
              key={t.key}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors",
                isCurrent ? "border-primary bg-primary/10" : "border-border",
              )}
            >
              <span
                className={cn("size-7 shrink-0 rounded-full bg-gradient-to-br", t.gradient)}
                aria-hidden
              />
              <p className={cn("text-xs font-semibold leading-tight", t.textClass)}>{t.label}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{range}</p>
              {isCurrent && (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
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
