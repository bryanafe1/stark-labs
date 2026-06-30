"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import { gradeConceptualPractice } from "@/server/actions/conceptual";

interface PartState {
  answer: string;
  result?: { score: number; strengths: string; improvements: string };
  error?: string;
}

function scoreTone(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-foreground";
  return "text-destructive";
}

/**
 * Open-ended conceptual question: the candidate writes a free-form answer to
 * each part, the AI scores it (0–100) + gives interviewer feedback, and the
 * next part (which changes the constraints) unlocks after the current one is
 * graded. Rubrics never reach the client — grading happens server-side by slug.
 */
export function ConceptualWorkspace({
  slug,
  partPrompts,
}: {
  slug: string;
  partPrompts: string[];
}) {
  const [revealed, setRevealed] = useState(1);
  const [parts, setParts] = useState<PartState[]>(partPrompts.map(() => ({ answer: "" })));
  const [grading, setGrading] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const setAnswer = (i: number, v: string) =>
    setParts((p) => p.map((x, j) => (j === i ? { ...x, answer: v } : x)));

  const submit = (i: number) => {
    const answer = (parts[i]?.answer ?? "").trim();
    if (!answer) return;
    const prior =
      partPrompts
        .slice(0, i)
        .map((q, j) => `Q: ${q}\nYour answer: ${parts[j]?.answer ?? ""}`)
        .join("\n\n") || undefined;
    setGrading(i);
    startTransition(async () => {
      const r = await gradeConceptualPractice({ slug, partIndex: i, answer, prior });
      setParts((p) =>
        p.map((x, j) =>
          j === i
            ? {
                ...x,
                result: r.ok
                  ? { score: r.score ?? 0, strengths: r.strengths ?? "", improvements: r.improvements ?? "" }
                  : undefined,
                error: r.ok ? undefined : r.error,
              }
            : x,
        ),
      );
      setGrading(null);
    });
  };

  return (
    <div className="space-y-4">
      {partPrompts.slice(0, revealed).map((q, i) => {
        const ps = parts[i]!;
        const graded = !!ps.result;
        const isLast = i === partPrompts.length - 1;
        const busy = grading === i;
        return (
          <div key={i} className="rounded-xl border border-border bg-card/50 p-5">
            <span className="inline-block rounded-full bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {i === 0 ? "Question" : `Constraint change ${i}`}
            </span>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{q}</p>

            <textarea
              value={ps.answer}
              onChange={(e) => setAnswer(i, e.target.value)}
              disabled={graded || busy}
              rows={5}
              placeholder="Explain your reasoning — like you would out loud in an interview."
              className="mt-3 w-full rounded-lg border border-input bg-background p-3 text-sm leading-relaxed outline-none ring-ring transition focus-visible:ring-2 disabled:opacity-70 placeholder:text-muted-foreground/50"
            />

            {!graded && (
              <Button className="mt-3" onClick={() => submit(i)} disabled={busy || !ps.answer.trim()}>
                {busy && <Loader2 className="size-4 animate-spin" />}
                {busy ? "Grading…" : "Submit for feedback"}
              </Button>
            )}

            {ps.error && <p className="mt-3 text-sm font-medium text-destructive">{ps.error}</p>}

            {ps.result && (
              <div className="mt-4 space-y-3 rounded-lg border border-border bg-background p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="size-4 text-muted-foreground" />
                  AI score
                  <span className={cn("font-mono", scoreTone(ps.result.score))}>
                    {ps.result.score}/100
                  </span>
                </p>

                {ps.result.strengths && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-success">
                      What you did well
                    </p>
                    <div className="mt-1 text-sm leading-relaxed text-foreground/85">
                      <Markdown content={ps.result.strengths} />
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">
                    What you can improve on
                  </p>
                  <div className="mt-1 text-sm leading-relaxed text-foreground/85">
                    <Markdown content={ps.result.improvements} />
                  </div>
                </div>
              </div>
            )}

            {graded && !isLast && revealed === i + 1 && (
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => setRevealed((r) => Math.min(partPrompts.length, r + 1))}
              >
                Next — the interviewer changes the constraints
                <ArrowRight className="size-4" />
              </Button>
            )}

            {graded && isLast && (
              <p className="mt-4 text-sm text-muted-foreground">
                That&apos;s the full question — you handled every constraint. Nice work.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
