"use client";

// ---------------------------------------------------------------------------
//  Browser audio engine for the voice simulation. Captures the mic as 24 kHz
//  mono PCM16 (what OpenAI Realtime + AssemblyAI expect) and plays the AI's
//  streamed PCM16 audio back gaplessly. No dependencies.
// ---------------------------------------------------------------------------

const SAMPLE_RATE = 24000;

/** Float32 [-1,1] → little-endian 16-bit PCM ArrayBuffer. */
function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const buf = new ArrayBuffer(input.length * 2);
  const view = new DataView(buf);
  for (let i = 0, off = 0; i < input.length; i++, off += 2) {
    const s = Math.max(-1, Math.min(1, input[i] ?? 0));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buf;
}

/** base64 PCM16 → Int16Array. */
function base64ToInt16(b64: string): Int16Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  // Ensure even length (PCM16); drop a trailing odd byte if any.
  const len = bytes.byteLength - (bytes.byteLength % 2);
  return new Int16Array(bytes.buffer, 0, len / 2);
}

export function audioSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    !!(window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext)
  );
}

function newContext(): AudioContext {
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new Ctx({ sampleRate: SAMPLE_RATE });
}

/** Captures the mic and emits 24 kHz PCM16 frames. */
export class MicStreamer {
  private ctx?: AudioContext;
  private stream?: MediaStream;
  private source?: MediaStreamAudioSourceNode;
  private processor?: ScriptProcessorNode;

  async start(onPCM: (buf: ArrayBuffer) => void): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
    this.ctx = newContext();
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.source = this.ctx.createMediaStreamSource(this.stream);
    this.processor = this.ctx.createScriptProcessor(4096, 1, 1);
    this.processor.onaudioprocess = (e: AudioProcessingEvent) => {
      onPCM(floatTo16BitPCM(e.inputBuffer.getChannelData(0)));
    };
    this.source.connect(this.processor);
    this.processor.connect(this.ctx.destination); // required for the processor to run
  }

  stop(): void {
    try {
      this.processor?.disconnect();
      this.source?.disconnect();
      this.stream?.getTracks().forEach((t) => t.stop());
      void this.ctx?.close();
    } catch {
      /* ignore */
    }
  }
}

/** Plays streamed PCM16 chunks back-to-back for gapless playback. */
export class AudioPlayer {
  private ctx: AudioContext;
  private nextStart = 0;
  private sources = new Set<AudioBufferSourceNode>();

  constructor() {
    this.ctx = newContext();
  }

  async resume(): Promise<void> {
    if (this.ctx.state === "suspended") await this.ctx.resume();
  }

  play(base64: string): void {
    const int16 = base64ToInt16(base64);
    if (int16.length === 0) return;
    const f32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) f32[i] = (int16[i] ?? 0) / 0x8000;
    const buffer = this.ctx.createBuffer(1, f32.length, SAMPLE_RATE);
    buffer.getChannelData(0).set(f32);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.ctx.destination);
    const now = this.ctx.currentTime;
    if (this.nextStart < now) this.nextStart = now;
    src.start(this.nextStart);
    this.nextStart += buffer.duration;
    this.sources.add(src);
    src.onended = () => this.sources.delete(src);
  }

  /** Stop everything currently queued (barge-in / interruption). */
  stopAll(): void {
    this.sources.forEach((s) => {
      try {
        s.stop();
      } catch {
        /* already stopped */
      }
    });
    this.sources.clear();
    this.nextStart = 0;
  }

  close(): void {
    this.stopAll();
    try {
      void this.ctx.close();
    } catch {
      /* ignore */
    }
  }
}
