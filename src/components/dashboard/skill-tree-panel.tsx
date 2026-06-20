"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DISCIPLINES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/components/motion/motion-primitives";
import type { DisciplineProgress } from "@/types/dashboard";

export function SkillTreePanel({ items }: { items: DisciplineProgress[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Disciplinary Skill Tree</CardTitle>
        <CardDescription>
          Mastery across all six engineering tracks.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {items.map((item, i) => {
          const meta = DISCIPLINES[item.discipline];
          const Icon = meta.icon;
          return (
            <motion.div
              key={item.discipline}
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={cn("flex size-9 items-center justify-center rounded-lg")}
                    style={{
                      backgroundColor: `hsl(var(--d-${meta.key.toLowerCase()}) / 0.15)`,
                      color: `hsl(var(--d-${meta.key.toLowerCase()}))`,
                    }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{meta.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.masteredNodes}/{item.totalNodes} nodes · {item.elo} Elo
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold tabular-nums">
                  {item.masteryPct}%
                </span>
              </div>
              <DisciplineBar pct={item.masteryPct} disciplineKey={meta.key} />
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/** Discipline-tinted progress fill rendered with an inline CSS var color. */
function DisciplineBar({
  pct,
  disciplineKey,
}: {
  pct: number;
  disciplineKey: string;
}) {
  return (
    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: `hsl(var(--d-${disciplineKey.toLowerCase()}))` }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
