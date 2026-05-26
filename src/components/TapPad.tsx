import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import type { Verdict } from "@/types";

interface Props {
  onTap: (verdict: Verdict) => void;
  disabled?: boolean;
}

interface PadProps {
  label: string;
  hint: string;
  side: "left" | "right";
  color: "truth" | "lie";
  onPress: () => void;
  disabled?: boolean;
}

function Pad({ label, hint, color, onPress, disabled }: PadProps) {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withTiming(0.97, { duration: 80 });
  };
  const onPressOut = () => {
    scale.value = withSequence(
      withTiming(1.02, { duration: 100 }),
      withTiming(1, { duration: 120 }),
    );
  };

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const palette =
    color === "truth"
      ? {
          bg: "bg-emerald-500/15",
          border: "border-emerald-500/40",
          title: "text-emerald-300",
          hint: "text-emerald-200/70",
        }
      : {
          bg: "bg-red-500/15",
          border: "border-red-500/40",
          title: "text-red-300",
          hint: "text-red-200/70",
        };

  return (
    <Animated.View style={style} className="flex-1">
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`Tap ${label}`}
        className={`flex-1 rounded-3xl border ${palette.bg} ${palette.border} items-center justify-center p-6 active:opacity-90`}
      >
        <Text className={`text-2xl font-extrabold tracking-widest ${palette.title}`}>
          {label}
        </Text>
        <Text className={`mt-2 text-xs ${palette.hint}`}>{hint}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function TapPad({ onTap, disabled }: Props) {
  return (
    <View className="flex-row gap-3 w-full" style={{ minHeight: 140 }}>
      <Pad
        label="TRUTH"
        hint="Tap left"
        color="truth"
        side="left"
        onPress={() => onTap("truth")}
        disabled={disabled}
      />
      <Pad
        label="LIE"
        hint="Tap right"
        color="lie"
        side="right"
        onPress={() => onTap("lie")}
        disabled={disabled}
      />
    </View>
  );
}
