"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

/** Mark the signup conversion as fired so it only ever fires once per user. */
export async function markSignupTracked(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;
  await prisma.user.update({ where: { id: userId }, data: { signupTracked: true } }).catch(() => {});
}
