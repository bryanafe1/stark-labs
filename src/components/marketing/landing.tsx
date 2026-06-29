import Link from "next/link";
import {
  Swords,
  BookOpen,
  CheckCircle2,
  Hexagon,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DISCIPLINE_LIST } from "@/lib/constants";
import { LandingNav } from "@/components/marketing/landing-nav";
import { HeroPreview } from "@/components/marketing/hero-preview";
import { SampleLesson } from "@/components/marketing/sample-lesson";
import { Testimonials } from "@/components/marketing/testimonials";
import { Faq } from "@/components/marketing/faq";

// ---------------------------------------------------------------------------
//  Focused marketing page — one tight promise: learn, practice, rank.
// ---------------------------------------------------------------------------

const HERO_STATS = ["Interview-grade prep", "Instant auto-grading", "Mastery tracking"] as const;

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

// The three core benefits — nothing else.
const FEATURES: Feature[] = [
  {
    icon: BookOpen,
    title: "Learn",
    description:
      "Interactive lessons with live formula sandboxes — the concepts that actually show up in technical interviews.",
  },
  {
    icon: CheckCircle2,
    title: "Practice",
    description:
      "Auto-graded problems with instant feedback, worked solutions, and the freedom to retry your mistakes.",
  },
  {
    icon: Swords,
    title: "Rank",
    description:
      "Track your mastery and climb a ranked progression. Measure interview readiness, not screen time.",
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
            Ace the technical interviews standing between you and the offer. Deep
            lessons, auto-graded practice, and realistic AI mock interviews get
            you hired.
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

          <HeroPreview />
        </div>
      </section>

      {/* Core benefits --------------------------------------------------- */}
      <section id="features" className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              One simple path from concept to solve.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Built for engineers who want signal, not fluff.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="bg-card/50 p-6 transition-colors hover:bg-card">
                  <span className="flex size-10 items-center justify-center rounded-md border border-border bg-background">
                    <Icon className="size-5 text-foreground" />
                  </span>
                  <h3 className="mt-4 font-semibold leading-none tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </Card>
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
            {DISCIPLINE_LIST.map((d) => {
              const Icon = d.icon;
              const token = `--d-${d.key.toLowerCase()}`;
              const live = d.status === "live";
              return (
                <div
                  key={d.key}
                  className={cn(
                    "relative flex flex-col items-center gap-2 rounded-lg border px-3 py-4 transition-colors sm:px-4 sm:py-5",
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample lesson, testimonials, FAQ ------------------------------- */}
      <SampleLesson />
      <Testimonials />
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
