import type { Metadata } from "next";
import { Matchmaker } from "@/components/ranked/Matchmaker";

export const metadata: Metadata = { title: "Arena" };

// The ranked "cold-start" matchmaking engine — frontend-only, simulated.
export default function ArenaPage() {
  return <Matchmaker />;
}
