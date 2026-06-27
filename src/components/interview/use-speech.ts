"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
//  Browser-native speech for the voice interview. The interviewer speaks via a
//  STREAMING queue — each sentence of the reply is fetched (human-voice /api/tts)
//  and played as soon as it's ready, so speech starts almost immediately instead
//  of after the whole reply is generated. You answer via SpeechRecognition.
// ---------------------------------------------------------------------------

/** Strip markdown / LaTeX so the spoken voice reads naturally. */
export function speechClean(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " (code) ")
    .replace(/\$\$([\s\S]*?)\$\$/g, " $1 ")
    .replace(/\$([^$\n]*)\$/g, " $1 ")
    .replace(/\\[a-zA-Z]+\*?\{?|\}/g, " ")
    .replace(/[`*_#>|~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface RecAlt {
  transcript: string;
}
interface RecResult {
  isFinal: boolean;
  0: RecAlt;
}
interface RecEvent {
  resultIndex: number;
  results: ArrayLike<RecResult>;
}
interface RecError {
  error?: string;
}

interface SpeechApi {
  supported: boolean;
  speaking: boolean;
  listening: boolean;
  interim: string;
  error: string | null;
  /** Enqueue a chunk of the reply to be spoken (call per sentence as it streams). */
  speak: (text: string) => void;
  listen: (onFinal: (text: string) => void) => void;
  stopListening: () => void;
  cancel: () => void;
  clearError: () => void;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const preferred = en.find((v) =>
    /google us english|samantha|daniel|aaron|microsoft (aria|guy|jenny)/i.test(v.name),
  );
  return preferred ?? en[0] ?? voices[0] ?? null;
}

/** Fetch human-voice audio for a text segment; returns an object URL or null. */
function fetchTTS(text: string): Promise<string | null> {
  return fetch("/api/tts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  })
    .then(async (res) => {
      if (!res.ok) return null;
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    })
    .catch(() => null);
}

/** Robotic browser fallback for a segment when /api/tts isn't available. */
function browserSpeakAwait(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window) || !text) {
      resolve();
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = 1.02;
    u.pitch = 1;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

export function useSpeech(): SpeechApi {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<unknown>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const segQueue = useRef<{ text: string; p: Promise<string | null> }[]>([]);
  const processingRef = useRef(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    const hasRec = !!(w.SpeechRecognition || w.webkitSpeechRecognition);
    setSupported(hasRec && "speechSynthesis" in window);
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    return () => {
      try {
        // Kill the whole queue on unmount, not just the current utterance —
        // otherwise the next prefetched sentence keeps speaking after you
        // navigate away from the interview.
        cancelledRef.current = true;
        segQueue.current = [];
        window.speechSynthesis?.cancel();
        audioRef.current?.pause();
        audioRef.current = null;
        (recRef.current as { abort?: () => void } | null)?.abort?.();
        recRef.current = null;
      } catch {
        /* ignore */
      }
    };
  }, []);

  const stopAllAudio = useCallback(() => {
    cancelledRef.current = true;
    segQueue.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
  }, []);

  const playUrl = (url: string): Promise<void> =>
    new Promise((resolve) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      const done = () => {
        if (audioRef.current === audio) audioRef.current = null;
        resolve();
      };
      audio.onended = done;
      audio.onerror = done;
      audio.play().catch(done);
    });

  const processQueue = async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    while (segQueue.current.length && !cancelledRef.current) {
      const seg = segQueue.current.shift()!;
      const url = await seg.p; // prefetched in parallel when enqueued
      if (cancelledRef.current) {
        if (url) URL.revokeObjectURL(url);
        break;
      }
      if (url) {
        await playUrl(url);
        URL.revokeObjectURL(url);
      } else {
        await browserSpeakAwait(seg.text);
      }
    }
    processingRef.current = false;
    if (segQueue.current.length === 0) setSpeaking(false);
  };

  const speak = (text: string) => {
    const clean = speechClean(text);
    if (!clean) return;
    cancelledRef.current = false;
    setSpeaking(true);
    segQueue.current.push({ text: clean, p: fetchTTS(clean) }); // start fetching now
    void processQueue();
  };

  const listen = useCallback(
    (onFinal: (text: string) => void) => {
      const w = window as unknown as {
        SpeechRecognition?: new () => unknown;
        webkitSpeechRecognition?: new () => unknown;
      };
      const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
      if (!Ctor) {
        setError("Speech recognition isn't supported here — use Chrome, Edge, or Safari.");
        return;
      }
      // Barge-in: stop the interviewer's audio so the mic doesn't capture it.
      stopAllAudio();
      setSpeaking(false);
      setError(null);
      setInterim("");
      try {
        (recRef.current as { abort?: () => void } | null)?.abort?.();
      } catch {
        /* ignore */
      }
      recRef.current = null;

      const rec = new Ctor() as {
        lang: string;
        interimResults: boolean;
        continuous: boolean;
        maxAlternatives: number;
        start: () => void;
        onresult: (e: RecEvent) => void;
        onerror: (e: RecError) => void;
        onend: () => void;
      };
      rec.lang = "en-US";
      rec.interimResults = true;
      rec.continuous = true;
      rec.maxAlternatives = 1;

      let finalText = "";
      let sawError = false;

      rec.onresult = (e: RecEvent) => {
        let live = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          const txt = r?.[0]?.transcript ?? "";
          if (r?.isFinal) finalText += (finalText ? " " : "") + txt.trim();
          else live += txt;
        }
        setInterim((finalText + " " + live).trim());
      };

      rec.onerror = (e: RecError) => {
        const code = e?.error ?? "unknown";
        if (code === "aborted") return;
        sawError = true;
        if (code === "not-allowed" || code === "service-not-allowed") {
          setError(
            "Microphone access is blocked. Click the lock/camera icon in your address bar, allow the microphone, then try again.",
          );
        } else if (code === "no-speech") {
          setError("I didn't catch anything — check your mic is on, then tap and speak up a little.");
        } else if (code === "audio-capture") {
          setError("No microphone found. Check your input device and try again.");
        } else if (code === "network") {
          setError("The speech service couldn't be reached (it needs internet). Try again.");
        } else {
          setError(`Microphone error (${code}). Try again.`);
        }
      };

      rec.onend = () => {
        setListening(false);
        setInterim("");
        recRef.current = null;
        const text = finalText.trim();
        if (text) {
          setError(null);
          onFinal(text);
        } else if (!sawError) {
          setError("I didn't hear anything. Tap to speak, then talk — your words appear here as you go.");
        }
      };

      recRef.current = rec;
      try {
        rec.start();
        setListening(true);
      } catch {
        setError("Couldn't start the microphone. Make sure nothing else is using it, then try again.");
        setListening(false);
      }
    },
    [stopAllAudio],
  );

  const stopListening = useCallback(() => {
    (recRef.current as { stop?: () => void } | null)?.stop?.();
  }, []);

  const cancel = useCallback(() => {
    stopAllAudio();
    setSpeaking(false);
    (recRef.current as { abort?: () => void } | null)?.abort?.();
    recRef.current = null;
    setListening(false);
    setInterim("");
  }, [stopAllAudio]);

  const clearError = useCallback(() => setError(null), []);

  return {
    supported,
    speaking,
    listening,
    interim,
    error,
    speak,
    listen,
    stopListening,
    cancel,
    clearError,
  };
}
