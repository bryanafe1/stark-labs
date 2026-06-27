import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { relaySecretOk, generateDebrief } from "@/lib/simulation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Receives every lifecycle event from the relay and persists it.
export async function POST(req: Request) {
  if (!relaySecretOk(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const event = String(body.event ?? "");
  const sessionId = String(body.sessionId ?? "");
  if (!sessionId) return NextResponse.json({ ok: true });

  try {
    switch (event) {
      case "session_active":
        await prisma.interviewSession.update({ where: { id: sessionId }, data: { status: "active" } });
        break;

      case "message_saved":
        await prisma.sessionMessage
          .create({
            data: {
              id: String(body.messageId),
              sessionId,
              role: String(body.role ?? ""),
              content: String(body.content ?? ""),
              audioDurationSeconds: (body.audio_duration_seconds as number | null) ?? null,
              sequence: Number(body.sequence ?? 0),
            },
          })
          .catch(() => {}); // ignore duplicate / out-of-order
        break;

      case "speech_metrics":
        await prisma.sessionSpeechData
          .create({
            data: {
              sessionId,
              messageId: (body.messageId as string | undefined) ?? null,
              wordsPerMinute: (body.words_per_minute as number | null) ?? null,
              fillerWordCount: (body.filler_word_count as number | null) ?? null,
              fillerWordsDetail:
                (body.filler_words_detail as Prisma.InputJsonValue | undefined) ?? undefined,
              pauseCount: (body.pause_count as number | null) ?? null,
              longestPauseSeconds: (body.longest_pause_seconds as number | null) ?? null,
              averagePauseSeconds: (body.average_pause_seconds as number | null) ?? null,
              confidenceScore: (body.confidence_score as number | null) ?? null,
              wordCount: (body.word_count as number | null) ?? null,
            },
          })
          .catch(() => {});
        break;

      case "session_ended": {
        const messages = await prisma.sessionMessage.findMany({
          where: { sessionId },
          orderBy: { sequence: "asc" },
        });
        const transcript = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
        const duration = (body.duration_seconds as number | null) ?? 0;
        // Early technical failure: <30s and no audio exchanged → don't charge it.
        const earlyFail = duration < 30 && messages.length === 0;

        const ended = await prisma.interviewSession.update({
          where: { id: sessionId },
          data: {
            status: "completed",
            completedAt: new Date(),
            durationSeconds: duration,
            questionCount: messages.filter((m) => m.role === "interviewer").length,
            transcript,
            refunded: earlyFail,
          },
          select: { creditId: true },
        });

        if (earlyFail) {
          // Return the consumed credit (Standard); Pro is excluded via `refunded`.
          if (ended.creditId) {
            await prisma.sessionCredit.updateMany({
              where: { id: ended.creditId, status: "used" },
              data: { status: "available", usedAt: null, usedSessionId: null },
            });
          }
          break; // nothing to debrief on an empty session
        }

        void generateDebrief(sessionId).catch(() => {});
        break;
      }
    }
  } catch {
    /* swallow — the relay treats these as fire-and-forget */
  }

  return NextResponse.json({ ok: true });
}
