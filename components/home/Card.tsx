import { memo, useCallback } from "react";

import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import ContentImage from "@/components/ui/ContentImage";
import { formatAddress } from "@/utils/addressUtils";
import { formatShortDate } from "@/utils/dateUtils";

interface CustomContentItem {
  contentId: number;
  title: string;
  image: string;
  contentType: string;
  address: string;
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
}

function Card({ item }: { item: CustomContentItem }) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push(`/detail/${item.contentId}`);
  }, [router, item.contentId]);

  return (
    <Pressable className="flex-row" onPress={handlePress}>
      <ContentImage
        imageUrl={item.image}
        className="h-[90px] w-[120px]"
        rounded="rounded-[10px]"
      />
      <View className="ml-3.5 flex-1 justify-center">
        <Text
          className="mb-1 text-lg font-semibold leading-6 text-[#424242]"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="text-sm text-[#9E9E9E]">
          {formatAddress(item.address)}
        </Text>
        <Text className="text-sm text-[#707070]">
          {formatShortDate(item.startDate)} ~ {formatShortDate(item.endDate)}
        </Text>
      </View>
    </Pressable>
  );
}

export default memo(Card);
