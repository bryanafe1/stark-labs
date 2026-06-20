import type { Metadata } from "next";
import { getSkillTree } from "@/features/skills/get-skill-tree";
import { SkillTree } from "@/components/skills/skill-tree";

export const metadata: Metadata = { title: "Skill Tree" };

export default async function SkillsPage() {
  const data = await getSkillTree();
  const pct =
    data.totalNodes > 0
      ? Math.round((data.totalMastered / data.totalNodes) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skill Tree</h1>
          <p className="text-sm text-muted-foreground">
            Your progress across every discipline. Click any skill to jump
            straight into its practice problems.
          </p>
        </div>
        <span className="rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-sm tabular-nums">
          <span className="font-bold text-foreground">{data.totalMastered}</span>
          <span className="text-muted-foreground"> / {data.totalNodes} skills mastered</span>
          <span className="ml-2 text-terminal">{pct}%</span>
        </span>
      </div>

      <SkillTree data={data} />
    </div>
  );
}
