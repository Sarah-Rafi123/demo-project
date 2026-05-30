import { useCallback, useRef, useState } from "react";

import { useHaptics } from "@/hooks/useHaptics";
import { useSound } from "@/hooks/useSound";
import { randomVerdict } from "@/lib/random";
import type { Mode, Verdict } from "@/types";

type Status = "idle" | "listening" | "settling" | "result";

export interface LieDetectorState {
  mode: Mode;
  status: Status;
  verdict: Verdict | null;
  flash: Verdict | null;
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

  const { play } = useSound();
  const { trigger, tap } = useHaptics();

  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const tapVerdict = useCallback(
    (next: Verdict) => {
      tap();
      fire(next);
    },
    [fire, tap],
  );

  const startVoice = useCallback(() => {
    if (status === "listening") return;
    clearTimers();
    setVerdict(null);
    setFlash(null);
    setStatus("listening");
    tap();
  }, [clearTimers, status, tap]);

  const endVoice = useCallback(() => {
    if (status !== "listening") return;
    fire(randomVerdict());
  }, [fire, status]);

  const reset = useCallback(() => {
    clearTimers();
    setStatus("idle");
    setVerdict(null);
    setFlash(null);
  }, [clearTimers]);

  const setMode = useCallback(
    (next: Mode) => {
      if (next === mode) return;
      clearTimers();
      setModeState(next);
      setStatus("idle");
      setVerdict(null);
      setFlash(null);
    },
    [clearTimers, mode],
  );

  return { mode, status, verdict, flash, setMode, tapVerdict, startVoice, endVoice, reset };
}
