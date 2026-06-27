import type { Metadata } from "next";
import { Matchmaker } from "@/components/ranked/Matchmaker";
import type { ConceptualSprintProblem } from "@/components/ranked/types";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { Paywall } from "@/components/billing/paywall";
import { getProblems } from "@/features/practice/problems";

export const metadata: Metadata = { title: "Arena" };
export const dynamic = "force-dynamic";

// Ranked Arena — Standard & Pro only. Opponents/timing are simulated, but your
// Elo is real (loaded from your account and persisted after each match).
export default async function ArenaPage() {
  const userId = await getCurrentUserId();
  const [user, paid] = await Promise.all([
    userId
      ? prisma.user.findUnique({ where: { id: userId }, select: { overallElo: true } })
      : Promise.resolve(null),
    hasPaidAccess(),
  ]);

  // Full Arena is a paid feature.
  if (!paid) {
    return <Paywall feature="the Arena" backHref="/dashboard" backLabel="Back to Home" />;
  }

  // Build the conceptual sprint pool (rubric stays server-side; only the
  // displayed text + slug go to the client).
  const conceptualPool: ConceptualSprintProblem[] = (await getProblems())
    .filter((p) => p.parts && p.parts.length > 0)
    .map((p) => ({
      kind: "conceptual" as const,
      id: p.slug,
      title: p.title,
      scenario: p.prompt,
      question: p.parts![0]!.prompt,
    }));

  return <Matchmaker initialElo={user?.overallElo ?? 1200} conceptualPool={conceptualPool} />;
}
