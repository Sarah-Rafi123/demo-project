import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface Props {
  status: "idle" | "listening" | "settling" | "result";
  onPress: () => void;
}

export default function VoiceControl({ status, onPress }: Props) {
  const ring = useSharedValue(0);

  useEffect(() => {
    if (status === "listening") {
      ring.value = 0;
      ring.value = withRepeat(
        withTiming(1, { duration: 1100, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      );
    } else {
      ring.value = withTiming(0, { duration: 200 });
    }
  }, [status, ring]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 1 - ring.value,
    transform: [{ scale: 1 + ring.value * 0.8 }],
  }));

  const listening = status === "listening";

  return (
    <View className="items-center w-full" style={{ minHeight: 200 }}>
      <View className="items-center justify-center">
        <Animated.View
          pointerEvents="none"
          className="absolute h-32 w-32 rounded-full bg-sky-400/40"
          style={ringStyle}
        />
        <Pressable
          onPress={onPress}
          disabled={listening}
          accessibilityRole="button"
          accessibilityLabel={listening ? "Listening" : "Tap to speak"}
          className={`h-28 w-28 rounded-full items-center justify-center border-2 ${
            listening
              ? "bg-sky-500 border-sky-300"
              : "bg-slate-800 border-slate-600 active:bg-slate-700"
          }`}
        >
          <Text className="text-3xl">{listening ? "..." : "🎙"}</Text>
        </Pressable>
      </View>
      <Text className="mt-5 text-slate-300 text-base">
        {listening ? "Listening..." : "Tap and say something"}
      </Text>
      <Text className="mt-1 text-slate-500 text-xs text-center px-4">
        Speak any short sentence — the meter will decide.
      </Text>
    </View>
  );
}
