import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { getAdminMetrics } from "@/features/admin/get-admin-metrics";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin" };

function Metric({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground/70">{sub}</p>}
    </Card>
  );
}

export default async function AdminPage() {
  const userId = await getCurrentUserId();
  const me = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
    : null;
  if (me?.role !== "ADMIN") notFound();

  const m = await getAdminMetrics();
  const maxDay = Math.max(1, ...m.signupsByDay.map((d) => d.count));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground">Key measurables, live from the database.</p>
      </div>

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric icon={Users} label="Total users" value={String(m.totalUsers)} sub={`+${m.signupsToday} today`} />
        <Metric icon={DollarSign} label="Paying users" value={String(m.payingTotal)} sub={`${m.conversionPct}% conversion`} />
        <Metric icon={TrendingUp} label="MRR (subs)" value={`$${m.mrr.toLocaleString()}`} sub={`${m.pass} active passes`} />
        <Metric icon={Activity} label="Active (7d)" value={String(m.active7)} sub={`${m.submissions} submissions all-time`} />
      </div>

      {/* Signups */}
      <div className="grid grid-cols-3 gap-4">
        <Metric icon={Users} label="Signups today" value={String(m.signupsToday)} />
        <Metric icon={Users} label="Signups (7d)" value={String(m.signups7)} />
        <Metric icon={Users} label="Signups (30d)" value={String(m.signups30)} />
      </div>

      {/* Plan breakdown */}
      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold">Active plans</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Monthly", n: m.monthly, note: "$20/mo" },
            { label: "Annual", n: m.annual, note: "$190/yr" },
            { label: "Season Pass", n: m.pass, note: "$39 one-time" },
          ].map((p) => (
            <div key={p.label} className="rounded-lg border border-border p-4">
              <p className="text-2xl font-bold tabular-nums">{p.n}</p>
              <p className="text-sm font-medium">{p.label}</p>
              <p className="font-mono text-xs text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Signups last 14 days */}
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

      {/* Recent signups */}
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

      <p className="text-xs text-muted-foreground/70">
        {m.lessonsInProgress} lessons in progress · MRR counts recurring subscriptions only (passes
        are one-time revenue).
      </p>
    </div>
  );
}
