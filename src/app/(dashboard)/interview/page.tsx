import type { Metadata } from "next";
import { InterviewLanding } from "@/components/interview/interview-landing";
import { getAccess } from "@/lib/access";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FREE_INTERVIEW_TURNS } from "@/lib/interview";

export const metadata: Metadata = { title: "Mock Interview" };
export const dynamic = "force-dynamic";

export default async function InterviewPage() {
  const userId = await getCurrentUserId();
  const access = await getAccess(userId);

  // Typed is free-to-try (one interview) then upgrade; Voice is Pro-gated on
  // its own page. Both are surfaced as co-equal choices in the hub.
  let typedExhausted = false;
  if (!access.paid) {
    const user = userId
      ? await prisma.user.findUnique({ where: { id: userId }, select: { freeInterviewTurns: true } })
      : null;
    typedExhausted = (user?.freeInterviewTurns ?? 0) >= FREE_INTERVIEW_TURNS;
  }

  return <InterviewLanding freeTrial={!access.paid} typedExhausted={typedExhausted} />;
}
