import type { Metadata } from "next";
import { InterviewChat } from "@/components/interview/interview-chat";
import { hasPaidAccess } from "@/lib/access";
import { Paywall } from "@/components/billing/paywall";

export const metadata: Metadata = { title: "Mock Interview" };

export default async function InterviewPage() {
  if (!(await hasPaidAccess())) {
    return <Paywall feature="AI mock interviews" backHref="/dashboard" backLabel="Back to Home" />;
  }
  return <InterviewChat />;
}
