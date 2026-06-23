import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { getAdminMetrics } from "@/features/admin/get-admin-metrics";
import { Card } from "@/components/ui/card";
import { Metric } from "@/components/admin/admin-sections";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const m = await getAdminMetrics();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Key business metrics, live from the database.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric icon={Users} label="Total users" value={String(m.totalUsers)} sub={`+${m.signupsToday} today`} />
        <Metric icon={DollarSign} label="Paying users" value={String(m.payingTotal)} sub={`${m.conversionPct}% conversion`} />
        <Metric icon={TrendingUp} label="MRR (subs)" value={`$${m.mrr.toLocaleString()}`} sub={`${m.pass} active passes`} />
        <Metric icon={Activity} label="Active (7d)" value={String(m.active7)} sub={`${m.submissions} submissions all-time`} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Metric icon={Users} label="Signups today" value={String(m.signupsToday)} />
        <Metric icon={Users} label="Signups (7d)" value={String(m.signups7)} />
        <Metric icon={Users} label="Signups (30d)" value={String(m.signups30)} />
      </div>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold">Active plans</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Monthly", n: m.monthly },
            { label: "Annual", n: m.annual },
            { label: "Season Pass", n: m.pass },
          ].map((p) => (
            <div key={p.label} className="rounded-lg border border-border p-4">
              <p className="text-2xl font-bold tabular-nums">{p.n}</p>
              <p className="text-sm font-medium">{p.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground/70">
          {m.lessonsInProgress} lessons in progress · MRR counts recurring subscriptions only.
        </p>
      </Card>
    </div>
  );
}
