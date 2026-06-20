import { Trophy, Flame, Target, Swords, ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/types/dashboard";

const ICONS: Record<DashboardStat["icon"], LucideIcon> = {
  trophy: Trophy,
  flame: Flame,
  target: Target,
  swords: Swords,
};

export function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = ICONS[stat.icon];
  const delta = stat.deltaPct ?? 0;
  const positive = delta >= 0;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        {delta !== 0 && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              positive ? "text-emerald-400" : "text-rose-400",
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{stat.value}</p>
      <p className="text-xs text-muted-foreground">{stat.label}</p>
    </Card>
  );
}
