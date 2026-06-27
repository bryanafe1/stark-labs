import { isPro } from "@/lib/access";

// Human-voice TTS for the voice interview. Uses ElevenLabs if configured, else
// OpenAI TTS. Returns MP3 audio. Pro-gated to protect API cost. If neither key
// is set it returns 503 and the client falls back to the browser voice.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Defaults: a warm, natural male interviewer voice (override via env).
const ELEVEN_VOICE = process.env.ELEVENLABS_VOICE_ID ?? "pNInz6obpgDQGcFmaJgB"; // "Adam"
const OPENAI_VOICE = process.env.OPENAI_TTS_VOICE ?? "onyx";

export async function POST(req: Request) {
  if (!(await isPro())) {
    return new Response("Pro feature", { status: 403 });
  }

  let text = "";
  try {
    const body = (await req.json()) as { text?: string };
    text = String(body.text ?? "").slice(0, 4000);
  } catch {
    return new Response("Invalid body", { status: 400 });
  }
  if (!text.trim()) return new Response("No text", { status: 400 });

  const eleven = process.env.ELEVENLABS_API_KEY;
  const openai = process.env.OPENAI_API_KEY;

  try {
    if (eleven) {
      const r = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: { "xi-api-key": eleven, "content-type": "application/json", accept: "audio/mpeg" },
          body: JSON.stringify({
            text,
            model_id: "eleven_turbo_v2_5",
            voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true },
          }),
        },
      );
      if (!r.ok || !r.body) return new Response("TTS upstream error", { status: 502 });
      return new Response(r.body, {
        headers: { "content-type": "audio/mpeg", "cache-control": "no-store" },
      });
    }

    if (openai) {
      const r = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: { Authorization: `Bearer ${openai}`, "content-type": "application/json" },
        body: JSON.stringify({ model: "tts-1", voice: OPENAI_VOICE, input: text, response_format: "mp3" }),
      });
      if (!r.ok || !r.body) return new Response("TTS upstream error", { status: 502 });
      return new Response(r.body, {
        headers: { "content-type": "audio/mpeg", "cache-control": "no-store" },
      });
    }

    return new Response("TTS not configured", { status: 503 });
  } catch {
    return new Response("TTS error", { status: 502 });
  }
}
