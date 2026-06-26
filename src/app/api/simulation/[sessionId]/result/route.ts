import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The browser polls this after a session ends, until the debrief is ready.
export async function GET(_req: Request, { params }: { params: { sessionId: string } }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in" }, { status: 401 });

  const session = await prisma.interviewSession.findFirst({
    where: { id: params.sessionId, userId },
    select: { status: true, debrief: true, durationSeconds: true, questionCount: true },
  });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(session);
}
