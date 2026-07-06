import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";
import {
  buildInterviewSystemPrompt,
  levelToDifficulty,
  FREE_INTERVIEW_TURNS,
  type InterviewConfig,
} from "@/lib/interview";
import { getAccess } from "@/lib/access";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Anthropic SDK needs the Node runtime; streamed responses must not be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface InterviewRequest {
  messages: ChatMessage[];
  config: InterviewConfig;
}

// Cost guardrails — bounded history + output per turn.
const MAX_HISTORY = 24;
const MAX_TOKENS = 1024;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      "The mock interviewer isn't configured yet (missing ANTHROPIC_API_KEY).",
      { status: 503 },
    );
  }

  // Paid → unlimited. Free → one mock interview's worth of turns (lifetime),
  // then 402 so the client shows the upgrade wall. Enforced here so the cap
  // can't be bypassed, and to bound Anthropic cost.
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Sign in to start a mock interview.", { status: 401 });

  const access = await getAccess(userId);
  if (!access.paid) {
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { freeInterviewTurns: true },
    });
    if ((u?.freeInterviewTurns ?? 0) >= FREE_INTERVIEW_TURNS) {
      return new Response("Your free mock interview is used up. Upgrade for unlimited.", {
        status: 402,
      });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { freeInterviewTurns: { increment: 1 } },
    });
  }

  let body: InterviewRequest;
  try {
    body = (await req.json()) as InterviewRequest;
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  const { messages, config } = body;
  if (!Array.isArray(messages) || messages.length === 0 || !config) {
    return new Response("Missing messages or interview config.", { status: 400 });
  }

  // Record the typed interview as an interview rep — once, on the opening turn
  // (the hidden kickoff is the only message). Typed interviews previously
  // persisted nothing but the free-turn counter, so they never registered on the
  // readiness score. Voice sessions bill minutes; a typed row carries no
  // duration (and kind="typed"), so it never touches voice quotas.
  if (messages.length === 1) {
    try {
      await prisma.interviewSession.create({
        data: {
          userId,
          kind: "typed",
          discipline: (config.disciplineLabel || "Engineering").slice(0, 60),
          topic: (config.jobDescription
            ? "Tailored to a specific role"
            : config.focus || "core fundamentals"
          ).slice(0, 200),
          difficulty: levelToDifficulty(config.level),
          relayToken: crypto.randomUUID(),
          status: "completed",
        },
      });
    } catch (err) {
      console.error("[interview] failed to record typed session", err);
    }
  }

  const history = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content }));

  const client = new Anthropic({ apiKey });
  // Default to Sonnet 4.6 — strong for interview chat at ~half Opus cost. Override via INTERVIEW_MODEL.
  const model = process.env.INTERVIEW_MODEL ?? "claude-sonnet-4-6";

  // Prompt caching: cache the system prompt and the conversation prefix (breakpoint
  // on the last message) so each turn cheaply reuses the resent history instead of
  // paying full input price every time.
  const cachedMessages: Anthropic.MessageParam[] = history.map((m, i) =>
    i === history.length - 1
      ? {
          role: m.role,
          content: [
            { type: "text", text: m.content, cache_control: { type: "ephemeral" } },
          ],
        }
      : { role: m.role, content: m.content },
  );

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const llm = client.messages.stream({
          model,
          max_tokens: MAX_TOKENS,
          system: [
            {
              type: "text",
              text: buildInterviewSystemPrompt(config),
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: cachedMessages,
        });

        for await (const event of llm) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("[interview] stream error", err);
        controller.enqueue(
          encoder.encode("\n\n_(The interviewer hit a problem. Please try sending that again.)_"),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
