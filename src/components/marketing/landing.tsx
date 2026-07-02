import Link from "next/link";
import {
  Swords,
  Mic,
  MessageSquare,
  Sparkles,
  Hexagon,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DISCIPLINE_LIST } from "@/lib/constants";
import { LandingNav } from "@/components/marketing/landing-nav";
import { ModeShowcase } from "@/components/marketing/mode-showcase";
import { Reveal } from "@/components/marketing/reveal";
import { SampleLesson } from "@/components/marketing/sample-lesson";
import { Faq } from "@/components/marketing/faq";

// ---------------------------------------------------------------------------
//  Focused marketing page — one tight promise: learn, practice, rank.
// ---------------------------------------------------------------------------

const HERO_STATS = ["Live voice interviews", "Ranked arena", "Start free"] as const;

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Why Overclocker over a pile of practice problems — the differentiators.
const PILLARS: Feature[] = [
  {
    icon: Mic,
    title: "A real interviewer — not a question bank",
    description:
      "Talk through problems with a live AI interviewer that asks follow-ups and tells you how you came across: your pace, filler words, and confidence. Not a recording you submit and forget.",
  },
  {
    icon: Swords,
    title: "A ranked, competitive arena",
    description:
      "Timed, Elo-ranked sprints against the clock. Build the speed and composure real interviews test — the way no flashcard deck ever could.",
  },
  {
    icon: MessageSquare,
    title: "Feedback that coaches you",
    description:
      "Every answer comes back with what you did well and what to fix — plus a skill profile. Like a hiring manager, not a red X.",
  },
  {
    icon: Sparkles,
    title: "Start free. Go deep for less.",
    description:
      "A real free tier — not a trial — then plans priced below the alternatives. Cancel anytime.",
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      {/* Hero ------------------------------------------------------------ */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-terminal" />
            engineering interview prep
          </span>

          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Land the six-figure engineering job.
          </h1>

          <p className="mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
            The complete interview simulator for hardware engineers — learn the
            concepts, drill them in a ranked arena, and rehearse the real thing
            with a live AI interviewer until you walk in ready.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/sign-up">
                Get started
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/learn">Browse lessons</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
            {HERO_STATS.map((stat, i) => (
              <span key={stat} className="flex items-center gap-3">
                {i > 0 && <span className="text-border">·</span>}
                <span>{stat}</span>
              </span>
            ))}
          </div>

          <ModeShowcase />
        </div>
      </section>

      {/* Core benefits --------------------------------------------------- */}
      <section id="features" className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              More than a bigger pile of problems.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Most tools hand you practice questions. Overclocker is the interview
              itself — rehearsed, ranked, and coached.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PILLARS.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.08}>
                  <Card className="group h-full bg-card/50 p-6 transition-colors hover:border-primary/30 hover:bg-card">
                    <span className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-semibold leading-none tracking-tight">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Launch focus: one discipline deep, the rest coming soon ---------- */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Launching with Mechanical Engineering
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Built deep first. The rest of the disciplines are coming — same
              lessons, same instant grading.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {DISCIPLINE_LIST.map((d, i) => {
              const Icon = d.icon;
              const token = `--d-${d.key.toLowerCase()}`;
              const live = d.status === "live";
              return (
                <Reveal key={d.key} delay={i * 0.04} className="h-full">
                  <div
                    className={cn(
                      "relative flex h-full flex-col items-center gap-2 rounded-lg border px-3 py-4 transition-all hover:-translate-y-0.5 sm:px-4 sm:py-5",
                      live ? "border-primary/40 bg-card" : "border-border bg-card/30 opacity-60",
                    )}
                  >
                  {!live && (
                    <span className="absolute right-2 top-2 rounded-full border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                      Soon
                    </span>
                  )}
                  <span
                    className="flex size-10 items-center justify-center rounded-md"
                    style={{
                      backgroundColor: `hsl(var(${token}) / 0.12)`,
                      color: `hsl(var(${token}))`,
                    }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-medium">{d.label}</span>
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-wider",
                      live ? "text-terminal" : "text-muted-foreground",
                    )}
                  >
                    {live ? "Live now" : d.short}
                  </span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample lesson, testimonials, FAQ ------------------------------- */}
      <SampleLesson />
      <Faq />

      {/* About / contact ------------------------------------------------- */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Built by engineers, for engineers
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Technical interviews test the fundamentals you forget six months out of a textbook, and
            cramming formulas the night before doesn&apos;t work. Overclocker turns the concepts
            interviewers actually probe into deep, interactive lessons and realistic practice.
          </p>
          <p className="mt-4 font-mono text-sm text-muted-foreground">
            Questions?{" "}
            <a className="text-primary hover:underline" href="mailto:support@overclocker.dev">
              support@overclocker.dev
            </a>
          </p>
        </div>
      </section>

      {/* Final CTA ------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="relative mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Ready to engineer your edge?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">
            Start with the free lessons — no credit card required.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/sign-up">
                Get started
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer ---------------------------------------------------------- */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Hexagon className="size-5 text-foreground" strokeWidth={1.75} />
            <span className="font-mono text-sm font-semibold tracking-tight">OVERCLOCK_</span>
          </Link>
          <div className="flex items-center gap-5 font-mono text-xs text-muted-foreground">
            <Link href="#features" className="hover:text-foreground">
              Features
            </Link>
            <Link href="#faq" className="hover:text-foreground">
              FAQ
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <a href="mailto:support@overclocker.dev" className="hover:text-foreground">
              Contact
            </a>
            <Link href="/sign-in" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
          <p className="font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} Overclocker</p>
        </div>
      </footer>
    </div>
  );
}
