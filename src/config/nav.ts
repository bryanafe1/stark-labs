import {
  Swords,
  GraduationCap,
  Network,
  ClipboardCheck,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Primary product modules — the focused MVP. One tight path: Learn → Practice →
 * Arena, with Progress as the motivating dashboard. Community, Quizzes,
 * Leaderboard and Notifications are deferred (kept in the codebase, unlinked).
 */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Learn", href: "/learn", icon: GraduationCap }, // interactive lessons
  { label: "Practice", href: "/practice", icon: ClipboardCheck }, // problem bank + instant grading
  { label: "Interview", href: "/interview", icon: MessageSquare }, // AI mock interviewer
  { label: "Arena", href: "/arena", icon: Swords }, // ranked sprint (retention hook)
  { label: "Progress", href: "/skills", icon: Network }, // mastery dashboard
];
