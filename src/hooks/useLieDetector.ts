import { useCallback, useRef, useState } from "react";

import { useHaptics } from "@/hooks/useHaptics";
import { useSound } from "@/hooks/useSound";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { randomVerdict } from "@/lib/random";
import type { Mode, Verdict } from "@/types";

type Status = "idle" | "listening" | "settling" | "result";

export interface LieDetectorState {
  mode: Mode;
  status: Status;
  verdict: Verdict | null;
  flash: Verdict | null;
  transcript: string;
  voiceError: string | null;
  setMode: (mode: Mode) => void;
  tapVerdict: (verdict: Verdict) => void;
  startVoice: () => void;
  endVoice: () => void;
  reset: () => void;
}

const FLASH_MS = 700;

export function useLieDetector(): LieDetectorState {
  const [mode, setModeState] = useState<Mode>("tap");
  const [status, setStatus] = useState<Status>("idle");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [flash, setFlash] = useState<Verdict | null>(null);
  const [transcript, setTranscript] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const { play } = useSound();
  const { trigger, tap } = useHaptics();

  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceActive = useRef(false);
  const heardText = useRef("");

  const clearTimers = useCallback(() => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = null;
  }, []);

  const fire = useCallback(
    (next: Verdict) => {
      setVerdict(next);
      setFlash(next);
      setStatus("result");
      play(next);
      trigger(next);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlash(null), FLASH_MS);
    },
    [play, trigger],
  );

  const handleTranscript = useCallback((text: string) => {
    setTranscript(text);
    if (text.trim().length > 0) heardText.current = text;
  }, []);

  const handleEnd = useCallback(() => {
    if (!voiceActive.current) return;
    voiceActive.current = false;
    if (heardText.current.trim().length > 0) {
      fire(randomVerdict());
    } else {
      setStatus("idle");
      setVoiceError("Didn't catch that — hold the mic and speak again.");
    }
  }, [fire]);

  const handleError = useCallback((message: string) => {
    voiceActive.current = false;
    setStatus("idle");
    setTranscript("");
    setVoiceError(message);
  }, []);

  const { start, stop } = useSpeechRecognition({
    onTranscript: handleTranscript,
    onEnd: handleEnd,
    onError: handleError,
  });

  const tapVerdict = useCallback(
    (next: Verdict) => {
      tap();
      fire(next);
    },
    [fire, tap],
  );

  const startVoice = useCallback(async () => {
    if (voiceActive.current) return;
    clearTimers();
    voiceActive.current = true;
    heardText.current = "";
    setVerdict(null);
    setFlash(null);
    setTranscript("");
    setVoiceError(null);
    setStatus("listening");
    tap();
    const started = await start();
    if (!started) voiceActive.current = false;
  }, [clearTimers, start, tap]);

  const endVoice = useCallback(() => {
    if (status !== "listening") return;
    setStatus("settling");
    stop();
  }, [status, stop]);

  const reset = useCallback(() => {
    clearTimers();
    voiceActive.current = false;
    heardText.current = "";
    setStatus("idle");
    setVerdict(null);
    setFlash(null);
    setTranscript("");
    setVoiceError(null);
  }, [clearTimers]);

  const setMode = useCallback(
    (next: Mode) => {
      if (next === mode) return;
      clearTimers();
      if (voiceActive.current) stop();
      voiceActive.current = false;
      heardText.current = "";
      setModeState(next);
      setStatus("idle");
      setVerdict(null);
      setFlash(null);
      setTranscript("");
      setVoiceError(null);
    },
    [clearTimers, mode, stop],
  );

  return {
    mode,
    status,
    verdict,
    flash,
    transcript,
    voiceError,
    setMode,
    tapVerdict,
    startVoice,
    endVoice,
    reset,
  };
}
