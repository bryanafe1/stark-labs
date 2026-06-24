import type { Metadata } from "next";
import { Matchmaker } from "@/components/ranked/Matchmaker";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export const metadata: Metadata = { title: "Arena" };
export const dynamic = "force-dynamic";

// Ranked Arena. Opponents/timing are simulated, but your Elo is real — loaded
// from your account and persisted after each match.
export default async function ArenaPage() {
  const userId = await getCurrentUserId();
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { overallElo: true } })
    : null;
  return <Matchmaker initialElo={user?.overallElo ?? 1200} />;
}
