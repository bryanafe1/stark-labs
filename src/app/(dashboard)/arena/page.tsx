import type { Metadata } from "next";
import { Matchmaker } from "@/components/ranked/Matchmaker";
import type { ConceptualSprintProblem } from "@/components/ranked/types";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { hasProAccess } from "@/lib/entitlements";
import { getProblems } from "@/features/practice/problems";

export const metadata: Metadata = { title: "Arena" };
export const dynamic = "force-dynamic";

// Ranked Arena. Opponents/timing are simulated, but your Elo is real (loaded
// from your account and persisted after each match). Pro users also get
// AI-graded conceptual sprints mixed in.
export default async function ArenaPage() {
  const userId = await getCurrentUserId();
  const [user, pro] = await Promise.all([
    userId
      ? prisma.user.findUnique({ where: { id: userId }, select: { overallElo: true } })
      : Promise.resolve(null),
    hasProAccess(),
  ]);

  // Build the conceptual sprint pool (rubric stays server-side; only the
  // displayed text + slug go to the client). Pro-gated for API cost.
  const conceptualPool: ConceptualSprintProblem[] = pro
    ? (await getProblems())
        .filter((p) => p.parts && p.parts.length > 0)
        .map((p) => ({
          kind: "conceptual" as const,
          id: p.slug,
          title: p.title,
          scenario: p.prompt,
          question: p.parts![0]!.prompt,
        }))
    : [];

  return <Matchmaker initialElo={user?.overallElo ?? 1200} conceptualPool={conceptualPool} />;
}
