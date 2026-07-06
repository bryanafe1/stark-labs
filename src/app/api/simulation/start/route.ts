import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUserId } from "@/lib/auth";
import { canStartVoiceSimulation } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import {
  buildVoiceInterviewPrompt,
  levelToDifficulty,
  type InterviewConfig,
  type InterviewLevel,
  type InterviewMode,
} from "@/lib/interview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function reasonMessage(reason: "free" | "need_credits" | "pro_exhausted"): string {
  if (reason === "free") return "Voice simulation is a paid feature. Upgrade to Standard or Pro to use it.";
  if (reason === "need_credits")
    return "You have no voice-session credits. Buy a single session ($12) or upgrade to Pro for 5/month.";
  return "You've used your voice minutes for this month. They reset on the 1st — or buy a single session to keep going.";
}

// Browser calls this (signed in) to begin a voice simulation. Verifies the
// user's tier/credits, consumes a credit (Standard) or counts toward the Pro
// monthly allotment, then returns the relay WebSocket URL.
export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in to start a simulation." }, { status: 401 });

  const check = await canStartVoiceSimulation(userId);
  if (!check.ok) {
    return NextResponse.json(
      {
        error: reasonMessage(check.reason),
        reason: check.reason,
        ...(check.reason === "pro_exhausted" ? { resetAt: check.resetAt } : {}),
      },
      { status: 403 },
    );
  }

  const relayUrl = process.env.SIMULATION_RELAY_URL;
  if (!relayUrl) {
    return NextResponse.json({ error: "Voice simulation isn't configured yet." }, { status: 503 });
  }

  let body: { config?: Partial<InterviewConfig> } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* defaults below */
  }

  // Sanitize the client-supplied interview config, then build the interviewer
  // system prompt server-side (same logic as the typed interview) so the voice
  // interviewer honors discipline / type / focus / level / project / JD.
  const raw = body.config ?? {};
  const LEVELS: InterviewLevel[] = ["Intern", "New grad", "Experienced"];
  const level: InterviewLevel = LEVELS.includes(raw.level as InterviewLevel)
    ? (raw.level as InterviewLevel)
    : "New grad";
  const interviewMode: InterviewMode = ["technical", "project", "full"].includes(
    String(raw.interviewMode),
  )
    ? (raw.interviewMode as InterviewMode)
    : "technical";
  const config: InterviewConfig = {
    disciplineLabel: String(raw.disciplineLabel ?? "Mechanical").slice(0, 60),
    focus: String(raw.focus ?? "General fundamentals").slice(0, 120),
    level,
    interviewMode,
    jobDescription: raw.jobDescription ? String(raw.jobDescription).slice(0, 6000) : undefined,
    projectContext: raw.projectContext ? String(raw.projectContext).slice(0, 2000) : undefined,
  };

  const difficulty = levelToDifficulty(level);
  const topic = config.jobDescription
    ? "Tailored to a specific role"
    : config.focus !== "General fundamentals"
      ? config.focus
      : "core fundamentals";
  const instructions = buildVoiceInterviewPrompt(config);
  const relayToken = crypto.randomBytes(24).toString("hex");

  const session = await prisma.interviewSession.create({
    data: {
      userId,
      discipline: config.disciplineLabel,
      topic,
      difficulty,
      instructions,
      relayToken,
      status: "pending",
      creditId: check.via === "credit" ? check.creditId : null,
    },
  });

  // Standard tier: deduct the credit at start. Guard against a concurrent race.
  if (check.via === "credit") {
    const consumed = await prisma.sessionCredit.updateMany({
      where: { id: check.creditId, status: "available" },
      data: { status: "used", usedAt: new Date(), usedSessionId: session.id },
    });
    if (consumed.count === 0) {
      await prisma.interviewSession.delete({ where: { id: session.id } }).catch(() => {});
      return NextResponse.json(
        { error: "That credit was just used. Buy another or upgrade to Pro.", reason: "need_credits" },
        { status: 403 },
      );
    }
  }
  // Pro tier: the session row itself counts toward the monthly allotment.

  const wsBase = relayUrl.replace(/^http/i, "ws").replace(/\/$/, "");
  return NextResponse.json({
    sessionId: session.id,
    token: relayToken,
    wsUrl: `${wsBase}/ws?sessionId=${session.id}&token=${relayToken}`,
  });
}
