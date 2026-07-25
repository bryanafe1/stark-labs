import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, MessageSquare, GraduationCap, ArrowRight } from "lucide-react";
import { getProblems } from "@/features/practice/problems";
import { getLessons } from "@/features/lessons/lessons-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Get started" };
export const dynamic = "force-dynamic";

const EASY = new Set(["INTRODUCTORY", "EASY"]);

export default async function StartPage() {
  const [problems, lessons] = await Promise.all([getProblems(), getLessons()]);

  // Deep-link a genuinely easy first problem (numeric/MCQ, not a write-a-paragraph
  // conceptual) so the very first action is one tap → answer → instant feedback.
  const introProblem =
    problems.find((p) => p.discipline === "MECHANICAL" && !p.parts && EASY.has(p.difficulty)) ??
    problems.find((p) => !p.parts && EASY.has(p.difficulty)) ??
    problems.find((p) => !p.parts) ??
    problems[0];
  const introLesson = lessons.find((l) => l.discipline === "MECHANICAL") ?? lessons[0];

  const problemHref = introProblem ? `/practice/${introProblem.slug}` : "/practice";
  const lessonHref = introLesson ? `/learn/${introLesson.slug}` : "/learn";

  return (
    <div className="mx-auto flex min-h-[68vh] max-w-3xl flex-col justify-center py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Let&apos;s get your first rep in</h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Pick one — it takes about two minutes. You can explore everything else after.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StartCard
          href={problemHref}
          icon={ClipboardCheck}
          title="Solve a problem"
          desc="One question, instant AI feedback. The fastest win."
          primary
        />
        <StartCard
          href="/interview?start=1"
          icon={MessageSquare}
          title="Mock interview"
          desc="Talk through a problem with an AI interviewer and get scored."
        />
        <StartCard
          href={lessonHref}
          icon={GraduationCap}
          title="Learn a concept"
          desc="A short, interactive lesson with a live sandbox."
        />
      </div>

      <div className="mt-6 text-center">
        <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          Skip for now →
        </Link>
      </div>
    </div>
  );
}

function StartCard({
  href,
  icon: Icon,
  title,
  desc,
  primary,
}: {
  href: string;
  icon: typeof MessageSquare;
  title: string;
  desc: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-2xl border p-5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        primary
          ? "border-primary/50 bg-primary/[0.06] hover:border-primary hover:bg-primary/10"
          : "border-border hover:border-primary/40",
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Icon className="size-5" />
      </span>
      <p className="mt-3 text-lg font-semibold">{title}</p>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        Start
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
