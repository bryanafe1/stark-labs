import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata: Metadata = {
  title: "Get started · Stark",
};

export default function OnboardingPage() {
  return (
    <main className="bg-grid relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Soft vignette so the centered card lifts off the blueprint grid. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_85%)]" />
      <OnboardingFlow />
    </main>
  );
}
