"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InterviewConfig, InterviewLevel, InterviewMode } from "@/lib/interview";
import { DISCIPLINE_LIST, DISCIPLINES, SUBJECTS } from "@/lib/constants";
import type { Discipline } from "@prisma/client";

export const GENERAL_FOCUS = "General fundamentals";
const LEVELS: InterviewLevel[] = ["Intern", "New grad", "Experienced"];

/** The full interview configuration, shared by the typed and voice setups. */
export interface InterviewSetup {
  disciplineKey: Discipline;
  interviewMode: InterviewMode;
  focus: string;
  level: InterviewLevel;
  projectContext: string;
  jobDescription: string;
}

export const DEFAULT_INTERVIEW_SETUP: InterviewSetup = {
  disciplineKey: "MECHANICAL",
  interviewMode: "technical",
  focus: GENERAL_FOCUS,
  level: "New grad",
  projectContext: "",
  jobDescription: "",
};

/** Turn the UI setup into the prompt-builder config (used by both API routes). */
export function toInterviewConfig(s: InterviewSetup): InterviewConfig {
  const jd = s.jobDescription.trim();
  return {
    disciplineLabel: DISCIPLINES[s.disciplineKey].label,
    focus: s.focus,
    level: s.level,
    jobDescription: jd || undefined,
    interviewMode: s.interviewMode,
    projectContext:
      s.interviewMode !== "technical" ? s.projectContext.trim() || undefined : undefined,
  };
}

/**
 * The single source of truth for interview configuration UI — Discipline,
 * Interview type, Focus, Level, project context, and job-posting tailoring.
 * Controlled: the parent owns the state and receives partial patches. Used by
 * BOTH the typed Mock Interview and the Voice Interview so they stay identical.
 */
export function InterviewSetupFields({
  value,
  onChange,
}: {
  value: InterviewSetup;
  onChange: (patch: Partial<InterviewSetup>) => void;
}) {
  const focusOptions = useMemo(
    () => [
      GENERAL_FOCUS,
      ...SUBJECTS.filter((s) => s.disciplines.includes(value.disciplineKey)).map((s) => s.label),
    ],
    [value.disciplineKey],
  );
  const jd = value.jobDescription.trim();

  return (
    <div className="space-y-5">
      {/* Discipline — compact chips */}
      <Field label="Discipline">
        <div className="flex flex-wrap gap-1.5">
          {DISCIPLINE_LIST.map((d) => (
            <Pill
              key={d.key}
              active={value.disciplineKey === d.key}
              onClick={() => onChange({ disciplineKey: d.key, focus: GENERAL_FOCUS })}
            >
              {d.label}
            </Pill>
          ))}
        </div>
      </Field>

      {/* Interview type — the real differentiator */}
      <Field label="Interview type">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <ModeCard
            active={value.interviewMode === "technical"}
            onClick={() => onChange({ interviewMode: "technical" })}
            title="Technical"
            desc="Fundamentals & problems under pressure."
          />
          <ModeCard
            active={value.interviewMode === "project"}
            onClick={() => onChange({ interviewMode: "project" })}
            title="Project deep-dive"
            desc="Defend your own design decisions."
          />
          <ModeCard
            active={value.interviewMode === "full"}
            onClick={() => onChange({ interviewMode: "full" })}
            title="Full simulation"
            desc="Intro → project → technical → close."
          />
        </div>
      </Field>

      {(value.interviewMode === "project" || value.interviewMode === "full") && (
        <Field label="Your project (2–3 sentences)">
          <textarea
            value={value.projectContext}
            onChange={(e) => onChange({ projectContext: e.target.value })}
            rows={4}
            placeholder="A capstone, work project, or personal build — what it was, what you designed, the key decisions. The interviewer will grill your reasoning: “why that bearing and not a bushing?”"
            className="w-full rounded-lg border border-input bg-background p-3 text-sm leading-relaxed outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/50"
          />
        </Field>
      )}

      {/* Focus (dropdown) + Level, side by side */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Focus">
          <div className="relative">
            <select
              value={value.focus}
              onChange={(e) => onChange({ focus: e.target.value })}
              className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-9 text-sm outline-none ring-ring transition focus-visible:ring-2"
            >
              {focusOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>

        <Field label="Level">
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <Pill key={l} active={value.level === l} onClick={() => onChange({ level: l })}>
                {l}
              </Pill>
            ))}
          </div>
        </Field>
      </div>

      {/* Job description — optional, collapsed */}
      <details className="group rounded-lg border border-border bg-background/40 px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          Tailor to a specific job posting
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <textarea
          value={value.jobDescription}
          onChange={(e) => onChange({ jobDescription: e.target.value })}
          rows={5}
          placeholder="Paste a job posting and the interviewer tailors its questions to the fundamentals this role needs."
          className="mt-3 w-full rounded-lg border border-input bg-background p-3 text-sm leading-relaxed outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/50"
        />
        {jd && (
          <p className="mt-1.5 text-xs text-primary">
            This interview will be tailored to the pasted role (Focus is ignored).
          </p>
        )}
      </details>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        active ? "border-primary/60 bg-primary/10" : "border-border hover:border-primary/40",
      )}
    >
      <p className={cn("text-sm font-semibold", active ? "text-primary" : "text-foreground")}>
        {title}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
    </button>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-2 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-input text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
