import type { Metadata } from "next";
import Link from "next/link";
import {
  Flame, Trophy, Target, GraduationCap, Swords, Sparkles,
  CheckCircle2, BookOpen, TrendingUp, Settings, type LucideIcon,
} from "lucide-react";
import { getProfile, type Achievement, type ActivityEntry } from "@/features/profile/get-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EloGrid } from "@/components/arena/elo-grid";
import { RANK_TIER_MAP } from "@/lib/constants";
import { cn, formatCompact, timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Profile" };

const ACHIEVEMENT_ICONS: Record<Achievement["icon"], LucideIcon> = {
  flame: Flame, trophy: Trophy, target: Target,
  graduation: GraduationCap, swords: Swords, sparkles: Sparkles,
};

const ACTIVITY_ICONS: Record<ActivityEntry["kind"], LucideIcon> = {
  SOLVED: CheckCircle2, LESSON: BookOpen, MATCH: Swords, RANK: TrendingUp,
};

export default async function ProfilePage() {
  const { user, disciplines, stats, achievements, recentActivity } = await getProfile();
  const tier = RANK_TIER_MAP[user.rankTier];
  const initials = user.displayName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const tiles = [
    { label: "Global rank", value: `#${user.globalRank}` },
    { label: "Problems solved", value: String(stats.problemsSolved) },
    { label: "Lessons done", value: String(stats.lessonsCompleted) },
    { label: "Win rate", value: `${stats.winRate}%` },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <Card className="overflow-hidden">
        <div className={cn("h-20 bg-gradient-to-r", tier.gradient, "opacity-30")} />
        <CardContent className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end">
          <Avatar className="size-20 border-4 border-card">
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{user.displayName}</h1>
            <p className="text-sm text-muted-foreground">
              @{user.username} · joined {timeAgo(user.joinedAt)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-black tabular-nums">{user.overallElo}</p>
              <p className={cn("text-xs font-semibold", tier.textClass)}>{tier.label}</p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link href="/settings"><Settings className="size-4" /> Edit</Link>
            </Button>
          </div>
        </CardContent>
        <CardContent className="pt-0">
          <p className="text-sm text-foreground/90">{user.bio}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Flame className="size-4 text-orange-400" /> {user.streakDays}-day streak</span>
            <span className="flex items-center gap-1"><Sparkles className="size-4 text-emerald-400" /> {formatCompact(user.xp)} XP</span>
          </div>
        </CardContent>
      </Card>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label} className="p-4">
            <p className="text-2xl font-bold tracking-tight">{t.value}</p>
            <p className="text-xs text-muted-foreground">{t.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Discipline breakdown */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Per-Discipline Rating</h2>
            <EloGrid items={disciplines} />
          </div>

          {/* Achievements */}
          <Card>
            <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {achievements.map((a) => {
                const Icon = ACHIEVEMENT_ICONS[a.icon];
                return (
                  <div
                    key={a.id}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center",
                      a.earned ? "border-primary/30 bg-primary/[0.04]" : "border-border opacity-50",
                    )}
                  >
                    <Icon className={cn("size-7", a.earned ? "text-primary" : "text-muted-foreground")} />
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {recentActivity.map((e) => {
                const Icon = ACTIVITY_ICONS[e.kind];
                return (
                  <div key={e.id} className="flex items-start gap-3 rounded-lg p-2.5">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.detail}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground/70">{timeAgo(e.at)}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
