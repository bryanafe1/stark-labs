import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

// Per-user lesson progress reads. Returns the ids of interactive blocks the
// current user has completed. Empty for a signed-out or brand-new user.

export async function getLessonProgress(slug: string): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const row = await prisma.lessonProgress.findUnique({
    where: { userId_lessonSlug: { userId, lessonSlug: slug } },
    select: { completedBlocks: true },
  });
  return row?.completedBlocks ?? [];
}

/** slug → completed block ids, for the whole Learn list in one query. */
export async function getAllLessonProgress(): Promise<Record<string, string[]>> {
  const userId = await getCurrentUserId();
  if (!userId) return {};
  const rows = await prisma.lessonProgress.findMany({
    where: { userId },
    select: { lessonSlug: true, completedBlocks: true },
  });
  const map: Record<string, string[]> = {};
  for (const r of rows) map[r.lessonSlug] = r.completedBlocks;
  return map;
}
