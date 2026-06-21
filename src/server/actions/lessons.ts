"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

/**
 * Record that the signed-in user completed an interactive block in a lesson.
 * Idempotent — re-marking an already-done block is a no-op. Called as the user
 * engages with each block so they can resume where they left off.
 */
export async function saveLessonBlockDone(lessonSlug: string, blockId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonSlug: { userId, lessonSlug } },
    select: { completedBlocks: true },
  });

  const set = new Set(existing?.completedBlocks ?? []);
  if (set.has(blockId)) return;
  set.add(blockId);

  await prisma.lessonProgress.upsert({
    where: { userId_lessonSlug: { userId, lessonSlug } },
    create: { userId, lessonSlug, completedBlocks: [...set] },
    update: { completedBlocks: [...set] },
  });
}
