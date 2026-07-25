import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// A fixed demo account for replaying the new-signup experience. Signing in with
// DEMO_EMAIL / DEMO_PASSWORD ensures the account exists, wipes it back to a
// brand-new-user state, and drops you into the first-run funnel (/start).
const DEMO_EMAIL = (process.env.DEMO_EMAIL ?? "").toLowerCase().trim();
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "";

export function demoEnabled(): boolean {
  return DEMO_EMAIL.length > 0 && DEMO_PASSWORD.length > 0;
}

export function isDemoEmail(email: string): boolean {
  return demoEnabled() && email.toLowerCase().trim() === DEMO_EMAIL;
}

/** Ensure the demo user exists with the fixed password (so sign-in can auth it). */
export async function ensureDemoUser(): Promise<void> {
  if (!demoEnabled()) return;
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL }, select: { id: true } });
  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: { passwordHash } });
    return;
  }
  const base = DEMO_EMAIL.split("@")[0]?.replace(/[^a-z0-9]/g, "") || "demo";
  let username = base;
  let i = 1;
  while (await prisma.user.findUnique({ where: { username } })) username = `${base}${i++}`;
  await prisma.user.create({
    data: { email: DEMO_EMAIL, passwordHash, username, name: "Demo", displayName: "Demo" },
  });
}

/** Wipe all activity + reset every "new user" signal, so it looks freshly signed up. */
export async function resetDemoActivity(): Promise<void> {
  if (!demoEnabled()) return;
  const user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL }, select: { id: true } });
  if (!user) return;
  const userId = user.id;

  await Promise.all([
    prisma.submission.deleteMany({ where: { userId } }),
    prisma.interviewSession.deleteMany({ where: { userId } }), // cascades to messages/speech
    prisma.lessonProgress.deleteMany({ where: { userId } }),
    prisma.passwordResetToken.deleteMany({ where: { userId } }),
    prisma.skillProgress.deleteMany({ where: { userId } }),
    prisma.eloRating.deleteMany({ where: { userId } }),
    prisma.quizAttempt.deleteMany({ where: { userId } }),
  ]);

  await prisma.user.update({
    where: { id: userId },
    data: {
      freeInterviewTurns: 0,
      freeConceptGrades: 0,
      signupTracked: false,
      signupSource: null,
      signupMedium: null,
      signupCampaign: null,
      signupReferrer: null,
      signupLanding: null,
      emailOptOut: false,
      planTier: null,
      comped: false,
      subscriptionStatus: "none",
      xp: 0,
      streakDays: 0,
      overallElo: 1200,
    },
  });
}
