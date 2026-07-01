import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  ClipboardCheck,
  MessageSquare,
  Swords,
  Network,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { getDashboard } from "@/features/dashboard/get-dashboard";
import { getCurrentUserId } from "@/lib/auth";
import { getReadiness } from "@/lib/readiness";
import { ReadinessCard } from "@/components/dashboard/readiness-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MotionStagger, MotionItem } from "@/components/motion/motion-primitives";
import { DISCIPLINES } from "@/lib/constants";

export const metadata: Metadata = { title: "Home" };

const MODULES = [
  { href: "/learn", icon: GraduationCap, title: "Learn", desc: "Interactive lessons with live formula sandboxes." },
  { href: "/practice", icon: ClipboardCheck, title: "Practice", desc: "Auto-graded, interview-grade problems." },
  { href: "/interview", icon: MessageSquare, title: "Mock Interview", desc: "Spar with an AI interviewer, get feedback." },
  { href: "/arena", icon: Swords, title: "Arena", desc: "Timed ranked sprints to test your speed." },
  { href: "/skills", icon: Network, title: "Progress", desc: "Track mastery across every discipline." },
] as const;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { upgraded?: string; voice?: string };
}) {
  const data = await getDashboard();
  const userId = await getCurrentUserId();
  const readiness = userId ? await getReadiness(userId) : null;
  const first = (data.user.displayName || "there").split(" ")[0];
  const started = data.disciplines.some((d) => d.masteredNodes > 0);
  const topDisciplines = [...data.disciplines]
    .filter((d) => d.totalNodes > 0)
    .sort((a, b) => b.masteryPct - a.masteryPct)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {(searchParams.upgraded || searchParams.voice) && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          {searchParams.voice
            ? "Voice session added — you're ready to go."
            : "You're all set — your plan is active. Welcome aboard."}
        </div>
      )}

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {started ? `Welcome back, ${first}` : `Welcome, ${first} 👋`}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {started
            ? "Pick up where you left off."
            : "Let's get you interview-ready. Start with a lesson or jump straight into practice."}
        </p>
      </div>

      {readiness && <ReadinessCard readiness={readiness} />}

      {/* Primary call-to-action band */}
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold">
              {started ? "Keep your momentum going" : "Start your first session"}
            </p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Launching with Mechanical Engineering: deep lessons, auto-graded practice, and a mock interview.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/learn">
                Start learning <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/practice">Practice problems</Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <MotionStagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {data.stats.map((s) => (
          <MotionItem key={s.label}>
            <StatCard stat={s} />
          </MotionItem>
        ))}
      </MotionStagger>

      {/* Launchpad */}
      <section>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">Jump in</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.href} href={m.href} className="group">
                <Card className="flex h-full items-start gap-3 p-4 transition-colors hover:border-primary/40">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold group-hover:text-primary">{m.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Progress snapshot */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Your progress</h2>
          <Link href="/skills" className="text-xs font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        {started ? (
          <Card className="divide-y divide-border">
            {topDisciplines.map((d) => {
              const meta = DISCIPLINES[d.discipline];
              const Icon = meta.icon;
              const token = `--d-${d.discipline.toLowerCase()}`;
              return (
                <div key={d.discipline} className="flex items-center gap-3 p-4">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `hsl(var(${token}) / 0.14)`, color: `hsl(var(${token}))` }}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="w-28 shrink-0 truncate text-sm font-medium sm:w-36">{meta.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${d.masteryPct}%` }} />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
                    {d.masteryPct}%
                  </span>
                </div>
              );
            })}
          </Card>
        ) : (
          <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
              <Network className="size-5" />
            </span>
            <p className="text-sm font-semibold">No progress yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Solve your first problem or finish a lesson, and your mastery will show up here.
            </p>
            <Button asChild size="sm">
              <Link href="/practice">Start practicing</Link>
            </Button>
          </Card>
        )}
      </section>
    </div>
  );
}
