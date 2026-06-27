import type { Metadata } from "next";
import { InterviewChat } from "@/components/interview/interview-chat";
import { hasPaidAccess, isPro } from "@/lib/access";
import { Paywall } from "@/components/billing/paywall";

export const metadata: Metadata = { title: "Mock Interview" };

export default async function InterviewPage() {
  const [paid, pro] = await Promise.all([hasPaidAccess(), isPro()]);
  if (!paid) {
    return <Paywall feature="AI mock interviews" backHref="/dashboard" backLabel="Back to Home" />;
  }
  // Text mock interview is Standard; speaking out loud (voice mode) is Pro.
  return <InterviewChat pro={pro} />;
}
