import type { Metadata } from "next";
import { CommunityHub } from "@/components/community/CommunityHub";

export const metadata: Metadata = { title: "Community" };

// Local-first hub: all data is static (mockCommunityData) and every interaction
// (upvote, collapse, reply) is local React state — works with no backend.
export default function CommunityPage() {
  return <CommunityHub />;
}
