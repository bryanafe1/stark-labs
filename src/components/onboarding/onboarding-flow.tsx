"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Hexagon,
  type LucideIcon,
} from "lucide-react";
import type { Discipline } from "@prisma/client";
import { DISCIPLINE_LIST } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
//  Static option data (local only — nothing is persisted).
// ---------------------------------------------------------------------------

const EXPERIENCE_OPTIONS = [
  { key: "student", label: "Student", hint: "Still in school" },
  { key: "new-grad", label: "New grad", hint: "Just entered industry" },
  { key: "1-3-yrs", label: "1–3 yrs", hint: "Early career" },
  { key: "senior", label: "Senior", hint: "Seasoned engineer" },
] as const;

const GOAL_OPTIONS = [
  { key: "first-role", label: "Land my first role" },
  { key: "switch", label: "Switch companies" },
  { key: "fundamentals", label: "Sharpen fundamentals" },
  { key: "leaderboard", label: "Compete on the leaderboard" },
] as const;

type ExperienceKey = (typeof EXPERIENCE_OPTIONS)[number]["key"];
type GoalKey = (typeof GOAL_OPTIONS)[number]["key"];

const TOTAL_STEPS = 5;

interface OnboardingState {
  disciplines: Discipline[];
  experience: ExperienceKey | null;
  goal: GoalKey | null;
}

// ---------------------------------------------------------------------------
//  Shared presentational primitives.
// ---------------------------------------------------------------------------

function StepHeading({
  step,
  title,
  blurb,
}: {
  step: number;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="space-y-2 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        step {step} / {TOTAL_STEPS}
      </p>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      {blurb ? (
        <p className="mx-auto max-w-md text-sm text-muted-foreground">{blurb}</p>
      ) : null}
    </div>
  );
}

