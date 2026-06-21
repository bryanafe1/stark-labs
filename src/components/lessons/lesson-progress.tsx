"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveLessonBlockDone } from "@/server/actions/lessons";

// ---------------------------------------------------------------------------
//  Lesson XP / progress — the "addicting" loop. Every interactive block
//  (video, predict, check, sandbox, worked example) awards XP when engaged;
//  a floating HUD fills up and celebrates at 100%.
// ---------------------------------------------------------------------------

const XP_PER_BLOCK = 25;

interface Ctx {
  markDone: (id: string) => void;
  doneCount: number;
  total: number;
}

const LessonProgressContext = createContext<Ctx | null>(null);

/** Safe to call outside a provider (no-op) so blocks work standalone. */
export function useLessonProgress(): Pick<Ctx, "markDone"> {
  const ctx = useContext(LessonProgressContext);
  return { markDone: ctx?.markDone ?? (() => {}) };
}

export function LessonProgressProvider({
  total,
  slug,
  initialDone,
  children,
}: {
  total: number;
  /** Lesson slug — used to persist progress for resume. */
  slug?: string;
  /** Block ids already completed (from the DB) — pre-fills the HUD on load. */
  initialDone?: string[];
  children: React.ReactNode;
}) {
  const [done, setDone] = useState<Set<string>>(() => new Set(initialDone ?? []));
  // Mirror of what we've already persisted, so we never double-write.
  const savedRef = useRef<Set<string>>(new Set(initialDone ?? []));

  const markDone = useCallback(
    (id: string) => {
      setDone((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
      if (slug && !savedRef.current.has(id)) {
        savedRef.current.add(id);
        void saveLessonBlockDone(slug, id);
      }
    },
    [slug],
  );

  const value = useMemo(
    () => ({ markDone, doneCount: done.size, total }),
    [markDone, done.size, total],
  );

  return (
    <LessonProgressContext.Provider value={value}>
      {children}
      {total > 0 && <ProgressHud doneCount={done.size} total={total} />}
    </LessonProgressContext.Provider>
  );
}

function ProgressHud({ doneCount, total }: { doneCount: number; total: number }) {
  const pct = Math.round((doneCount / total) * 100);
  const xp = doneCount * XP_PER_BLOCK;
  const complete = doneCount >= total;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
    >
      <div
        className={cn(
          "glass pointer-events-auto flex items-center gap-3 rounded-full border px-4 py-2 shadow-lg transition-colors",
          complete ? "border-terminal/50" : "border-border",
        )}
      >
        <AnimatePresence mode="wait">
          {complete ? (
            <motion.span
              key="done"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 font-mono text-sm font-semibold text-terminal"
            >
              <Trophy className="size-4" />
              Lesson mastered · +{xp} XP
            </motion.span>
          ) : (
            <motion.div
              key="prog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <Sparkles className="size-4 text-terminal" />
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-terminal"
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                />
              </div>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {doneCount}/{total} · {xp} XP
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
