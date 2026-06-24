import {
  setCreatorActive,
  grantComp,
  revokeComp,
  updatePlanPrice,
  createCouponAction,
  setCouponActiveAction,
} from "@/server/actions/admin";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/admin/copy-button";
import { AddCreatorForm } from "@/components/admin/add-creator-form";
import { ResettingForm } from "@/components/admin/resetting-form";
import type { CreatorRow, CompedUser, CouponRow, SalesInfo } from "@/features/admin/get-admin-extras";

const dollars = (cents: number) => `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/50";
const labelCls = "mb-1 block text-xs font-medium text-muted-foreground";
const btnCls =
  "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90";
const btnGhost =
  "inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary";

export function Metric({
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

function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ===========================================================================
//  CREATORS
// ===========================================================================

export function CreatorsSection({ creators, baseUrl }: { creators: CreatorRow[]; baseUrl: string }) {
  return (
    <section>
      <SectionHeading
        title="Creators"
        sub="Comped accounts with a shareable code. Their audience gets a discount; you accrue a commission per paid conversion."
      />

      <Card className="mb-4 p-5">
        <h3 className="mb-3 text-sm font-semibold">Add a creator</h3>
        <AddCreatorForm />
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Creator</th>
                <th className="px-4 py-2 font-medium">Code / link</th>
                <th className="px-4 py-2 text-center font-medium">Disc / Comm</th>
                <th className="px-4 py-2 text-center font-medium">Signups</th>
                <th className="px-4 py-2 text-center font-medium">Paying</th>
                <th className="px-4 py-2 text-right font-medium">Revenue</th>
                <th className="px-4 py-2 text-right font-medium">Owed</th>
                <th className="px-4 py-2 text-right font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {creators.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No creators yet. Add your first above.
                  </td>
                </tr>
              )}
              {creators.map((c) => {
                const link = `${baseUrl}/r/${c.code}`;
                return (
                  <tr key={c.id} className={c.active ? "" : "opacity-50"}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.email ?? "no email"} {c.hasAccount ? "· linked" : "· not signed up"}
                      </div>
                      {c.notes && <div className="mt-0.5 max-w-xs text-xs italic text-muted-foreground/70">{c.notes}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">{c.code}</span>
                        <CopyButton value={link} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-xs">
                      {c.discountPercent}% / {c.commissionPercent}%
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums">{c.signups}</td>
                    <td className="px-4 py-3 text-center tabular-nums">{c.activePayers}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{dollars(c.grossCents)}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{dollars(c.commissionCents)}</td>
                    <td className="px-4 py-3 text-right">
                      <form action={setCreatorActive}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="active" value={(!c.active).toString()} />
                        <button type="submit" className={btnGhost}>{c.active ? "Disable" : "Enable"}</button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

// ===========================================================================
//  COMP ACCESS
// ===========================================================================

export function CompSection({ comped }: { comped: CompedUser[] }) {
  return (
    <section>
      <SectionHeading title="Free (comp) access" sub="Grant any existing account full Pro access without payment." />
      <Card className="mb-4 p-5">
        <ResettingForm action={grantComp} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className={labelCls}>Email</label>
            <input name="email" type="email" required placeholder="person@example.com" className={inputCls} />
          </div>
          <div className="flex-1">
            <label className={labelCls}>Reason</label>
            <input name="reason" placeholder="Beta tester" className={inputCls} />
          </div>
          <button type="submit" className={btnCls}>Grant access</button>
        </ResettingForm>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">
          Comped accounts ({comped.length})
        </div>
        <div className="divide-y divide-border">
          {comped.length === 0 && <div className="px-5 py-6 text-sm text-muted-foreground">None yet.</div>}
          {comped.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
              <span className="min-w-0 flex-1 truncate font-medium">{u.email}</span>
              <span className="hidden text-xs text-muted-foreground sm:inline">{u.reason ?? "—"}</span>
              <form action={revokeComp}>
                <input type="hidden" name="userId" value={u.id} />
                <button type="submit" className={btnGhost}>Revoke</button>
              </form>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// ===========================================================================
//  PRICING
// ===========================================================================

export function PricingSection({ pricing }: { pricing: { monthly: number; annual: number; pass: number } }) {
  const tiers: { tier: "monthly" | "annual" | "pass"; label: string; amount: number; hint: string }[] = [
    { tier: "monthly", label: "Monthly", amount: pricing.monthly, hint: "per month" },
    { tier: "annual", label: "Annual", amount: pricing.annual, hint: "per year" },
    { tier: "pass", label: "Season Pass", amount: pricing.pass, hint: "one-time" },
  ];
  return (
    <section>
      <SectionHeading
        title="Pricing"
        sub="Changing a price creates a new Stripe price and points new checkouts at it. Existing subscribers keep their current price."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiers.map((t) => (
          <Card key={t.tier} className="p-5">
            <p className="text-sm font-semibold">{t.label}</p>
            <p className="mb-3 text-xs text-muted-foreground">Currently ${t.amount} {t.hint}</p>
            <form action={updatePlanPrice} className="flex items-end gap-2">
              <input type="hidden" name="tier" value={t.tier} />
              <div className="flex-1">
                <label className={labelCls}>New price (USD)</label>
                <input name="amount" type="number" min={1} step="0.01" defaultValue={t.amount} className={inputCls} />
              </div>
              <button type="submit" className={btnGhost}>Save</button>
            </form>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ===========================================================================
//  COUPONS
// ===========================================================================

export function CouponsSection({ coupons }: { coupons: CouponRow[] }) {
  return (
    <section>
      <SectionHeading title="Coupons" sub="General promo codes (creator codes also appear here)." />
      <Card className="mb-4 p-5">
        <h3 className="mb-3 text-sm font-semibold">Create a coupon</h3>
        <ResettingForm action={createCouponAction} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <label className={labelCls}>Code</label>
            <input name="code" required placeholder="LAUNCH25" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Type</label>
            <select name="kind" className={inputCls} defaultValue="percent">
              <option value="percent">% off</option>
              <option value="amount">$ off</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Value</label>
            <input name="value" type="number" min={1} step="0.01" required placeholder="25" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Repeat (mo)</label>
            <input name="durationMonths" type="number" min={1} placeholder="once" className={inputCls} />
          </div>
          <div className="col-span-2 sm:col-span-4">
            <button type="submit" className={btnCls}>Create coupon</button>
          </div>
        </ResettingForm>
      </Card>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Code</th>
                <th className="px-4 py-2 font-medium">Discount</th>
                <th className="px-4 py-2 font-medium">Duration</th>
                <th className="px-4 py-2 text-center font-medium">Redeemed</th>
                <th className="px-4 py-2 text-right font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No coupons yet.</td></tr>
              )}
              {coupons.map((c) => (
                <tr key={c.id} className={c.active ? "" : "opacity-50"}>
                  <td className="px-4 py-3 font-mono text-xs">{c.code}</td>
                  <td className="px-4 py-3">{c.label}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.duration}</td>
                  <td className="px-4 py-3 text-center tabular-nums">{c.timesRedeemed}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={setCouponActiveAction}>
                      <input type="hidden" name="promoId" value={c.id} />
                      <input type="hidden" name="active" value={(!c.active).toString()} />
                      <button type="submit" className={btnGhost}>{c.active ? "Disable" : "Enable"}</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

// ===========================================================================
//  SALES
// ===========================================================================

export function SalesSection({ sales }: { sales: SalesInfo }) {
  return (
    <section>
      <SectionHeading title="Sales" sub="Live from Stripe." />
      <div className="mb-4 grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-2xl font-bold tabular-nums">{dollars(sales.recentVolumeCents)}</p>
          <p className="text-xs text-muted-foreground">Recent volume (last {sales.recent.length} charges)</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold tabular-nums">{dollars(sales.commissionOwedCents)}</p>
          <p className="text-xs text-muted-foreground">Creator commission accrued</p>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">Recent charges</div>
        <div className="divide-y divide-border">
          {sales.recent.length === 0 && <div className="px-5 py-6 text-sm text-muted-foreground">No charges yet.</div>}
          {sales.recent.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
              <span className="min-w-0 flex-1 truncate">{c.email ?? "—"}</span>
              <span className="shrink-0 font-semibold tabular-nums">{dollars(c.amountCents)}</span>
              <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">
                {c.created.toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
