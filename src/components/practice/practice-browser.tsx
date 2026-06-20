"use client";

import { useMemo, useState } from "react";
import { BookOpen, Wrench, SearchX } from "lucide-react";
import type { Discipline } from "@prisma/client";
import { ProblemCard } from "@/components/practice/problem-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  DISCIPLINE_LIST,
  TECHNICAL_SKILLS,
  skillAreasForDiscipline,
  disciplineColor,
  disciplineTint,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PracticeProblem } from "@/features/practice/types";

type DiscFilter = Discipline | "ALL";

export function PracticeBrowser({
  problems,
  initialDiscipline = "ALL",
  initialSkill = "ALL",
}: {
  problems: PracticeProblem[];
  initialDiscipline?: DiscFilter;
  initialSkill?: string;
}) {
  const [discipline, setDiscipline] = useState<DiscFilter>(initialDiscipline);
  const [skill, setSkill] = useState<string>(initialSkill);

  const selectDiscipline = (d: DiscFilter) => {
    setDiscipline(d);
    setSkill("ALL"); // reset skill when the discipline changes
  };

  const filtered = useMemo(
    () =>
      problems.filter(
        (p) =>
          (discipline === "ALL" || p.discipline === discipline) &&
          (skill === "ALL" || p.skillAreas?.includes(skill)),
      ),
    [problems, discipline, skill],
  );

  // Skill chips: for a chosen discipline show its subjects + technical; for ALL
  // show the cross-cutting technical skills (subjects are discipline-specific).
  const { subjects, technical } = useMemo(() => {
    if (discipline === "ALL") return { subjects: [], technical: TECHNICAL_SKILLS };
    const areas = skillAreasForDiscipline(discipline);
    return {
      subjects: areas.filter((a) => a.kind === "SUBJECT"),
      technical: areas.filter((a) => a.kind === "TECHNICAL"),
    };
  }, [discipline]);

  return (
    <div className="space-y-5">
      {/* Discipline filter */}
      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
          discipline
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterPill active={discipline === "ALL"} onClick={() => selectDiscipline("ALL")}>
            All
          </FilterPill>
          {DISCIPLINE_LIST.map((d) => {
            const Icon = d.icon;
            const active = discipline === d.key;
            return (
              <FilterPill
                key={d.key}
                active={active}
                onClick={() => selectDiscipline(d.key)}
                style={
                  active
                    ? { backgroundColor: disciplineTint(d.key, 0.14), color: disciplineColor(d.key), borderColor: disciplineColor(d.key) }
                    : undefined
                }
              >
                <Icon className="size-3.5" />
                {d.label}
              </FilterPill>
            );
          })}
        </div>
      </div>

      {/* Skill filter */}
      <div>
        <p className="mb-2 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground">
          skill
          <FilterPill active={skill === "ALL"} onClick={() => setSkill("ALL")} className="ml-1 normal-case">
            All
          </FilterPill>
        </p>
        <div className="space-y-2">
          {subjects.length > 0 && (
            <SkillRow icon={BookOpen} label="subjects">
              {subjects.map((s) => (
                <FilterPill key={s.slug} active={skill === s.slug} onClick={() => setSkill(s.slug)}>
                  {s.label}
                </FilterPill>
              ))}
            </SkillRow>
          )}
          <SkillRow icon={Wrench} label="technical">
            {technical.map((s) => (
              <FilterPill key={s.slug} active={skill === s.slug} onClick={() => setSkill(s.slug)}>
                {s.label}
              </FilterPill>
            ))}
          </SkillRow>
          {discipline === "ALL" && (
            <p className="font-mono text-xs text-muted-foreground/70">
              pick a discipline to filter by subject (thermo, fluids, materials…)
            </p>
          )}
        </div>
      </div>

      <p className="font-mono text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "problem" : "problems"}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No problems match this filter yet"
          description="Try a different subject or discipline — more problems are added regularly."
          action={
            <Button variant="secondary" size="sm" onClick={() => selectDiscipline("ALL")}>
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}

function SkillRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof BookOpen;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start gap-2">
      <span className="mt-1.5 flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground/70">
        <Icon className="size-3" />
        {label}
      </span>
      {children}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  className,
  style,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-input text-muted-foreground hover:border-foreground/30 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}
