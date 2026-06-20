import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { getLeaderboard } from "@/features/leaderboard/get-leaderboard";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";

export const metadata: Metadata = { title: "Leaderboard" };

export default async function LeaderboardPage() {
  const data = await getLeaderboard();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Trophy className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Global rankings overall and by discipline. Switch tabs to see each track.
          </p>
        </div>
      </div>

      <LeaderboardTable data={data} />
    </div>
  );
}
