"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
//  Browser-native speech for the voice interview: SpeechSynthesis (the AI
//  interviewer talks) + SpeechRecognition (you answer by voice). No API cost,
//  no keys. Supported in Chrome, Edge, and Safari.
// ---------------------------------------------------------------------------

/** Strip markdown / LaTeX so the spoken voice reads naturally. */
export function speechClean(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " (code) ")
    .replace(/\$\$([\s\S]*?)\$\$/g, " $1 ")
    .replace(/\$([^$\n]*)\$/g, " $1 ")
    .replace(/\\[a-zA-Z]+\*?\{?|\}/g, " ") // latex commands / braces
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
  interim: string; // live transcript while you speak
  error: string | null; // mic / recognition error to show the user
  speak: (text: string, onEnd?: () => void) => void;
  listen: (onFinal: (text: string) => void) => void;
  stopListening: () => void; // graceful: ends capture, fires the final result
  cancel: () => void; // abort TTS + STT, no callback
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

export function useSpeech(): SpeechApi {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<unknown>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
      speechSynthesis?: unknown;
    };
    const hasRec = !!(w.SpeechRecognition || w.webkitSpeechRecognition);
    setSupported(hasRec && "speechSynthesis" in window);
    // Warm up the voice list (loads async in some browsers).
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    return () => {
      try {
        window.speechSynthesis?.cancel();
        audioRef.current?.pause();
        (recRef.current as { abort?: () => void } | null)?.abort?.();
      } catch {
        /* ignore */
      }
    };
  }, []);

  // Browser SpeechSynthesis — the free, robotic fallback when no TTS key is set.
  const browserSpeak = useCallback((text: string, onEnd?: () => void) => {
    const clean = speechClean(text);
    if (!clean || !("speechSynthesis" in window)) {
      setSpeaking(false);
      onEnd?.();
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = 1.02;
    u.pitch = 1;
    u.onend = () => {
      setSpeaking(false);
      onEnd?.();
    };
    u.onerror = () => {
      setSpeaking(false);
      onEnd?.();
    };
    setSpeaking(true);
    synth.speak(u);
  }, []);

  // Prefer the human-voice server TTS (/api/tts); fall back to the browser voice.
  const speak = useCallback(
    async (text: string, onEnd?: () => void) => {
      const clean = speechClean(text);
      if (!clean) {
        onEnd?.();
        return;
      }
      setSpeaking(true);
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text: clean }),
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => {
            setSpeaking(false);
            URL.revokeObjectURL(url);
            audioRef.current = null;
            onEnd?.();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            audioRef.current = null;
            browserSpeak(text, onEnd);
          };
          try {
            await audio.play();
            return; // human voice is playing
          } catch {
            URL.revokeObjectURL(url);
            audioRef.current = null;
            // autoplay blocked → fall through to browser voice
          }
        }
      } catch {
        /* network / route error → fall back */
      }
      browserSpeak(text, onEnd);
    },
    [browserSpeak],
  );

  const listen = useCallback((onFinal: (text: string) => void) => {
    const w = window as unknown as {
      SpeechRecognition?: new () => unknown;
      webkitSpeechRecognition?: new () => unknown;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setError("Speech recognition isn't supported here — use Chrome, Edge, or Safari.");
      return;
    }
    // Stop our own audio so the mic doesn't capture the interviewer's voice.
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(false);
    setError(null);
    setInterim("");
    // Clear any stale recognizer before starting a fresh one.
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
    rec.interimResults = true; // show words live (proof the mic is heard)
    rec.continuous = true; // keep listening until the user taps "Finish"
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
      if (code === "aborted") return; // we aborted intentionally
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
  }, []);

  const stopListening = useCallback(() => {
    (recRef.current as { stop?: () => void } | null)?.stop?.();
  }, []);

  const cancel = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(false);
    (recRef.current as { abort?: () => void } | null)?.abort?.();
    recRef.current = null;
    setListening(false);
    setInterim("");
  }, []);

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
