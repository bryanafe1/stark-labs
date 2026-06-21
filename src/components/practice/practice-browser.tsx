"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Wrench, Search, ChevronLeft, ChevronDown, ArrowRight, X } from "lucide-react";
import type { Discipline, Difficulty } from "@prisma/client";
import { ProblemCard } from "@/components/practice/problem-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  DISCIPLINE_LIST,
  DISCIPLINES,
  DIFFICULTIES,
  SKILL_AREAS,
  SUBJECTS,
  skillAreasForDiscipline,
  disciplineColor,
  disciplineTint,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PracticeProblem } from "@/features/practice/types";

type DiscFilter = Discipline | "ALL";
type DiffFilter = Difficulty | "ALL";

const DIFFICULTY_ORDER: Difficulty[] = [
  "INTRODUCTORY",
  "EASY",
  "MEDIUM",
  "HARD",
  "EXPERT",
];
// Solid segment colors for the difficulty distribution bars.
const DIFF_BAR: Record<Difficulty, string> = {
  INTRODUCTORY: "bg-sky-500",
  EASY: "bg-emerald-500",
  MEDIUM: "bg-amber-500",
  HARD: "bg-orange-500",
  EXPERT: "bg-rose-500",
};

const SKILL_LABEL = new Map(SKILL_AREAS.map((s) => [s.slug, s.label]));
const SUBJECT_SLUGS = new Set(SUBJECTS.map((s) => s.slug));

