"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A muted "[ Reference Sheet ]" toggle that slides out a frosted-glass panel
 * with the governing equations for the current problem. It's a NON-blocking
 * side panel — no full-screen backdrop — so you can keep typing and submit your
 * answer with the sheet open. The point: test whether you can APPLY the
 * equations, not whether you memorized them.
 */
export function ReferenceSheet({ equations }: { equations: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs transition-colors",
          open
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border bg-secondary/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
        )}
      >
        <BookOpen className="size-4" />
        {open ? "[ Close Reference ]" : "[ Reference Sheet ]"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="glass fixed inset-y-0 right-0 z-50 flex w-80 max-w-[88vw] flex-col border-l shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <BookOpen className="size-4 text-primary" />
                Reference Sheet
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close reference sheet"
                className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <p className="mb-4 text-xs text-muted-foreground">
                Governing equations for this problem. The challenge is applying them, not recalling
                them — keep typing your answer with this open.
              </p>
              <ul className="space-y-3">
                {equations.map((eq, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-border bg-background/60 px-3 py-2.5 font-mono text-sm leading-relaxed text-foreground/90 break-words"
                  >
                    {eq}
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
