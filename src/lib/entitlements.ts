import "server-only";
import type { Difficulty, Discipline } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

// ---------------------------------------------------------------------------
//  Entitlements / paywall. Free tier = easy Mechanical fundamentals (lessons
//  + problems). Everything else, every discipline, and AI mock interviews are
//  Pro ($20/mo). Access = free content OR an active subscription.
// ---------------------------------------------------------------------------

/** Free sample: the easy Mechanical fundamentals. */
export function isFreeContent(discipline: Discipline, difficulty: Difficulty): boolean {
  return discipline === "MECHANICAL" && difficulty === "EASY";
}

/**
 * True if the user is paying: an active subscription that hasn't expired yet.
 * A subscription set to cancel keeps access until currentPeriodEnd.
 */
export async function isSubscribed(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true, currentPeriodEnd: true },
  });
  return (
    user?.subscriptionStatus === "active" &&
    !!user.currentPeriodEnd &&
    user.currentPeriodEnd.getTime() > Date.now()
  );
}

/** True if the signed-in user is an admin (full comp access, no payment). */
export async function isAdmin(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "ADMIN";
}

/**
 * Pro access = an active subscription OR an admin/comp account. This is the
 * gate every premium surface should use.
 */
export async function hasProAccess(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, subscriptionStatus: true, currentPeriodEnd: true },
  });
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return (
    user.subscriptionStatus === "active" &&
    !!user.currentPeriodEnd &&
    user.currentPeriodEnd.getTime() > Date.now()
  );
}

/** Can the viewer open this piece of content? */
export async function canAccess(discipline: Discipline, difficulty: Difficulty): Promise<boolean> {
  if (isFreeContent(discipline, difficulty)) return true;
  return hasProAccess();
}
