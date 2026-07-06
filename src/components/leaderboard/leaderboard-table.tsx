"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Medal } from "lucide-react";
import type { Discipline } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DISCIPLINE_LIST, RANK_TIER_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { LeaderboardViewModel, LeaderRow } from "@/features/leaderboard/get-leaderboard";

type Tab = "OVERALL" | Discipline;

export function LeaderboardTable({ data }: { data: LeaderboardViewModel }) {
  const [tab, setTab] = useState<Tab>("OVERALL");
  const rows = tab === "OVERALL" ? data.overall : data.byDiscipline[tab];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <TabPill active={tab === "OVERALL"} onClick={() => setTab("OVERALL")}>
          Overall
        </TabPill>
        {DISCIPLINE_LIST.map((d) => {
          const Icon = d.icon;
          return (
            <TabPill key={d.key} active={tab === d.key} onClick={() => setTab(d.key)}>
              <Icon className="size-3.5" />
              {d.label}
            </TabPill>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y divide-border">
          {rows.map((row) => (
            <Row
              key={row.username}
              row={row}
              isCurrent={row.username === data.currentUsername}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function Row({ row, isCurrent }: { row: LeaderRow; isCurrent: boolean }) {
  const tier = RANK_TIER_MAP[row.rankTier];
  const total = row.wins + row.losses;
  const wr = total > 0 ? Math.round((row.wins / total) * 100) : 0;
  const initials = row.displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors",
        isCurrent ? "bg-primary/[0.07]" : "hover:bg-accent/40",
      )}
    >
      <div className="w-8 shrink-0 text-center">
        <RankBadge rank={row.rank} />
      </div>
      <Avatar className="size-9">
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-sm font-medium">
          {row.displayName}
          {isCurrent && (
            <span className="rounded-lg bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
              YOU
            </span>
          )}
        </p>
        <p className="truncate text-xs text-muted-foreground">@{row.username}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className={cn("text-[10px] font-semibold sm:text-xs", tier.textClass)}>{tier.label}</p>
        <p className="text-[10px] text-muted-foreground sm:text-xs">{wr}% WR</p>
      </div>
      <div className="w-16 shrink-0 text-right font-mono font-bold tabular-nums">{row.elo}</div>
    </motion.div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="mx-auto size-5 text-primary" />;
  if (rank === 2) return <Medal className="mx-auto size-5 text-foreground" />;
  if (rank === 3) return <Medal className="mx-auto size-5 text-muted-foreground" />;
  return <span className="text-sm font-semibold text-muted-foreground">{rank}</span>;
}

function TabPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-input text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
