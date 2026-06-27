import type { Metadata } from "next";
import { hasPaidAccess } from "@/lib/access";
import { Paywall } from "@/components/billing/paywall";
import { VoiceSimulation } from "@/components/simulation/voice-simulation";

export const metadata: Metadata = { title: "Voice Simulation" };
export const dynamic = "force-dynamic";

export default async function SimulationPage() {
  if (!(await hasPaidAccess())) {
    return <Paywall feature="the voice simulation" backHref="/interview" backLabel="Back to Interview" />;
  }
  return <VoiceSimulation />;
}
