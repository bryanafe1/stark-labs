import type { Metadata } from "next";
import { getCurrentUserId } from "@/lib/auth";
import { canStartVoiceSimulation } from "@/lib/access";
import { Paywall } from "@/components/billing/paywall";
import { VoiceGate } from "@/components/billing/voice-gate";
import { VoiceSimulation } from "@/components/simulation/voice-simulation";

export const metadata: Metadata = { title: "Voice Interview" };
export const dynamic = "force-dynamic";

export default async function SimulationPage() {
  const userId = await getCurrentUserId();
  const check = await canStartVoiceSimulation(userId);

  if (!check.ok) {
    if (check.reason === "free") {
      return <Paywall feature="the Voice Interview" backHref="/interview" backLabel="Back to Interview" />;
    }
    return <VoiceGate reason={check.reason} resetAt={check.reason === "pro_exhausted" ? check.resetAt : undefined} />;
  }
  return <VoiceSimulation />;
}
