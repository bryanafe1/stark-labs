// Plain module (no "server-only") — imported by both server pages and the
// client <NotificationsMenu/>. Mock data only; no DB/API.

export type NotificationType =
  | "MATCH_FOUND"
  | "RANK_CHANGE"
  | "SUBMISSION_GRADED"
  | "COMMENT_REPLY"
  | "SKILL_UNLOCKED"
  | "SYSTEM";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string; // ISO
};

/** ISO timestamp `mins` minutes in the past. */
const minsAgo = (mins: number): string =>
  new Date(Date.now() - mins * 60000).toISOString();

/** Most-recent first. Mixed read/unread. */
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "MATCH_FOUND",
    title: "Ranked match found",
    body: "Your opponent is ready — Statics duel, best of 3. Tap in before the lobby closes.",
    href: "/arena",
    read: false,
    createdAt: minsAgo(2),
  },
  {
    id: "n2",
    type: "COMMENT_REPLY",
    title: "New reply in 'Buckling of slender columns'",
    body: 'm_torres: "Effective length factor depends on the end conditions — check K for fixed-pinned."',
    href: "/community",
    read: false,
    createdAt: minsAgo(11),
  },
  {
    id: "n3",
    type: "RANK_CHANGE",
    title: "Promoted to Platinum",
    body: "You climbed past 1,800 rating and entered the Platinum bracket. Keep the streak going.",
    href: "/leaderboard",
    read: false,
    createdAt: minsAgo(47),
  },
  {
    id: "n4",
    type: "SUBMISSION_GRADED",
    title: "Submission graded: Beam deflection",
    body: "Your solution passed 8/8 cases. +120 XP awarded. Review the optimal approach in the writeup.",
    href: "/practice",
    read: true,
    createdAt: minsAgo(95),
  },
  {
    id: "n5",
    type: "SKILL_UNLOCKED",
    title: "Skill unlocked: Navier–Stokes",
    body: "You met the prerequisites in Fluid Mechanics. A new problem set is now available.",
    href: "/learn",
    read: false,
    createdAt: minsAgo(180),
  },
  {
    id: "n6",
    type: "SYSTEM",
    title: "Weekly recap is ready",
    body: "You solved 23 problems and won 6 of 9 ranked matches this week. Nice work.",
    href: "/dashboard",
    read: true,
    createdAt: minsAgo(600),
  },
  {
    id: "n7",
    type: "MATCH_FOUND",
    title: "Rematch requested",
    body: "a_okafor wants a rematch in Thermodynamics. The challenge expires in 24 hours.",
    href: "/arena",
    read: true,
    createdAt: minsAgo(1500),
  },
  {
    id: "n8",
    type: "SUBMISSION_GRADED",
    title: "Submission graded: Mohr's circle",
    body: "Your solution passed 5/6 cases. One edge case on principal stress sign convention failed.",
    href: "/practice",
    read: true,
    createdAt: minsAgo(2880),
  },
];
