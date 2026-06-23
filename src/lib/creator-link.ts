import { prisma } from "@/lib/prisma";

/**
 * If this email was pre-registered as a creator (added in the admin before the
 * creator signed up), link the new account to that creator and grant comp
 * (free Pro) access. Safe to call on every signup; a no-op otherwise.
 */
export async function linkCreatorByEmail(userId: string, email: string | null | undefined) {
  if (!email) return;
  const creator = await prisma.creator.findFirst({
    where: { email: email.toLowerCase(), userId: null },
  });
  if (!creator) return;
  await prisma.creator.update({ where: { id: creator.id }, data: { userId } });
  await prisma.user.update({
    where: { id: userId },
    data: { comped: true, compReason: `Creator: ${creator.name}` },
  });
}