/** A problem's primary subject group: first SUBJECT skill area, else first tag area. */
function primarySubject(p: PracticeProblem): string {
  const areas = p.skillAreas ?? [];
  return areas.find((s) => SUBJECT_SLUGS.has(s)) ?? areas[0] ?? "general";
}

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
  const [difficulty, setDifficulty] = useState<DiffFilter>("ALL");
  const [query, setQuery] = useState("");

  const selectDiscipline = (d: DiscFilter) => {
    setDiscipline(d);
    setSkill("ALL");
  };

  const q = query.trim().toLowerCase();
  const filtersActive = discipline !== "ALL" || skill !== "ALL" || difficulty !== "ALL" || q !== "";

  // Apply every active filter.
  const filtered = useMemo(
    () =>
      problems.filter(
        (p) =>
          (discipline === "ALL" || p.discipline === discipline) &&
          (skill === "ALL" || p.skillAreas?.includes(skill)) &&
          (difficulty === "ALL" || p.difficulty === difficulty) &&
          (q === "" ||
            p.title.toLowerCase().includes(q) ||
            p.prompt.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))),
      ),
    [problems, discipline, skill, difficulty, q],
  );

  // Skill chips for the selected discipline.
  const { subjects, technical } = useMemo(() => {
    if (discipline === "ALL") return { subjects: [], technical: [] };
    const areas = skillAreasForDiscipline(discipline);
    return {
      subjects: areas.filter((a) => a.kind === "SUBJECT"),
      technical: areas.filter((a) => a.kind === "TECHNICAL"),
    };
  }, [discipline]);

  // Per-discipline counts for the overview cards.
  const overview = useMemo(() => {
    return DISCIPLINE_LIST.map((d) => {
      const items = problems.filter((p) => p.discipline === d.key);
      const byDiff = DIFFICULTY_ORDER.map((diff) => ({
        diff,
        n: items.filter((p) => p.difficulty === diff).length,
      })).filter((x) => x.n > 0);
      return { meta: d, total: items.length, byDiff };
    }).filter((g) => g.total > 0);
  }, [problems]);

  const showOverview = !filtersActive;

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search problems by title, keyword, or tag…"
          className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-9 text-sm outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/60"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Difficulty filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">level</span>
        <FilterPill active={difficulty === "ALL"} onClick={() => setDifficulty("ALL")}>
          All
        </FilterPill>
        {DIFFICULTY_ORDER.map((d) => (
          <FilterPill key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
            {DIFFICULTIES[d].label}
          </FilterPill>
        ))}
      </div>

      {/* Skill filter — only once a discipline is chosen */}
      {discipline !== "ALL" && (subjects.length > 0 || technical.length > 0) && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">skill</span>
            <FilterPill active={skill === "ALL"} onClick={() => setSkill("ALL")}>
              All
            </FilterPill>
          </div>
          {subjects.length > 0 && (
            <SkillRow icon={BookOpen} label="subjects">
              {subjects.map((s) => (
                <FilterPill key={s.slug} active={skill === s.slug} onClick={() => setSkill(s.slug)}>
                  {s.label}
                </FilterPill>
              ))}
            </SkillRow>
          )}
          {technical.length > 0 && (
            <SkillRow icon={Wrench} label="technical">
              {technical.map((s) => (
                <FilterPill key={s.slug} active={skill === s.slug} onClick={() => setSkill(s.slug)}>
                  {s.label}
                </FilterPill>
              ))}
            </SkillRow>
          )}
        </div>
      )}

      {/* ---- OVERVIEW: discipline cards (default, nothing filtered) ---- */}
      {showOverview ? (
        <div>
          <p className="mb-3 font-mono text-sm text-muted-foreground">
            {problems.length} problems · {overview.length} disciplines — pick one to dive in
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {overview.map(({ meta, total, byDiff }) => {
              const Icon = meta.icon;
              return (
                <button
                  key={meta.key}
                  type="button"
                  onClick={() => selectDiscipline(meta.key)}
                  className="group elevated rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: disciplineTint(meta.key), color: disciplineColor(meta.key) }}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{meta.label}</p>
                      <p className="font-mono text-xs text-muted-foreground">{total} problems</p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  {/* difficulty distribution */}
                  <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-secondary">
                    {byDiff.map(({ diff, n }) => (
                      <div
                        key={diff}
                        className={DIFF_BAR[diff]}
                        style={{ width: `${(n / total) * 100}%` }}
                        title={`${n} ${DIFFICULTIES[diff].label}`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* ---- RESULTS: grouped ---- */
        <Results
          problems={filtered}
          discipline={discipline}
          skill={skill}
          onBack={() => selectDiscipline("ALL")}
          onClear={() => {
            selectDiscipline("ALL");
            setDifficulty("ALL");
            setQuery("");
          }}
        />
      )}
    </div>
  );
}

/** Grouped results: by subject when a discipline is selected, else by discipline. */
function Results({
  problems,
  discipline,
  skill,
  onBack,
  onClear,
}: {
  problems: PracticeProblem[];
  discipline: DiscFilter;
  skill: string;
  onBack: () => void;
  onClear: () => void;
}) {
  const groups = useMemo(() => {
    if (discipline !== "ALL") {
      const order = skillAreasForDiscipline(discipline).map((s) => s.slug);
      const map = new Map<string, PracticeProblem[]>();
      for (const p of problems) {
        const k = primarySubject(p);
        (map.get(k) ?? map.set(k, []).get(k)!).push(p);
      }
      const keys = [...map.keys()].sort(
        (a, b) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999),
      );
      return keys.map((k) => ({
        key: k,
        label: SKILL_LABEL.get(k) ?? "Other",
        items: map.get(k)!,
      }));
    }
    // group by discipline
    const order = DISCIPLINE_LIST.map((d) => d.key);
    const map = new Map<string, PracticeProblem[]>();
    for (const p of problems) {
      (map.get(p.discipline) ?? map.set(p.discipline, []).get(p.discipline)!).push(p);
    }
    return [...map.keys()]
      .sort((a, b) => order.indexOf(a as Discipline) - order.indexOf(b as Discipline))
      .map((k) => ({ key: k, label: DISCIPLINES[k as Discipline].label, items: map.get(k)! }));
  }, [problems, discipline]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> All disciplines
        </button>
        <span className="font-mono text-sm text-muted-foreground">
          {problems.length} {problems.length === 1 ? "problem" : "problems"}
        </span>
      </div>

      {problems.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No problems match these filters"
          description="Try a different subject, level, or search term."
          action={
            <Button variant="secondary" size="sm" onClick={onClear}>
              Clear filters
            </Button>
          }
        />
      ) : discipline !== "ALL" && skill !== "ALL" ? (
        /* A specific subject/skill is selected — show a flat list, not the
           subject accordion (grouping by primary subject would scatter these
           across sibling headers, which is confusing). */
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">{SKILL_LABEL.get(skill) ?? "Results"}</h2>
            <span className="font-mono text-xs text-muted-foreground">{problems.length}</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {problems.map((p) => (
              <ProblemCard key={p.id} problem={p} />
            ))}
          </div>
        </section>
      ) : discipline !== "ALL" ? (
        <SubjectAccordion key={discipline} groups={groups} />
      ) : (
        groups.map((g) => (
          <section key={g.key} className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">{g.label}</h2>
              <span className="font-mono text-xs text-muted-foreground">{g.items.length}</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {g.items.map((p) => (
                <ProblemCard key={p.id} problem={p} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

/** Subjects within a discipline, each a collapsible dropdown. */
function SubjectAccordion({
  groups,
}: {
  groups: { key: string; label: string; items: PracticeProblem[] }[];
}) {
  const [open, setOpen] = useState<string | null>(null); // all subjects collapsed by default

  return (
    <div className="space-y-3">
      {groups.map((g) => {
        const isOpen = g.key === open;
        const byDiff = DIFFICULTY_ORDER.map((diff) => ({
          diff,
          n: g.items.filter((p) => p.difficulty === diff).length,
        })).filter((x) => x.n > 0);

        return (
          <div key={g.key} className="elevated overflow-hidden rounded-xl border border-border bg-card">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : g.key)}
              aria-expanded={isOpen}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40",
                isOpen && "bg-accent/30",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{g.label}</span>
                <span className="block font-mono text-xs text-muted-foreground">
                  {g.items.length} problem{g.items.length === 1 ? "" : "s"}
                </span>
              </span>
              <div className="hidden h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-secondary sm:flex">
                {byDiff.map(({ diff, n }) => (
                  <div
                    key={diff}
                    className={DIFF_BAR[diff]}
                    style={{ width: `${(n / g.items.length) * 100}%` }}
                    title={`${n} ${DIFFICULTIES[diff].label}`}
                  />
                ))}
              </div>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2">
                    {g.items.map((p) => (
                      <ProblemCard key={p.id} problem={p} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
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
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-input text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
