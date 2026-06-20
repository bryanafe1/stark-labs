import { Card } from "@/components/ui/card";
import { DISCIPLINES, tierForElo } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { DisciplineElo } from "@/features/arena/get-arena";

export function EloGrid({ items }: { items: DisciplineElo[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {items.map((item) => {
        const meta = DISCIPLINES[item.discipline];
        const Icon = meta.icon;
        const tier = tierForElo(item.elo);
        const total = item.wins + item.losses;
        const wr = total > 0 ? Math.round((item.wins / total) * 100) : 0;
        const token = `--d-${meta.key.toLowerCase()}`;
        return (
          <Card key={item.discipline} className="p-4">
            <div className="flex items-center gap-2">
              <span
                className="flex size-8 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `hsl(var(${token}) / 0.14)`,
                  color: `hsl(var(${token}))`,
                }}
              >
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-medium">{meta.label}</span>
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums">{item.elo}</p>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span className={cn("font-medium", tier.textClass)}>{tier.label}</span>
              <span>
                {item.wins}W · {item.losses}L · {wr}%
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
