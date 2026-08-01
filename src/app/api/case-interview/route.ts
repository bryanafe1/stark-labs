import Anthropic from "@anthropic-ai/sdk";
import { buildCaseInterviewPrompt, type CaseConfig } from "@/lib/case-interview";
import { getCurrentUserId } from "@/lib/auth";

// Anthropic SDK needs the Node runtime; streamed responses must not be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CaseRequest {
  messages: ChatMessage[];
  config: CaseConfig;
  key?: string; // private-link access key (lets people use it without an account)
}

// Cost guardrails — bounded history + output per turn.
const MAX_HISTORY = 30;
const MAX_TOKENS = 1200;

const LEVELS = new Set(["Undergrad", "MBA", "Experienced hire"]);
const FIRMS = new Set(["MBB (general)", "McKinsey", "BCG", "Bain"]);
const TYPES = new Set([
  "mixed",
  "profitability",
  "market-entry",
  "market-sizing",
  "growth",
  "pricing",
  "operations",
  "ma",
]);

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("The case interviewer isn't configured yet (missing ANTHROPIC_API_KEY).", {
      status: 503,
    });
  }

  const userId = await getCurrentUserId();

  let body: CaseRequest;
  try {
    body = (await req.json()) as CaseRequest;
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  // Access: a signed-in user, OR a valid private-link key. Keeps the hidden
  // tool usable with no account while not being fully open to the world.
  const validKey =
    !!process.env.CASE_COACH_KEY && typeof body.key === "string" && body.key === process.env.CASE_COACH_KEY;
  if (!userId && !validKey) {
    return new Response("This case link is private — ask for a valid link or sign in.", { status: 401 });
  }

  const { messages, config } = body;
  if (!Array.isArray(messages) || messages.length === 0 || !config) {
    return new Response("Missing messages or case config.", { status: 400 });
  }

  // Sanitize config → safe defaults.
  const safeConfig: CaseConfig = {
    caseType: TYPES.has(config.caseType) ? config.caseType : "mixed",
    firm: FIRMS.has(config.firm) ? config.firm : "MBB (general)",
    level: LEVELS.has(config.level) ? config.level : "MBA",
  };

  const history = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content }));

  const client = new Anthropic({ apiKey });
  const model = process.env.INTERVIEW_MODEL ?? "claude-sonnet-4-6";

  // Prompt caching: cache the system prompt + conversation prefix.
  const cachedMessages: Anthropic.MessageParam[] = history.map((m, i) =>
    i === history.length - 1
      ? { role: m.role, content: [{ type: "text", text: m.content, cache_control: { type: "ephemeral" } }] }
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
              text: buildCaseInterviewPrompt(safeConfig),
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: cachedMessages,
        });
        for await (const event of llm) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("[case-interview] stream error", err);
        controller.enqueue(
          encoder.encode("\n\n_(The interviewer hit a problem. Please try sending that again.)_"),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
