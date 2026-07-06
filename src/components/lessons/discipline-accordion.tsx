"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { DISCIPLINES } from "@/lib/constants";
import { LessonCard } from "@/components/lessons/lesson-card";
import { cn } from "@/lib/utils";
import type { Discipline } from "@prisma/client";
import type { LessonSummary } from "@/types/lessons";

export type DisciplineGroup = {
  key: Discipline;
  label: string;
  lessons: LessonSummary[];
};

export function DisciplineAccordion({
  groups,
  defaultOpen,
  progress,
}: {
  groups: DisciplineGroup[];
  defaultOpen?: Discipline;
  /** slug → number of interactive blocks completed by the user. */
  progress?: Record<string, number>;
}) {
  const [open, setOpen] = useState<Discipline | null>(defaultOpen ?? null);

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const meta = DISCIPLINES[group.key];
        const Icon = meta.icon;
        const isOpen = open === group.key;
        const tint = `hsl(var(--d-${group.key.toLowerCase()}))`;

        return (
          <div
            key={group.key}
            className="elevated overflow-hidden rounded-xl border border-border bg-card"
          >
            {/* Header row — the dropdown trigger */}
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : group.key)}
              aria-expanded={isOpen}
              className={cn(
                "flex min-h-[44px] w-full items-center gap-3 px-4 py-3 text-left transition-colors sm:py-4",
                "hover:bg-accent/40",
                isOpen && "bg-accent/30",
              )}
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `hsl(var(--d-${group.key.toLowerCase()}) / 0.14)`,
                  color: tint,
                }}
              >
                <Icon className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{meta.label}</span>
                <span className="block font-mono text-xs text-muted-foreground">
                  {group.lessons.length} lesson{group.lessons.length === 1 ? "" : "s"}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {/* Revealed lessons */}
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
                  <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        completedCount={progress?.[lesson.slug] ?? 0}
                      />
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
