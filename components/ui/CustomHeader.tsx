import { Pressable, Text, View } from "react-native";

import Chevron from "@/components/icons/Chevron";
import XIcon from "@/components/icons/X";

interface CustomHeaderProps {
  title: string;
  // X 눌렀을 때 수행할 동작
  cancel?: () => void;
  // 확인 여부
  isCommit: boolean;
  // 확인시 수행할 로직
  commit?: () => void;
  // seperator 여부
  separator?: boolean;
}

export default function CustomHeader({
  title,
  cancel,
  isCommit,
  commit,
  separator,
}: CustomHeaderProps) {
  return (
    <View
      aria-label={`${title} header`}
      className={`relative z-0 flex h-14 w-full flex-row items-center ${separator ? "border-b border-[#DCDEE3]" : ""} px-4`}
    >
      {cancel ? (
        <Pressable
          onPress={cancel}
          className="h-12 w-[60px] items-start justify-center"
        >
          {isCommit ? <XIcon size={30} /> : <Chevron direction="left" />}
        </Pressable>
      ) : (
        <View className="h-12 w-[60px]" />
      )}

      <View className="absolute left-0 right-0 h-12 items-center justify-center">
        <Text className="text-[19px] font-semibold text-[#383535]">
          {title}
        </Text>
      </View>

      {isCommit ? (
        <View className="ml-auto">
          <Pressable
            onPress={commit ? commit : null}
            className="h-12 w-[60px] items-end justify-center"
          >
            <Text className="text-xl font-medium text-[#383535]">완료</Text>
          </Pressable>
        </View>
      ) : (
        <View className="ml-auto h-12 w-[60px]" />
      )}
    </View>
  );
}
