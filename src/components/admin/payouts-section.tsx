import { Banknote, Users, TrendingUp, Repeat, UserPlus, UserMinus, Mic, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Metric } from "@/components/admin/admin-sections";
import { createConnectLink, payCreator } from "@/server/actions/payouts";
import type { BusinessMetrics, PayoutCreatorRow } from "@/lib/payouts";

const dollars = (cents: number) =>
  `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const btn =
  "inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40";
const btnGhost =
  "inline-flex items-center justify-center rounded-lg border border-border px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary";

export interface PayoutsNotice {
  kind: "ok" | "error" | "link";
  msg: string;
  link?: string;
}

export function PayoutsSection({
  metrics,
  rows,
  notice,
}: {
  metrics: BusinessMetrics;
  rows: PayoutCreatorRow[];
  notice?: PayoutsNotice;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Business</h1>
        <p className="text-sm text-muted-foreground">Revenue, growth, and creator payouts.</p>
      </div>

      {notice && <Notice notice={notice} />}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={Repeat}
          label="MRR"
          value={dollars(metrics.mrrCents)}
          sub={`${metrics.intervalCounts.monthly} monthly · ${metrics.intervalCounts.annual} annual`}
        />
        <Metric
          icon={Users}
          label="Paid users"
          value={String(metrics.paidUsers)}
          sub={`${metrics.tierCounts.standard} Standard · ${metrics.tierCounts.pro} Pro`}
        />
        <Metric
          icon={TrendingUp}
          label="Conversion"
          value={`${metrics.conversionPct}%`}
          sub={`of ${metrics.totalUsers} total users`}
        />
        <Metric icon={UserPlus} label="New paid this month" value={String(metrics.newPaidThisMonth)} />
        <Metric icon={UserMinus} label="Cancellations this month" value={String(metrics.cancellationsThisMonth)} />
        <Metric icon={Mic} label="Voice sessions sold" value={String(metrics.voiceSessionsSold)} />
        <Metric icon={Gift} label="Creator-driven revenue" value={dollars(metrics.creatorRevenueCents)} />
        <Metric icon={Banknote} label="Commission owed" value={dollars(metrics.commissionOwedCents)} />
      </div>

      <div>
        <h2 className="mb-1 text-lg font-bold tracking-tight">Creator payouts</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Recurring commission. Pay out once a creator has onboarded and owes at least {dollars(2500)}.
        </p>
        {rows.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">No creators yet.</Card>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <PayoutRow key={r.id} r={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Notice({ notice }: { notice: PayoutsNotice }) {
  const tone =
    notice.kind === "error"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : notice.kind === "link"
        ? "border-primary/40 bg-primary/10 text-foreground"
        : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tone}`}>
      <p className="font-medium">{notice.msg}</p>
      {notice.link && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">
            Send this onboarding link to the creator (it expires in a few minutes):
          </p>
          <code className="mt-1 block w-full overflow-x-auto whitespace-nowrap rounded bg-background px-2 py-1.5 text-xs">
            {notice.link}
          </code>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ r }: { r: PayoutCreatorRow }) {
  const cls = "rounded-full px-2 py-0.5 text-xs font-semibold";
  if (r.payoutsEnabled) return <span className={`${cls} bg-emerald-500/15 text-emerald-600 dark:text-emerald-400`}>Payouts on</span>;
  if (r.connected) return <span className={`${cls} bg-amber-500/15 text-amber-600 dark:text-amber-400`}>Onboarding</span>;
  return <span className={`${cls} bg-secondary text-muted-foreground`}>Not set up</span>;
}

function PayoutRow({ r }: { r: PayoutCreatorRow }) {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">
            {r.name} <span className="font-mono text-xs text-muted-foreground">{r.code}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Earned {dollars(r.earnedCents)} · Paid {dollars(r.paidCents)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-bold tabular-nums">{dollars(r.owedCents)}</p>
            <p className="text-xs text-muted-foreground">owed</p>
          </div>
          <StatusBadge r={r} />
          {!r.payoutsEnabled ? (
            <form action={createConnectLink}>
              <input type="hidden" name="creatorId" value={r.id} />
              <button type="submit" className={btnGhost}>
                {r.connected ? "Resume setup" : "Set up payouts"}
              </button>
            </form>
          ) : (
            <form action={payCreator}>
              <input type="hidden" name="creatorId" value={r.id} />
              <button type="submit" className={btn} disabled={!r.canPay}>
                {r.canPay ? `Pay ${dollars(r.owedCents)}` : "Below min"}
              </button>
            </form>
          )}
        </div>
      </div>

      {r.payouts.length > 0 && (
        <div className="mt-3 space-y-1 border-t border-border pt-3">
          {r.payouts.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {new Date(p.createdAt).toLocaleDateString()} ·{" "}
                <span
                  className={
                    p.status === "paid"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : p.status === "failed"
                        ? "text-destructive"
                        : ""
                  }
                >
                  {p.status}
                </span>
              </span>
              <span className="tabular-nums">{dollars(p.amountCents)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
