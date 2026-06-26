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

interface SpeechApi {
  supported: boolean;
  speaking: boolean;
  listening: boolean;
  speak: (text: string, onEnd?: () => void) => void;
  listen: (onFinal: (text: string) => void) => void;
  stopListening: () => void; // graceful: ends capture, fires the final result
  cancel: () => void; // abort TTS + STT, no callback
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
  const recRef = useRef<unknown>(null);

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
        (recRef.current as { abort?: () => void } | null)?.abort?.();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    const clean = speechClean(text);
    if (!clean || !("speechSynthesis" in window)) {
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

  const listen = useCallback((onFinal: (text: string) => void) => {
    const w = window as unknown as {
      SpeechRecognition?: new () => unknown;
      webkitSpeechRecognition?: new () => unknown;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    window.speechSynthesis?.cancel(); // don't capture our own voice
    setSpeaking(false);

    const rec = new Ctor() as {
      lang: string;
      interimResults: boolean;
      continuous: boolean;
      maxAlternatives: number;
      start: () => void;
      onresult: (e: unknown) => void;
      onerror: () => void;
      onend: () => void;
    };
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    let finalText = "";

    rec.onresult = (e: unknown) => {
      const ev = e as { results: ArrayLike<ArrayLike<{ transcript: string }>> };
      let t = "";
      for (let i = 0; i < ev.results.length; i++) {
        t += ev.results[i]?.[0]?.transcript ?? "";
      }
      finalText = t;
    };
    rec.onerror = () => {
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
      recRef.current = null;
      const text = finalText.trim();
      if (text) onFinal(text);
    };

    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
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
    setSpeaking(false);
    (recRef.current as { abort?: () => void } | null)?.abort?.();
    recRef.current = null;
    setListening(false);
  }, []);

  return { supported, speaking, listening, speak, listen, stopListening, cancel };
}
