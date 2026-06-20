"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import type { Discipline } from "@prisma/client";
import { DISCIPLINES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SkillNodeCard } from "@/components/skills/skill-node-card";
import type { SkillNode, SkillTreeViewModel } from "@/features/skills/get-skill-tree";

function NodeGroup({ label, nodes }: { label: string; nodes: SkillNode[] }) {
  if (nodes.length === 0) return null;
  return (
    <div className="space-y-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="space-y-2">
        {nodes.map((node) => (
          <SkillNodeCard key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

export function SkillTree({ data }: { data: SkillTreeViewModel }) {
  const [open, setOpen] = useState<Discipline | null>(
    data.tracks[0]?.discipline ?? null,
  );

  return (
    <div className="space-y-3">
      {data.tracks.map((track) => {
        const meta = DISCIPLINES[track.discipline];
        const Icon = meta.icon;
        const isOpen = open === track.discipline;
        const mastered = track.nodes.filter((n) => n.status === "MASTERED").length;
        const pct = track.nodes.length
          ? Math.round((mastered / track.nodes.length) * 100)
          : 0;
        const subjects = track.nodes.filter((n) => n.kind === "SUBJECT");
        const technical = track.nodes.filter((n) => n.kind === "TECHNICAL");

        return (
          <div
            key={track.discipline}
            className="elevated overflow-hidden rounded-xl border border-border bg-card"
          >
            {/* Header — the dropdown trigger */}
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : track.discipline)}
              aria-expanded={isOpen}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40",
                isOpen && "bg-accent/30",
              )}
            >
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `hsl(var(--d-${track.discipline.toLowerCase()}) / 0.14)`,
                  color: `hsl(var(--d-${track.discipline.toLowerCase()}))`,
                }}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{meta.label}</span>
                <span className="block font-mono text-xs text-muted-foreground">
                  {mastered}/{track.nodes.length} mastered · {pct}%
                </span>
              </span>
              {/* Mastery bar */}
              <div className="hidden h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-secondary sm:block">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {/* Revealed skills */}
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
                  <div className="border-t border-border p-4">
                    <div className="mb-3 flex justify-end">
                      <Link
                        href={`/practice?discipline=${track.discipline}`}
                        className="inline-flex items-center gap-1 font-mono text-xs font-medium text-primary hover:underline"
                      >
                        Practice all {meta.label} <ArrowRight className="size-3" />
                      </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <NodeGroup label="Subjects" nodes={subjects} />
                      <NodeGroup label="Technical" nodes={technical} />
                    </div>
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
