import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { FLASH } from "@/constants/theme";
import type { Verdict } from "@/types";

interface Props {
  flash: Verdict | null;
}

export default function FlashOverlay({ flash }: Props) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (flash) {
      opacity.value = withSequence(
        withTiming(1, { duration: 120 }),
        withTiming(0.6, { duration: 180 }),
        withTiming(0, { duration: 380 }),
      );
    }
  }, [flash, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: flash === "truth" ? FLASH.truth : FLASH.lie,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, style]}
    />
  );
}
