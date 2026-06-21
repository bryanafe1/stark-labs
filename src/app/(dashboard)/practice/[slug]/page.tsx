import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Zap } from "lucide-react";
import { getProblemBySlug, getProblems } from "@/features/practice/problems";
import { Card } from "@/components/ui/card";
import { DisciplinePill, DifficultyBadge } from "@/components/practice/badges";
import { ProblemWorkspace } from "@/components/practice/problem-workspace";
import { HintButton } from "@/components/practice/hint-button";
import { GiveUpButton } from "@/components/practice/give-up-button";
import { isFreeContent, hasProAccess } from "@/lib/entitlements";
import { Paywall } from "@/components/billing/paywall";

interface Params {
  params: { slug: string };
}

const MODE_LABEL: Record<string, string> = {
  NUMERIC_TOLERANCE: "numeric",
  MULTIPLE_CHOICE: "multiple-choice",
  EXACT_MATCH: "short-answer",
  LLM_GRADED: "ai-graded",
};

// Pre-render every catalog problem at build time.
export async function generateStaticParams() {
  const problems = await getProblems();
  return problems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const problem = await getProblemBySlug(params.slug);
  return { title: problem ? problem.title : "Problem" };
}

export default async function ProblemPage({ params }: Params) {
  const problem = await getProblemBySlug(params.slug);
  if (!problem) notFound();

  if (!isFreeContent(problem.discipline, problem.difficulty) && !(await hasProAccess())) {
    return <Paywall feature="this problem" backHref="/practice" backLabel="Back to Practice" />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <Link
        href="/practice"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Practice
      </Link>

      {/* Split-screen bento: left = the brief, right = the sandbox. */}
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {/* LEFT — THE BRIEF */}
        <Card className="overflow-hidden">
          <PanelHeader label="// brief" />
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <DisciplinePill discipline={problem.discipline} />
              <DifficultyBadge difficulty={problem.difficulty} />
              <span className="ml-auto flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <Zap className="size-3.5" />
                {problem.eloWeight} elo
              </span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">{problem.title}</h1>
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
              {problem.prompt}
            </div>

            <HintButton hints={problem.hints} />

            <GiveUpButton solution={problem.solution} />

            {problem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {problem.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* RIGHT — THE SANDBOX */}
        <Card className="overflow-hidden">
          <PanelHeader label="// sandbox" />
          <div className="p-5">
            <p className="mb-4 font-mono text-xs text-muted-foreground">
              mode: <span className="text-foreground">{MODE_LABEL[problem.evaluationMode]}</span>
            </p>
            <ProblemWorkspace problem={problem} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function PanelHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card/60 px-5 py-2.5">
      <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="flex gap-1.5">
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-terminal/60" />
      </span>
    </div>
  );
}
