"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Sparkles, AlertTriangle, Timer } from "lucide-react";
import { submitPracticeAnswer } from "@/server/actions/practice";
import {
  INITIAL_PRACTICE_STATE,
  type PracticeFormState,
} from "@/types/practice";
import { Button } from "@/components/ui/button";
import { AnswerInput } from "@/components/practice/answer-input";
import { cn } from "@/lib/utils";
import type { PracticeProblem } from "@/features/practice/problems";

export function ProblemWorkspace({ problem }: { problem: PracticeProblem }) {
  const [state, formAction] = useFormState<PracticeFormState, FormData>(
    submitPracticeAnswer,
    INITIAL_PRACTICE_STATE,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="slug" value={problem.slug} />
      <ElapsedField />

      <AnswerInput problem={problem} />

      <div className="flex items-center gap-3">
        <SubmitButton />
        <ResetButton />
      </div>

      <AnimatePresence mode="wait">
        {state.status !== "idle" && <ResultPanel key={state.status + (state.feedback ?? "")} state={state} />}
      </AnimatePresence>
    </form>
  );
}

/** Tracks solve time and submits it as a hidden field for sprint scoring. */
function ElapsedField() {
  const startRef = useRef<number>(Date.now());
  const [ms, setMs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setMs(Date.now() - startRef.current), 1000);
    return () => clearInterval(id);
  }, []);
  const seconds = Math.floor(ms / 1000);
  return (
    <>
      <input type="hidden" name="timeMs" value={ms} readOnly />
      <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <Timer className="size-3.5" />
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")} elapsed
      </p>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Grading…" : "Submit"}
    </Button>
  );
}

function ResetButton() {
  return (
    <Button type="reset" variant="ghost">
      Clear
    </Button>
  );
}

function ResultPanel({ state }: { state: PracticeFormState }) {
  // Color is reserved strictly for feedback: green = correct, red = incorrect.
  // Everything else (grading / partial / error) stays monochrome.
  const config = {
    CORRECT: { Icon: CheckCircle2, cls: "border-success/40 text-success", spin: false },
    INCORRECT: { Icon: XCircle, cls: "border-destructive/40 text-destructive", spin: false },
    GRADING: { Icon: Loader2, cls: "border-border text-muted-foreground", spin: true },
    PARTIAL: { Icon: Sparkles, cls: "border-border text-foreground", spin: false },
    error: { Icon: AlertTriangle, cls: "border-border text-muted-foreground", spin: false },
    idle: { Icon: Sparkles, cls: "border-border", spin: false },
  }[state.status];

  const { Icon, cls, spin } = config;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className={cn("glass flex items-start gap-3 rounded-lg border p-4", cls)}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", spin && "animate-spin")} />
      <div>
        <p className="text-sm font-semibold">
          {state.status === "CORRECT" && "Correct"}
          {state.status === "INCORRECT" && "Incorrect"}
          {state.status === "GRADING" && "Submitted for AI grading"}
          {state.status === "PARTIAL" && "Partial credit"}
          {state.status === "error" && "Couldn't grade"}
          {typeof state.score === "number" && state.status !== "error" && (
            <span className="ml-2 font-mono font-normal opacity-80">{state.score}/100</span>
          )}
        </p>
        {state.feedback && <p className="mt-0.5 text-sm text-foreground/80">{state.feedback}</p>}
      </div>
    </motion.div>
  );
}
