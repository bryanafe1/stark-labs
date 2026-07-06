"use client";

import { motion } from "framer-motion";
import { Flame, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatCompact } from "@/lib/utils";
import { tierForElo, tierProgress, RANK_TIERS } from "@/lib/constants";

interface RankCardProps {
  overallElo: number;
  xp: number;
  streakDays: number;
}

export function RankCard({ overallElo, xp, streakDays }: RankCardProps) {
  const tier = tierForElo(overallElo);
  const progress = tierProgress(overallElo);
  const idx = RANK_TIERS.findIndex((t) => t.key === tier.key);
  const next = RANK_TIERS[idx + 1];
  const toNext = next ? next.minElo - overallElo : 0;

  return (
    <Card className="relative overflow-hidden border-border bg-card">
      <div
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-gradient-to-br opacity-25 blur-2xl",
          tier.gradient,
        )}
      />
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Rank</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className={cn("text-3xl font-bold", tier.textClass)}>
                {tier.label}
              </h2>
              <Sparkles className={cn("size-5", tier.textClass)} />
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className={cn(
              "flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br font-mono text-2xl font-black text-background shadow-lg",
              tier.gradient,
            )}
          >
            {overallElo}
          </motion.div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {next ? `Progress to ${next.label}` : "Peak tier reached"}
            </span>
            <span className="font-medium">
              {next ? `${toNext} Elo to go` : "★"}
            </span>
          </div>
          <Progress
            value={progress * 100}
            indicatorClassName={cn("bg-gradient-to-r", tier.gradient)}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3">
            <Flame className="size-5 text-muted-foreground" />
            <div>
              <p className="text-lg font-bold leading-none">{streakDays}</p>
              <p className="text-xs text-muted-foreground">day streak</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3">
            <TrendingUp className="size-5 text-primary" />
            <div>
              <p className="text-lg font-bold leading-none">{formatCompact(xp)}</p>
              <p className="text-xs text-muted-foreground">total XP</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
