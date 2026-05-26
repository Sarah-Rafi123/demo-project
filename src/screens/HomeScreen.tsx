import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-neutral-900">
          Lie Detector
        </Text>
        <Text className="mt-2 text-base text-neutral-500">
          Truth or lie — let's find out.
        </Text>
      </View>
    </SafeAreaView>
  );
}
