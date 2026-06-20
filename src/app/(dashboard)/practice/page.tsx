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
          {problems.length} problems across 10 disciplines. Filter by discipline,
          by subject (thermo, fluids, materials…), or by technical skill (FEA,
          CFD, CAD…). Numeric, multiple-choice, short-answer, and AI-graded.
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
