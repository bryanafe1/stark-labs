import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, Calendar, ShieldCheck, Sparkles, ExternalLink, LogOut } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { signOut } from "@/auth";
import { openBillingPortal } from "@/server/actions/billing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/settings/profile-form";
import { DeleteAccount } from "@/components/settings/danger-zone";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/sign-in");

  const active = user.subscriptionStatus === "active";
  const isPass = active && user.subscriptionTier === "pass";
  const accessUntil = user.currentPeriodEnd
    ? new Date(user.currentPeriodEnd).toLocaleDateString()
    : null;
  const plan =
    user.role === "ADMIN"
      ? { label: "Admin", note: "Full access, no billing.", tone: "primary" as const }
      : isPass
        ? { label: "Season Pass", note: "One-time pass. Everything unlocked.", tone: "primary" as const }
        : active
          ? { label: "Pro", note: "Everything unlocked.", tone: "primary" as const }
          : { label: "Free", note: "Easy Mechanical content only.", tone: "muted" as const };

  const joined = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account, profile, and billing.</p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your sign-in details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row icon={Mail} label="Email">
            <span className="min-w-0 break-all text-right font-medium">{user.email}</span>
          </Row>
          <Row icon={ShieldCheck} label="Sign-in method">
            <span className="inline-flex items-center gap-1.5">
              <GoogleG /> Google
            </span>
          </Row>
          <Row icon={Calendar} label="Member since">
            <span>{joined}</span>
          </Row>
          <Row icon={Sparkles} label="Plan">
            <span
              className={
                plan.tone === "primary"
                  ? "rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary"
                  : "rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground"
              }
            >
              {plan.label}
            </span>
          </Row>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>How you appear across Stark.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initial={{
              displayName: user.displayName ?? user.name ?? "",
              username: user.username,
              bio: user.bio ?? "",
            }}
          />
        </CardContent>
      </Card>

      {/* Billing */}
      <Card>
        <CardHeader>
          <CardTitle>Billing &amp; plan</CardTitle>
          <CardDescription>{plan.note}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {user.role === "ADMIN" ? (
            <span className="text-sm text-muted-foreground">
              You have admin access. Billing doesn&apos;t apply to your account.
            </span>
          ) : isPass ? (
            <span className="text-sm text-muted-foreground">
              Season Pass active{accessUntil ? ` through ${accessUntil}` : ""}. It won&apos;t auto-renew.
            </span>
          ) : active ? (
            <form action={openBillingPortal}>
              <Button type="submit" variant="secondary">
                Manage subscription
              </Button>
            </form>
          ) : (
            <Button asChild>
              <Link href="/pricing">Upgrade to Pro</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Sign-in &amp; security</CardTitle>
          <CardDescription>Your login is managed by Google — there&apos;s no separate password.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <Button asChild variant="secondary">
            <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer">
              Manage Google security <ExternalLink className="size-4" />
            </a>
          </Button>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="ghost" className="gap-2">
              <LogOut className="size-4" /> Sign out
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Permanently delete your account and all your data.</CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccount />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </span>
      {children}
    </div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
