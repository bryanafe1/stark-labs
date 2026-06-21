import "server-only";
import type { Difficulty, Discipline } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

// ---------------------------------------------------------------------------
//  Entitlements / paywall. Free tier = easy Mechanical fundamentals (lessons
//  + problems). Everything else, every discipline, and AI mock interviews are
//  Pro ($5/mo). Access = free content OR an active subscription.
// ---------------------------------------------------------------------------

/** Free sample: the easy Mechanical fundamentals. */
export function isFreeContent(discipline: Discipline, difficulty: Difficulty): boolean {
  return discipline === "MECHANICAL" && difficulty === "EASY";
}

/** True if the signed-in user has an active subscription. */
export async function isSubscribed(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true },
  });
  return user?.subscriptionStatus === "active";
}

/** Can the viewer open this piece of content? */
export async function canAccess(discipline: Discipline, difficulty: Difficulty): Promise<boolean> {
  if (isFreeContent(discipline, difficulty)) return true;
  return isSubscribed();
}
