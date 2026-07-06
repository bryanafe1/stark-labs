import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { relaySecretOk } from "@/lib/simulation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called by the relay to build the interviewer prompt. Authenticated by the
// relay secret + the per-session token (Bearer).
export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  if (!relaySecretOk(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

  const session = await prisma.interviewSession.findFirst({
    where: { id: params.sessionId, relayToken: token },
    select: { discipline: true, topic: true, difficulty: true, instructions: true },
  });
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  return NextResponse.json(session);
}