/** Generic selectable card used by experience/goal steps. */
function SelectCard({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-terminal bg-terminal/[0.05]"
          : "border-border hover:border-input hover:bg-accent/40",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
//  Step bodies.
// ---------------------------------------------------------------------------

function WelcomeStep() {
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className="flex items-center gap-2.5">
        <Hexagon className="size-8 text-foreground" strokeWidth={1.75} />
        <span className="text-3xl font-semibold tracking-tight">Stark</span>
      </div>
      <p className="max-w-md text-balance text-base text-muted-foreground">
        Interview-grade engineering practice. Let&apos;s tune Stark to the work
        you actually want to do.
      </p>
    </div>
  );
}

function DisciplineStep({
  selected,
  onToggle,
}: {
  selected: Discipline[];
  onToggle: (key: Discipline) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {DISCIPLINE_LIST.map((d) => {
          const Icon = d.icon as LucideIcon;
          const isOn = selected.includes(d.key);
          const tint = `hsl(var(--d-${d.key.toLowerCase()}))`;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => onToggle(d.key)}
              aria-pressed={isOn}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors sm:p-4",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isOn
                  ? "border-terminal bg-terminal/[0.05]"
                  : "border-border hover:border-input hover:bg-accent/40",
              )}
            >
              {isOn ? (
                <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-terminal text-background">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              ) : null}
              <Icon className="size-6" style={{ color: tint }} strokeWidth={1.75} />
              <span className="text-sm font-medium">{d.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-center font-mono text-xs text-muted-foreground">
        {selected.length} selected
      </p>
    </div>
  );
}

function ExperienceStep({
  value,
  onSelect,
}: {
  value: ExperienceKey | null;
  onSelect: (key: ExperienceKey) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {EXPERIENCE_OPTIONS.map((o) => (
        <SelectCard
          key={o.key}
          selected={value === o.key}
          onClick={() => onSelect(o.key)}
        >
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{o.label}</p>
            <p className="text-xs text-muted-foreground">{o.hint}</p>
          </div>
        </SelectCard>
      ))}
    </div>
  );
}

function GoalStep({
  value,
  onSelect,
}: {
  value: GoalKey | null;
  onSelect: (key: GoalKey) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {GOAL_OPTIONS.map((o) => (
        <SelectCard
          key={o.key}
          selected={value === o.key}
          onClick={() => onSelect(o.key)}
        >
          <span
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
              value === o.key
                ? "border-terminal bg-terminal text-background"
                : "border-input",
            )}
          >
            {value === o.key ? <Check className="size-3" strokeWidth={3} /> : null}
          </span>
          <span className="text-sm font-medium">{o.label}</span>
        </SelectCard>
      ))}
    </div>
  );
}

function DoneStep({ state }: { state: OnboardingState }) {
  const disciplineLabels = DISCIPLINE_LIST.filter((d) =>
    state.disciplines.includes(d.key),
  ).map((d) => d.label);
  const experienceLabel =
    EXPERIENCE_OPTIONS.find((o) => o.key === state.experience)?.label ?? "—";
  const goalLabel = GOAL_OPTIONS.find((o) => o.key === state.goal)?.label ?? "—";

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-terminal/10 text-terminal">
          <Check className="size-6" strokeWidth={2.5} />
        </span>
        <p className="text-sm text-muted-foreground">
          You&apos;re set. Here&apos;s your tuned setup.
        </p>
      </div>

      <dl className="divide-y divide-border rounded-lg border border-border">
        <SummaryRow label="Disciplines" value={disciplineLabels.join(", ") || "—"} />
        <SummaryRow label="Experience" value={experienceLabel} />
        <SummaryRow label="Goal" value={goalLabel} />
      </dl>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 break-words text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  Wizard shell.
// ---------------------------------------------------------------------------

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [state, setState] = React.useState<OnboardingState>({
    disciplines: [],
    experience: null,
    goal: null,
  });

  const toggleDiscipline = React.useCallback((key: Discipline) => {
    setState((s) => ({
      ...s,
      disciplines: s.disciplines.includes(key)
        ? s.disciplines.filter((d) => d !== key)
        : [...s.disciplines, key],
    }));
  }, []);

  const canAdvance = React.useMemo(() => {
    switch (step) {
      case 2:
        return state.disciplines.length >= 1;
      case 3:
        return state.experience !== null;
      case 4:
        return state.goal !== null;
      default:
        return true;
    }
  }, [step, state]);

  const isFirst = step === 1;
  const isLast = step === TOTAL_STEPS;

  const next = () => {
    if (!canAdvance) return;
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));
  const finish = () => router.push("/dashboard");

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="relative z-10 w-full max-w-lg">
      {/* Progress header */}
      <div className="mb-8 space-y-3">
        <Progress value={progress} indicatorClassName="bg-terminal" />
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i + 1 === step
                  ? "w-6 bg-terminal"
                  : i + 1 < step
                    ? "w-1.5 bg-terminal/60"
                    : "w-1.5 bg-border",
              )}
            />
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="glass rounded-xl p-6 sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="space-y-6"
          >
            {step === 1 && (
              <>
                <StepHeading step={1} title="Welcome to Stark" />
                <WelcomeStep />
              </>
            )}
            {step === 2 && (
              <>
                <StepHeading
                  step={2}
                  title="Pick your disciplines"
                  blurb="Choose the engineering tracks you want to train. You can pick more than one."
                />
                <DisciplineStep
                  selected={state.disciplines}
                  onToggle={toggleDiscipline}
                />
              </>
            )}
            {step === 3 && (
              <>
                <StepHeading
                  step={3}
                  title="Where are you at?"
                  blurb="We'll calibrate difficulty to your experience."
                />
                <ExperienceStep
                  value={state.experience}
                  onSelect={(key) =>
                    setState((s) => ({ ...s, experience: key }))
                  }
                />
              </>
            )}
            {step === 4 && (
              <>
                <StepHeading
                  step={4}
                  title="What's the goal?"
                  blurb="We'll point your roadmap at what matters most."
                />
                <GoalStep
                  value={state.goal}
                  onSelect={(key) => setState((s) => ({ ...s, goal: key }))}
                />
              </>
            )}
            {step === 5 && (
              <>
                <StepHeading step={5} title="You're all set" />
                <DoneStep state={state} />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer nav */}
        <div className="mt-8 flex items-center justify-between gap-3">
          {!isFirst ? (
            <Button variant="ghost" onClick={back}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <span aria-hidden />
          )}

          {isLast ? (
            <Button onClick={finish} className="ml-auto">
              Enter Stark
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={next} disabled={!canAdvance} className="ml-auto">
              {isFirst ? "Let's set you up" : "Next"}
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
