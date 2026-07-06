import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAccess, proMinutesUsedThisMonth } from "@/lib/access";
import { openPortal, buyVoiceSession, startSubscription } from "@/server/actions/payments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PRO_MINUTE_CAP = Number(process.env.PRO_MONTHLY_MINUTE_CAP ?? 300);
const AMOUNT: Record<string, Record<string, number>> = {
  standard: { monthly: 20, annual: 190 },
  pro: { monthly: 40, annual: 349 },
};

function fmtDate(d: Date | null): string {
  return d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
}

export async function BillingCard({ userId }: { userId: string }) {
  const [access, user] = await Promise.all([
    getAccess(userId),
    prisma.user.findUnique({ where: { id: userId }, select: { billingInterval: true, role: true, comped: true } }),
  ]);
  const interval = user?.billingInterval ?? "monthly";
  const isActivePaid = access.status === "active";
  const amount = AMOUNT[access.tier]?.[interval];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing &amp; plan</CardTitle>
        <CardDescription>
          {user?.role === "ADMIN"
            ? "Admin — full access, no billing."
            : user?.comped
              ? "Free creator access (Pro). No billing."
              : access.tier === "free"
                ? "You're on the Free plan."
                : `${access.tier === "pro" ? "Pro" : "Standard"} plan.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Subscription line */}
        {user?.role === "ADMIN" || user?.comped ? null : isActivePaid ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium">
                {access.tier === "pro" ? "Pro" : "Standard"} · {interval}
                {amount ? ` · $${amount}/${interval === "annual" ? "yr" : "mo"}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {access.cancelAtPeriodEnd
                  ? `Cancels on ${fmtDate(access.currentPeriodEnd)}`
                  : `Renews ${fmtDate(access.currentPeriodEnd)}`}
              </p>
            </div>
            <form action={openPortal}>
              <Button type="submit" variant="secondary">
                Manage
              </Button>
            </form>
          </div>
        ) : access.status === "past_due" ? (
          <div className="flex items-center justify-between gap-2">
            <p className="text-destructive">Payment failed — we&apos;re retrying. Update your card to keep access.</p>
            <form action={openPortal}>
              <Button type="submit" variant="secondary">
                Update card
              </Button>
            </form>
          </div>
        ) : (
          <Button asChild>
            <Link href="/pricing">Upgrade</Link>
          </Button>
        )}

        {/* Voice session status */}
        {access.paid && (
          <div className="border-t border-border pt-4">
            <VoiceStatus userId={userId} pro={access.pro} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function VoiceStatus({ userId, pro }: { userId: string; pro: boolean }) {
  if (pro) {
    const usedMin = await proMinutesUsedThisMonth(userId);
    const remaining = Math.max(0, PRO_MINUTE_CAP - usedMin);
    const reset = new Date();
    reset.setMonth(reset.getMonth() + 1, 1);
    return (
      <div>
        <p className="font-medium">Voice interviews</p>
        <p className="text-xs text-muted-foreground">
          {remaining} of {PRO_MINUTE_CAP} minutes left this month · resets {fmtDate(reset)}
        </p>
      </div>
    );
  }

  // Standard / comped — credits
  const now = new Date();
  const credits = await prisma.sessionCredit.findMany({
    where: { userId, status: "available", expiresAt: { gt: now } },
    orderBy: { expiresAt: "asc" },
    select: { expiresAt: true },
  });
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p className="font-medium">Voice sessions</p>
        <p className="text-xs text-muted-foreground">
          {credits.length > 0
            ? `${credits.length} credit${credits.length === 1 ? "" : "s"} · soonest expires ${fmtDate(credits[0]!.expiresAt)}`
            : "No credits. Buy a session or upgrade to Pro."}
        </p>
      </div>
      {credits.length === 0 && (
        <div className="flex gap-2">
          <form action={buyVoiceSession}>
            <Button type="submit" variant="secondary">
              Buy $12
            </Button>
          </form>
          <form action={startSubscription}>
            <input type="hidden" name="tier" value="pro" />
            <input type="hidden" name="interval" value="monthly" />
            <Button type="submit">
              Go Pro
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
