import type { Metadata } from "next";
import { InterviewChat } from "@/components/interview/interview-chat";

export const metadata: Metadata = { title: "Mock Interview" };

export default function InterviewPage() {
  return <InterviewChat />;
}
