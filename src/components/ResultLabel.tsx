import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { Verdict } from "@/types";

interface Props {
  verdict: Verdict | null;
  status: "idle" | "listening" | "settling" | "result";
}

export default function ResultLabel({ verdict, status }: Props) {
  const opacity = useSharedValue(0);
  const translate = useSharedValue(8);

  useEffect(() => {
    if (verdict) {
      opacity.value = withTiming(1, { duration: 220 });
      translate.value = withTiming(0, { duration: 260 });
    } else {
      opacity.value = withTiming(0, { duration: 180 });
      translate.value = withTiming(8, { duration: 180 });
    }
  }, [verdict, opacity, translate]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translate.value }],
  }));

  const helper =
    status === "listening"
      ? "Listening..."
      : status === "settling"
        ? "Analyzing voice..."
        : status === "idle"
          ? "Awaiting input"
          : verdict === "truth"
            ? "Statement detected as truth"
            : "Statement detected as lie";

  const title = verdict === "truth" ? "TRUTH" : verdict === "lie" ? "LIE" : "—";
  const titleColor =
    verdict === "truth"
      ? "text-emerald-400"
      : verdict === "lie"
        ? "text-red-400"
        : "text-slate-500";

  return (
    <View className="items-center" style={{ minHeight: 56 }}>
      <Animated.View style={style} className="items-center">
        <Text className={`text-4xl font-black tracking-[6px] ${titleColor}`}>
          {title}
        </Text>
      </Animated.View>
      <Text className="mt-1 text-slate-400 text-xs">{helper}</Text>
    </View>
  );
}
