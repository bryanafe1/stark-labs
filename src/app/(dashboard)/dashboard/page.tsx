import type { Metadata } from "next";
import { getDashboard } from "@/features/dashboard/get-dashboard";
import { RankCard } from "@/components/dashboard/rank-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { SkillTreePanel } from "@/components/dashboard/skill-tree-panel";
import {
  MotionStagger,
  MotionItem,
} from "@/components/motion/motion-primitives";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const data = await getDashboard();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {data.user.displayName.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s your engineering progress across all disciplines.
        </p>
      </div>

      {/* KPI row */}
      <MotionStagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <MotionItem key={stat.label}>
            <StatCard stat={stat} />
          </MotionItem>
        ))}
      </MotionStagger>

      {/* Rank + skill tree */}
      <div className="space-y-6">
        <RankCard
          overallElo={data.user.overallElo}
          xp={data.user.xp}
          streakDays={data.user.streakDays}
        />
        <SkillTreePanel items={data.disciplines} />
      </div>
    </div>
  );
}
