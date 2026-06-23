import { Users } from "lucide-react";
import { getAdminMetrics } from "@/features/admin/get-admin-metrics";
import { Card } from "@/components/ui/card";
import { Metric } from "@/components/admin/admin-sections";

export const dynamic = "force-dynamic";

export default async function AdminSignupsPage() {
  const m = await getAdminMetrics();
  const maxDay = Math.max(1, ...m.signupsByDay.map((d) => d.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Signups</h1>
        <p className="text-sm text-muted-foreground">New accounts over time.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Metric icon={Users} label="Signups today" value={String(m.signupsToday)} />
        <Metric icon={Users} label="Signups (7d)" value={String(m.signups7)} />
        <Metric icon={Users} label="Signups (30d)" value={String(m.signups30)} />
      </div>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold">Signups · last 14 days</h2>
        <div className="flex h-32 items-end gap-1.5">
          {m.signupsByDay.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1" title={`${d.day}: ${d.count}`}>
              <div
                className="w-full rounded-t bg-primary/70"
                style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%` }}
              />
              <span className="font-mono text-[9px] text-muted-foreground/60">{d.day.slice(5)}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold">Recent signups</h2>
        </div>
        <div className="divide-y divide-border">
          {m.recent.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
              <span className="min-w-0 flex-1 truncate font-medium">{r.email}</span>
              <span
                className={
                  r.tier === "admin"
                    ? "rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    : r.status === "active"
                      ? "rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary"
                      : "rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground"
                }
              >
                {r.tier}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {r.createdAt.toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
