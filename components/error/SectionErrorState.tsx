import { Pressable, Text, View } from "react-native";

import ErrorIcon from "@/components/icons/ErrorIcon";

interface SectionErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  height?: number;
}

export default function SectionErrorState({
  title = "데이터를 불러올 수 없습니다",
  message = "잠시 후 다시 시도해주세요",
  onRetry,
  height = 200,
}: SectionErrorStateProps) {
  return (
    <View
      className="w-full items-center justify-center rounded-2xl bg-gray-50"
      style={{ height }}
    >
      <ErrorIcon width={40} height={40} color="#BDBDBD" />
      <Text className="mt-3 text-lg font-medium text-gray-600">{title}</Text>
      <Text className="mt-1 text-base text-gray-400">{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-4 rounded-lg bg-[#6C4DFF] px-5 py-2.5 active:bg-[#5638E6]"
        >
          <Text className="text-base font-medium text-white">다시 시도</Text>
        </Pressable>
      )}
    </View>
  );
}
