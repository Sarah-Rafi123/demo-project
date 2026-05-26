import * as Haptics from "expo-haptics";
import { useCallback } from "react";

import type { Verdict } from "@/types";

export function useHaptics() {
  const trigger = useCallback((verdict: Verdict) => {
    const type =
      verdict === "truth"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error;
    Haptics.notificationAsync(type).catch(() => {});
  }, []);

  const tap = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  return { trigger, tap };
}
