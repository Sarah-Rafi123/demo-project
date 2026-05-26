import { useAudioPlayer } from "expo-audio";
import { useCallback } from "react";

import type { Verdict } from "@/types";

const truthSource = require("../../assets/sounds/truth.wav");
const lieSource = require("../../assets/sounds/lie.wav");

export function useSound() {
  const truthPlayer = useAudioPlayer(truthSource);
  const liePlayer = useAudioPlayer(lieSource);

  const play = useCallback(
    (verdict: Verdict) => {
      const player = verdict === "truth" ? truthPlayer : liePlayer;
      try {
        player.seekTo(0);
        player.play();
      } catch {}
    },
    [truthPlayer, liePlayer],
  );

  return { play };
}
