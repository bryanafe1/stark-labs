import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { relaySecretOk } from "@/lib/simulation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called by the relay only. Validates a per-session token against a pending session.
export async function POST(req: Request) {
  if (!relaySecretOk(req)) {
    return NextResponse.json({ valid: false, reason: "Forbidden" }, { status: 403 });
  }
  let body: { token?: string; sessionId?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ valid: false, reason: "Invalid body" }, { status: 400 });
  }

  const session = await prisma.interviewSession.findFirst({
    where: { id: String(body.sessionId ?? ""), relayToken: String(body.token ?? ""), status: "pending" },
    select: { id: true, userId: true },
  });
  if (!session) {
    return NextResponse.json({ valid: false, reason: "Session not found or already started" });
  }
  return NextResponse.json({ valid: true, userId: session.userId, sessionId: session.id });
}
