import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FlashOverlay from "@/components/FlashOverlay";
import Meter from "@/components/Meter";
import ModeToggle from "@/components/ModeToggle";
import ResultLabel from "@/components/ResultLabel";
import TapPad from "@/components/TapPad";
import VoiceControl from "@/components/VoiceControl";
import { useLieDetector } from "@/hooks/useLieDetector";

export default function HomeScreen() {
  const detector = useLieDetector();

  return (
    <SafeAreaView className="flex-1 bg-[#0B1020]">
      <FlashOverlay flash={detector.flash} />
      <View className="flex-1 px-5 pt-3 pb-6">
        <View className="items-center mb-2">
          <Text className="text-slate-100 text-2xl font-extrabold tracking-widest">
            LIE DETECTOR
          </Text>
          <Text className="text-slate-500 text-xs mt-0.5">
            Truth or lie — let's find out.
          </Text>
        </View>

        <View className="mt-4">
          <ModeToggle mode={detector.mode} onChange={detector.setMode} />
        </View>

        <View className="items-center mt-4">
          <Meter verdict={detector.verdict} status={detector.status} />
        </View>

        <View className="mt-2">
          <ResultLabel verdict={detector.verdict} status={detector.status} />
        </View>

        <View className="flex-1 justify-end">
          {detector.mode === "tap" ? (
            <TapPad onTap={detector.tapVerdict} />
          ) : (
            <VoiceControl status={detector.status} onPress={detector.startVoice} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
