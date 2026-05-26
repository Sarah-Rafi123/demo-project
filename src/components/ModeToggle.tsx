import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { Mode } from "@/types";
import { useEffect } from "react";

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

const OPTIONS: { value: Mode; label: string }[] = [
  { value: "tap", label: "Tap" },
  { value: "voice", label: "Voice" },
];

export default function ModeToggle({ mode, onChange }: Props) {
  const progress = useSharedValue(mode === "tap" ? 0 : 1);

  useEffect(() => {
    progress.value = withTiming(mode === "tap" ? 0 : 1, { duration: 220 });
  }, [mode, progress]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${progress.value * 50}%`,
  }));

  return (
    <View className="rounded-full bg-slate-800/80 p-1 flex-row relative border border-slate-700/60">
      <Animated.View
        style={indicatorStyle}
        className="absolute top-1 bottom-1 w-1/2 rounded-full bg-slate-100"
      />
      {OPTIONS.map((opt) => {
        const active = opt.value === mode;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className="flex-1 py-2.5 items-center justify-center rounded-full"
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${opt.label} mode`}
          >
            <Text
              className={`text-sm font-semibold ${
                active ? "text-slate-900" : "text-slate-300"
              }`}
            >
              {opt.label} Mode
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
