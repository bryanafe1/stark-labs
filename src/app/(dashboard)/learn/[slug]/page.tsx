import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Target, GraduationCap, CheckCircle2, KeyRound } from "lucide-react";
import { getLessonBySlug, getLessonSlugs } from "@/features/lessons/lessons-data";
import { LessonBlock } from "@/components/lessons/lesson-block";
import { LessonProgressProvider } from "@/components/lessons/lesson-progress";
import { DisciplinePill, DifficultyBadge } from "@/components/practice/badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Params {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getLessonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const lesson = await getLessonBySlug(params.slug);
  return { title: lesson ? lesson.title : "Lesson" };
}

export default async function LessonPage({ params }: Params) {
  const lesson = await getLessonBySlug(params.slug);
  if (!lesson) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Learn
      </Link>

      {/* Calm reading sheet — keeps the blueprint grid off the prose. */}
      <div className="elevated space-y-6 rounded-2xl border border-border bg-background p-5 sm:p-8">
      {/* Lesson header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <DisciplinePill discipline={lesson.discipline} />
          <DifficultyBadge difficulty={lesson.difficulty} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {lesson.estMinutes} min
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{lesson.title}</h1>
        <p className="text-muted-foreground">{lesson.summary}</p>
        {lesson.prerequisites && lesson.prerequisites.length > 0 && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Prerequisites:</span>{" "}
            {lesson.prerequisites.join(" · ")}
          </p>
        )}
      </header>

      {/* Learning objectives */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="size-5 text-primary" />
            What you&apos;ll learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {lesson.objectives.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {lesson.interviewAngle && (
        <div className="rounded-xl border border-primary/40 bg-primary/[0.06] p-4">
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary">
            <Target className="size-4" />
            Why interviewers ask this
          </p>
          <p className="text-sm text-foreground/90">{lesson.interviewAngle}</p>
        </div>
      )}

      {/* Block content — wrapped in the XP/progress tracker. */}
      <LessonProgressProvider
        total={
          lesson.blocks.filter((b) =>
            ["VIDEO", "PREDICT", "CHECK", "SANDBOX", "WORKED_EXAMPLE"].includes(b.kind),
          ).length
        }
      >
        <div className="space-y-8">
          {lesson.blocks.map((block) => (
            <LessonBlock key={block.id} block={block} />
          ))}
        </div>
      </LessonProgressProvider>

      {/* Key takeaways */}
      <Card className="border-border bg-card/40">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="size-5 text-primary" />
            Key takeaways
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {lesson.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Lesson → practice loop */}
      {lesson.practiceSlug && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-3">
              <Target className="size-6 text-primary" />
              <div>
                <p className="font-semibold">Ready to apply it?</p>
                <p className="text-sm text-muted-foreground">
                  Solve the matching practice problem to lock in this concept.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/practice/${lesson.practiceSlug}`}>Practice now</Link>
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
