import Anthropic from "@anthropic-ai/sdk";
import { buildInterviewSystemPrompt, type InterviewConfig } from "@/lib/interview";
import { isSubscribed } from "@/lib/entitlements";

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

  // Premium feature — must be an active subscriber. Protects the API directly
  // (the page paywall alone is bypassable) and guards Anthropic cost.
  if (!(await isSubscribed())) {
    return new Response("Mock interviews are a Pro feature. Upgrade to continue.", {
      status: 403,
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
