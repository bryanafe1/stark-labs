import type { Metadata } from "next";
import { Users, DollarSign, TrendingUp, Activity, Lock, LogOut } from "lucide-react";
import { getAdminMetrics } from "@/features/admin/get-admin-metrics";
import {
  getCreatorsWithStats,
  getCompedUsers,
  getPricingInfo,
  getCoupons,
  getSalesInfo,
} from "@/features/admin/get-admin-extras";
import { Card } from "@/components/ui/card";
import {
  CreatorsSection,
  CompSection,
  PricingSection,
  CouponsSection,
  SalesSection,
} from "@/components/admin/admin-sections";
import { isAdminAuthed } from "@/lib/admin-auth";
import { adminLogin, adminLogout } from "@/server/actions/admin-auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

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

// ---- Login gate -----------------------------------------------------------

function AdminLogin({ error }: { error?: string }) {
  const input =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition focus-visible:ring-2";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm p-7">
        <div className="mb-5 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lock className="size-5" />
          </span>
          <div>
            <h1 className="text-base font-bold leading-none tracking-tight">OC // LABS Admin</h1>
            <p className="mt-1 text-xs text-muted-foreground">Restricted access</p>
          </div>
        </div>
        <form action={adminLogin} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Username</label>
            <input name="username" autoComplete="username" required className={input} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
            <input name="password" type="password" autoComplete="current-password" required className={input} />
          </div>
          {error && <p className="text-sm font-medium text-destructive">Invalid username or password.</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
          </button>
        </form>
      </Card>
    </div>
  );
}

const NAV = [
  { href: "#sales", label: "Sales" },
  { href: "#creators", label: "Creators" },
  { href: "#comp", label: "Comp" },
  { href: "#pricing", label: "Pricing" },
  { href: "#coupons", label: "Coupons" },
  { href: "#signups", label: "Signups" },
];

export default async function AdminPage({ searchParams }: { searchParams: { error?: string } }) {
  if (!isAdminAuthed()) return <AdminLogin error={searchParams.error} />;

  const [m, creators, comped, pricing, coupons, sales] = await Promise.all([
    getAdminMetrics(),
    getCreatorsWithStats(),
    getCompedUsers(),
    getPricingInfo(),
    getCoupons(),
    getSalesInfo(),
  ]);
  const baseUrl = process.env.AUTH_URL ?? "https://overclocker.dev";
  const maxDay = Math.max(1, ...m.signupsByDay.map((d) => d.count));

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 pb-16 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <p className="text-sm text-muted-foreground">Business metrics, creators, pricing, and sales — live.</p>
          <nav className="mt-3 flex flex-wrap gap-2">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
        <form action={adminLogout}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="size-3.5" /> Log out
          </button>
        </form>
      </div>

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric icon={Users} label="Total users" value={String(m.totalUsers)} sub={`+${m.signupsToday} today`} />
        <Metric icon={DollarSign} label="Paying users" value={String(m.payingTotal)} sub={`${m.conversionPct}% conversion`} />
        <Metric icon={TrendingUp} label="MRR (subs)" value={`$${m.mrr.toLocaleString()}`} sub={`${m.pass} active passes`} />
        <Metric icon={Activity} label="Active (7d)" value={String(m.active7)} sub={`${m.submissions} submissions all-time`} />
      </div>

      <div id="sales" className="scroll-mt-20">
        <SalesSection sales={sales} />
      </div>

      <div id="creators" className="scroll-mt-20">
        <CreatorsSection creators={creators} baseUrl={baseUrl} />
      </div>

      <div id="comp" className="scroll-mt-20">
        <CompSection comped={comped} />
      </div>

      <div id="pricing" className="scroll-mt-20">
        <PricingSection pricing={pricing} />
      </div>

      <div id="coupons" className="scroll-mt-20">
        <CouponsSection coupons={coupons} />
      </div>

      {/* Signups */}
      <div id="signups" className="scroll-mt-20 space-y-4">
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
    </div>
  );
}
