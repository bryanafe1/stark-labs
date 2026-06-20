import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisciplinePill } from "@/components/practice/badges";
import { cn, timeAgo } from "@/lib/utils";
import type { MatchHistoryItem } from "@/features/arena/get-arena";

const RESULT_STYLE = {
  WIN: { label: "W", cls: "bg-emerald-500/15 text-emerald-400" },
  LOSS: { label: "L", cls: "bg-rose-500/15 text-rose-400" },
  DRAW: { label: "D", cls: "bg-slate-500/15 text-slate-300" },
} as const;

export function MatchHistory({ items }: { items: MatchHistoryItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Matches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((m) => {
          const r = RESULT_STYLE[m.result];
          const up = m.eloDelta > 0;
          return (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card/40 p-3"
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                  r.cls,
                )}
              >
                {r.label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">vs {m.opponent}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <DisciplinePill discipline={m.discipline} />
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(m.createdAt)}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 text-sm font-semibold tabular-nums",
                  up ? "text-emerald-400" : m.eloDelta < 0 ? "text-rose-400" : "text-muted-foreground",
                )}
              >
                {up ? "+" : ""}
                {m.eloDelta}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
