import { useState } from "react";

import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { formatAddress } from "@/utils/addressUtils";
import { formatShortDate } from "@/utils/dateUtils";

interface WeeklyContentItem {
  contentId: number;
  title: string;
  image: string | null;
  address: string;
  startDate: string;
  endDate: string;
}

export default function WeeklyCard({ item }: { item: WeeklyContentItem }) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePress = () => router.push(`/detail/${item.contentId}`);

  const hasImage = item.image && item.image.trim() !== "";
  const imageSource = hasImage
    ? { uri: item.image }
    : require("../../assets/images/content_placeholder.png");

  return (
    <Pressable className="flex-row" onPress={handlePress}>
      <View className="relative h-[90px] w-[120px] overflow-hidden rounded-lg">
        {hasImage ? (
          <>
            {/* Placeholder 이미지 - 항상 표시 */}
            <Image
              source={require("../../assets/images/content_placeholder.png")}
              className="absolute inset-0 h-full w-full rounded-lg"
              resizeMode="cover"
            />
            {/* API 이미지 - 로딩 완료 시 표시 */}
            <Image
              source={imageSource}
              className={`absolute inset-0 h-full w-full rounded-lg ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
          </>
        ) : (
          /* 이미지가 없는 경우 placeholder만 표시 */
          <Image
            source={imageSource}
            className="absolute inset-0 h-full w-full rounded-lg"
            resizeMode="cover"
          />
        )}
      </View>
      <View className="ml-3.5 flex-1">
        <Text
          className="mb-1 text-lg font-semibold leading-6 text-[#424242]"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="text-sm font-normal text-[#9E9E9E]">
          {formatAddress(item.address)}
        </Text>
        <Text className="text-sm font-normal text-[#707070]">
          {formatShortDate(item.startDate)} ~ {formatShortDate(item.endDate)}
        </Text>
      </View>
    </Pressable>
  );
}
