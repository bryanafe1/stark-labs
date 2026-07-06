"use server";

import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreInterview } from "@/lib/interview-grader";
import { levelToDifficulty, INTERVIEW_KICKOFF, type InterviewConfig } from "@/lib/interview";

const WRAP_UP = "Let's wrap up. Please give me my feedback now.";

/**
 * Finalize a typed mock interview: grade the transcript for an honest 0–100
 * performance score and record ONE InterviewSession (kind="typed") so it counts
 * as a quality-weighted interview rep. Called when the candidate ends the
 * interview — so only genuinely-conducted interviews register (no counting on
 * start). Idempotency is enforced by the client (fires once).
 */
export async function finalizeTypedInterview(input: {
  messages: { role: "user" | "assistant"; content: string }[];
  config: InterviewConfig;
}): Promise<{ ok: boolean; score?: number }> {
  const userId = await getCurrentUserId();
  if (!userId) return { ok: false };

  const convo = (input.messages ?? []).filter(
    (m) =>
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content !== INTERVIEW_KICKOFF &&
      m.content !== WRAP_UP,
  );
  // Require a couple of real answers before it counts as an interview.
  if (convo.filter((m) => m.role === "user").length < 2) return { ok: false };

  const cfg = input.config ?? ({} as InterviewConfig);
  const topic = cfg.jobDescription
    ? "Tailored to a specific role"
    : cfg.focus || "core fundamentals";
  const transcript = convo
    .map((m) => `${m.role === "assistant" ? "INTERVIEWER" : "CANDIDATE"}: ${m.content}`)
    .join("\n\n");

  const graded = await scoreInterview({
    discipline: cfg.disciplineLabel || "Engineering",
    topic,
    level: cfg.level || "New grad",
    transcript,
  });

  try {
    await prisma.interviewSession.create({
      data: {
        userId,
        kind: "typed",
        discipline: (cfg.disciplineLabel || "Engineering").slice(0, 60),
        topic: topic.slice(0, 200),
        difficulty: levelToDifficulty(cfg.level),
        relayToken: crypto.randomUUID(),
        status: "completed",
        transcript: transcript.slice(0, 20_000),
        performanceScore: graded?.score ?? null,
        debrief: graded ? (graded as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });
    revalidatePath("/dashboard");
  } catch (err) {
    console.error("[interview] failed to finalize typed session", err);
    return { ok: false };
  }
  return { ok: true, score: graded?.score };
}
