import type { Metadata } from "next";
import { InterviewChat } from "@/components/interview/interview-chat";
import { getAccess } from "@/lib/access";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FREE_INTERVIEW_TURNS } from "@/lib/interview";
import { Paywall } from "@/components/billing/paywall";

export const metadata: Metadata = { title: "Mock Interview" };
export const dynamic = "force-dynamic";

export default async function InterviewPage() {
  const userId = await getCurrentUserId();
  const access = await getAccess(userId);

  // Paid users: full access. Free users: one mock interview as a taste — until
  // that's used up, then the paywall. (Voice mode inside is still Pro-only.)
  if (!access.paid) {
    const user = userId
      ? await prisma.user.findUnique({ where: { id: userId }, select: { freeInterviewTurns: true } })
      : null;
    const used = user?.freeInterviewTurns ?? 0;
    if (used >= FREE_INTERVIEW_TURNS) {
      return (
        <Paywall feature="unlimited AI mock interviews" backHref="/dashboard" backLabel="Back to Home" />
      );
    }
    return <InterviewChat pro={false} freeTrial />;
  }

  return <InterviewChat pro={access.pro} />;
}
