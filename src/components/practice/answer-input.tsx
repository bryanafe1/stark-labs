import { Sparkles, ChevronRight } from "lucide-react";
import type { EvaluationMode } from "@prisma/client";
import { cn } from "@/lib/utils";

/** Minimal shape both PracticeProblem and SanitizedProblem satisfy. */
export interface AnswerInputProblem {
  evaluationMode: EvaluationMode;
  unit?: string | null;
  choices?: { id: string; label: string }[] | null;
}

/**
 * Renders the answer control for a problem's evaluation mode. Numeric / text
 * inputs are styled as a terminal command line — mono type, green caret, a
 * glowing focus border. Shared by the Practice workspace and the Arena sprint.
 */
export function AnswerInput({ problem }: { problem: AnswerInputProblem }) {
  switch (problem.evaluationMode) {
    case "NUMERIC_TOLERANCE":
      return (
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
            answer
          </label>
          <div className="input-terminal flex h-11 items-center gap-2 px-3">
            <ChevronRight className="size-4 shrink-0 text-terminal" />
            <input
              name="numericAnswer"
              type="number"
              step="any"
              required
              placeholder="0.000"
              className="h-full w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/50"
            />
            {problem.unit && (
              <span className="shrink-0 font-mono text-sm text-muted-foreground">
                {problem.unit}
              </span>
            )}
          </div>
        </div>
      );

    case "MULTIPLE_CHOICE":
      return (
        <fieldset className="space-y-2">
          <legend className="mb-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            select one
          </legend>
          {(problem.choices ?? []).map((c) => (
            <label
              key={c.id}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-input bg-background p-3 text-sm transition-colors hover:border-foreground/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="radio"
                name="choiceId"
                value={c.id}
                required
                className="size-4 accent-[hsl(var(--terminal))]"
              />
              <span className="font-mono text-xs text-muted-foreground">{c.id})</span>
              {c.label}
            </label>
          ))}
        </fieldset>
      );

    case "EXACT_MATCH":
      return (
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
            answer
          </label>
          <div className="input-terminal flex h-11 max-w-md items-center gap-2 px-3">
            <ChevronRight className="size-4 shrink-0 text-terminal" />
            <input
              name="textAnswer"
              type="text"
              required
              autoComplete="off"
              placeholder="type your answer…"
              className="h-full w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        </div>
      );

    case "LLM_GRADED":
      return (
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            <Sparkles className="size-3.5" />
            design rationale (ai-graded)
          </label>
          <textarea
            name="textAnswer"
            required
            rows={8}
            placeholder="// explain your reasoning, trade-offs, and assumptions…"
            className={cn(
              "input-terminal w-full p-3 text-sm leading-relaxed",
            )}
          />
        </div>
      );
  }
}
