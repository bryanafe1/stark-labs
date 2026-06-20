import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Difficulty, Discipline } from "@prisma/client";
import { getSprintProblems } from "@/features/arena/sprint-problems";
import { SprintRunner, type SprintConfig } from "@/components/arena/sprint-runner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DISCIPLINES, DIFFICULTIES } from "@/lib/constants";

export const metadata: Metadata = { title: "Ranked Sprint" };

const DURATION_BY_DIFFICULTY: Record<Difficulty, number> = {
  INTRODUCTORY: 240,
  EASY: 240,
  MEDIUM: 300,
  HARD: 420,
  EXPERT: 540,
};

function toInt(v: string | string[] | undefined): number | null {
  const s = Array.isArray(v) ? v[0] : v;
  if (!s) return null;
  const n = Number(s);
  return Number.isInteger(n) ? n : null;
}

export default async function SprintPage({
  searchParams,
}: {
  searchParams: { d?: string; diff?: string; opp?: string; before?: string };
}) {
  const discipline = searchParams.d as Discipline | undefined;
  const difficulty = searchParams.diff as Difficulty | undefined;
  const opponentElo = toInt(searchParams.opp);
  const eloBefore = toInt(searchParams.before);

  if (
    discipline == null ||
    !(discipline in DISCIPLINES) ||
    difficulty == null ||
    !(difficulty in DIFFICULTIES) ||
    opponentElo == null ||
    eloBefore == null
  ) {
    return (
      <div className="mx-auto max-w-md py-16">
        <Card>
          <CardContent className="space-y-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No active match. Head to the Arena to queue a ranked sprint.
            </p>
            <Button asChild>
              <Link href="/arena">Go to Arena</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const problems = await getSprintProblems(discipline, 3);
  const config: SprintConfig = {
    discipline,
    difficulty,
    opponentElo,
    eloBefore,
    durationSeconds: DURATION_BY_DIFFICULTY[difficulty],
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link
        href="/arena"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Forfeit & exit
      </Link>
      <SprintRunner problems={problems} config={config} />
    </div>
  );
}
