import React from "react";

import { Image, Pressable, Text, View } from "react-native";

import DotsIcon from "@/components/icons/DotsIcon";
import { ScheduleItemType } from "@/constants/ScheduleData";
import { formatDateRange } from "@/utils/dateUtils";

interface ScheduleItemProps {
  item: ScheduleItemType;
  onPress?: (contentId: number) => void;
  onMenuPress?: (contentId: number) => void;
  showMenuButton?: boolean;
}

export default function ScheduleItem({
  item,
  onPress,
  onMenuPress,
  showMenuButton = false,
}: ScheduleItemProps) {
  const hasImage = item.image && item.image.trim() !== "";
  const imageSource = hasImage
    ? { uri: item.image }
    : require("../../assets/images/content_placeholder.png");

  return (
    <Pressable
      onPress={() => onPress?.(item.contentId)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View className="flex-row gap-x-[18px]">
        <Image
          source={imageSource}
          className="h-[136px] w-[104px] rounded-lg"
          resizeMode="cover"
        />
        <View className="flex-1 py-2.5">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="mb-1 text-lg font-semibold text-[#212121]">
                {item.title}
              </Text>
            </View>
            {showMenuButton && (
              <Pressable
                onPress={() => onMenuPress?.(item.contentId)}
                className="px-3.5 py-1"
                hitSlop={8}
              >
                <DotsIcon size={4} color="#757575" />
              </Pressable>
            )}
          </View>
          <Text className="mb-1 text-[13px] font-normal text-[#9E9E9E]">
            {item.address}
          </Text>
          <Text className="text-[13px] font-normal text-[#424242]">
            {formatDateRange(item.startDate, item.endDate)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
