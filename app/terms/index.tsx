import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NewChevronRight from "@/components/icons/NewChevronRight";
import CustomHeader from "@/components/ui/CustomHeader";
import Separator from "@/components/ui/Separator";

export default function Terms() {
  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <CustomHeader
        title="이용약관"
        isCommit={false}
        separator
        cancel={() => router.back()}
      />
      <View className="mt-6 w-full gap-y-1 px-4">
        <Pressable
          onPress={() => router.push("/my/terms/service_terms")}
          className="flex h-14 w-full flex-row items-center justify-between rounded-lg px-2 active:bg-gray-100"
        >
          <Text className="text-lg text-[#212121]">서비스 이용약관</Text>
          <NewChevronRight />
        </Pressable>
        <Separator />
        <Pressable
          onPress={() => router.push("/my/terms/service_privacy")}
          className="flex h-14 w-full flex-row items-center justify-between rounded-lg px-2 active:bg-gray-100"
        >
          <Text className="text-lg text-[#212121]">개인 정보 처리방침</Text>
          <NewChevronRight />
        </Pressable>
        <Separator />
        <Pressable
          onPress={() => router.push("/my/terms/service_location")}
          className="flex h-14 w-full flex-row items-center justify-between rounded-lg px-2 active:bg-gray-100"
        >
          <Text className="text-lg text-[#212121]">
            위치기반 서비스 이용약관
          </Text>
          <NewChevronRight />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
