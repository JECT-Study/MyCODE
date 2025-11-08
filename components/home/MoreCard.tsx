import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import ContentImage from "@/components/ui/ContentImage";
import { formatShortDate } from "@/utils/dateUtils";

interface CategoryContentItem {
  contentId: number;
  title: string;
  image: string | null;
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
}

export default function MoreCard({ item }: { item: CategoryContentItem }) {
  const router = useRouter();

  const handlePress = () => router.push(`/detail/${item.contentId}`);

  return (
    <Pressable className="w-[154px]" onPress={handlePress}>
      <ContentImage
        imageUrl={item.image}
        className="h-[92px] w-full"
        rounded="rounded-[14px]"
      />
      <View className="mt-2">
        <Text
          className="text-lg font-semibold leading-6 text-[#424242]"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="mb-2 text-sm font-normal text-[#BDBDBD]">
          {formatShortDate(item.startDate)} ~ {formatShortDate(item.endDate)}
        </Text>
        {/* response에 주소가 없어서 임시 주석처리 */}
        {/* <View className="mb-2 flex h-7 justify-center self-start rounded-full border border-[#E0E0E0] bg-white px-3">
          <Text className="text-sm font-medium text-[#707070]">
            경기 남양주시
          </Text>
        </View> */}
      </View>
    </Pressable>
  );
}
