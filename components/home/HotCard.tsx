import { memo, useCallback } from "react";

import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import ContentImage from "@/components/ui/ContentImage";
import { formatAddress } from "@/utils/addressUtils";

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

const CATEGORY_CONFIG = [
  { id: "PERFORMANCE", label: "공연" },
  { id: "EXHIBITION", label: "전시" },
  { id: "FESTIVAL", label: "축제" },
  { id: "EVENT", label: "행사" },
] as const;

const getContentTypeLabel = (contentType: string): string => {
  const categoryItem = CATEGORY_CONFIG.find(
    (config) => config.id === contentType,
  );
  return categoryItem ? categoryItem.label : "기타";
};

function HotCard({ item }: { item: CustomContentItem }) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push(`/detail/${item.contentId}`);
  }, [router, item.contentId]);

  return (
    <Pressable className="w-[154px]" onPress={handlePress}>
      <ContentImage
        imageUrl={item.image}
        className="h-[154px] w-[154px]"
        rounded="rounded-[14px]"
      />
      <View className="mt-2">
        <View className="mb-2 flex h-7 justify-center self-start rounded-full border border-[#E0E0E0] bg-white px-3">
          <Text className="text-sm font-medium text-[#707070]">
            {getContentTypeLabel(item.contentType)}
          </Text>
        </View>
        <Text
          className="mb-1.5 text-lg font-semibold leading-6 text-[#424242]"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="text-sm text-[#9E9E9E]" numberOfLines={1}>
          {formatAddress(item.address)}
        </Text>
      </View>
    </Pressable>
  );
}

export default memo(HotCard);
