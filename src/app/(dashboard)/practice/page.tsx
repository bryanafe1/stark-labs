import type { Metadata } from "next";
import type { Discipline } from "@prisma/client";
import { getProblems } from "@/features/practice/problems";
import { PracticeBrowser } from "@/components/practice/practice-browser";
import { DISCIPLINES } from "@/lib/constants";

export const metadata: Metadata = { title: "Practice" };

export default async function PracticePage({
  searchParams,
}: {
  searchParams?: { discipline?: string; skill?: string };
}) {
  const problems = await getProblems();

  // Deep-link support: the Skill Tree links here with ?discipline=&skill=.
  const initialDiscipline =
    searchParams?.discipline && searchParams.discipline in DISCIPLINES
      ? (searchParams.discipline as Discipline)
      : "ALL";
  const initialSkill =
    initialDiscipline !== "ALL" && searchParams?.skill ? searchParams.skill : "ALL";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Practice</h1>
        <p className="text-sm text-muted-foreground">
          Conceptual, interview-style questions that test how you reason — answer
          in your own words, get AI feedback, and handle the constraints changing
          as you go. Numeric problems are here too; switch the format below.
        </p>
      </div>

      <PracticeBrowser
        problems={problems}
        initialDiscipline={initialDiscipline}
        initialSkill={initialSkill}
      />
    </div>
  );
}
