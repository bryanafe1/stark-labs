import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUserId } from "@/lib/auth";
import { hasProAccess } from "@/lib/entitlements";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Browser calls this (signed in) to begin a voice simulation. Creates a pending
// session + per-session relay token and returns the WebSocket URL for the relay.
export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in to start a simulation." }, { status: 401 });
  if (!(await hasProAccess())) {
    return NextResponse.json({ error: "Voice simulation is a Pro feature." }, { status: 403 });
  }

  const relayUrl = process.env.SIMULATION_RELAY_URL;
  if (!relayUrl) {
    return NextResponse.json({ error: "Voice simulation isn't configured yet." }, { status: 503 });
  }

  let body: { discipline?: string; topic?: string; difficulty?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* defaults below */
  }
  const discipline = String(body.discipline ?? "MECHANICAL").slice(0, 60);
  const topic = String(body.topic ?? "core fundamentals").slice(0, 200);
  const difficulty = ["entry", "mid", "senior"].includes(String(body.difficulty))
    ? String(body.difficulty)
    : "mid";
  const relayToken = crypto.randomBytes(24).toString("hex");

  const session = await prisma.interviewSession.create({
    data: { userId, discipline, topic, difficulty, relayToken, status: "pending" },
  });

  const wsBase = relayUrl.replace(/^http/i, "ws").replace(/\/$/, "");
  return NextResponse.json({
    sessionId: session.id,
    token: relayToken,
    wsUrl: `${wsBase}/ws?sessionId=${session.id}&token=${relayToken}`,
  });
}
