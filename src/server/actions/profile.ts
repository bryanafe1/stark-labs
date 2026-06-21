"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { signOut } from "@/auth";

export type ProfileState = { ok?: boolean; error?: string };

const schema = z.object({
  displayName: z.string().trim().min(1, "Display name is required").max(60),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username is too long")
    .regex(/^[a-zA-Z0-9_.]+$/, "Use only letters, numbers, _ and ."),
  bio: z.string().trim().max(280, "Bio must be 280 characters or fewer").optional().default(""),
});

/** Update the signed-in user's profile (display name, username, bio). */
export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "You're not signed in." };

  const parsed = schema.safeParse({
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    bio: formData.get("bio") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your input." };
  }
  const { displayName, username, bio } = parsed.data;

  // Username must be unique (allow keeping your own).
  const taken = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  if (taken && taken.id !== userId) {
    return { error: "That username is already taken." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { displayName, username, bio },
  });

  revalidatePath("/settings");
  revalidatePath("/profile");
  return { ok: true };
}

/** Permanently delete the signed-in user's account and their data. */
export async function deleteAccount(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");

  // Remove user-owned rows first (deleteMany is a no-op when there are none),
  // then the user. Keeps the delete robust regardless of FK cascade settings.
  await prisma.submission.deleteMany({ where: { userId } });
  await prisma.lessonProgress.deleteMany({ where: { userId } });
  await prisma.eloRating.deleteMany({ where: { userId } });
  await prisma.skillProgress.deleteMany({ where: { userId } });
  await prisma.quizAttempt.deleteMany({ where: { userId } });
  await prisma.notification.deleteMany({ where: { userId } });
  await prisma.matchParticipant.deleteMany({ where: { userId } });
  await prisma.account.deleteMany({ where: { userId } });
  await prisma.session.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });

  await signOut({ redirectTo: "/" });
}
