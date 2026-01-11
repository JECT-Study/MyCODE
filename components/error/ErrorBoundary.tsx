import { ReactNode } from "react";

import { StatusBar } from "expo-status-bar";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ErrorIcon from "@/components/icons/ErrorIcon";

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 items-center justify-center px-6">
        <ErrorIcon width={80} height={80} color="#BDBDBD" />
        <Text className="mt-6 text-3xl font-semibold text-gray-800">
          문제가 발생했습니다
        </Text>
        <Text className="mt-2 text-center text-lg text-gray-500">
          예상치 못한 오류가 발생했습니다.{"\n"}잠시 후 다시 시도해주세요.
        </Text>
        <Pressable
          onPress={resetErrorBoundary}
          className="mt-8 rounded-xl bg-[#6C4DFF] px-8 py-4 active:bg-[#5638E6]"
        >
          <Text className="text-xl font-semibold text-white">다시 시도</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

interface Props {
  children: ReactNode;
}

export default function ErrorBoundary({ children }: Props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
