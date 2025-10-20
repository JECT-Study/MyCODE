import { useState } from "react";

import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

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
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePress = () => router.push(`/detail/${item.contentId}`);

  const formatDate = (date: string) => dayjs(date).format("YY.MM.DD");

  const hasImage = item.image && item.image.trim() !== "";
  const imageSource = hasImage
    ? { uri: item.image }
    : require("../../assets/images/content_placeholder.png");

  return (
    <Pressable className="w-[154px]" onPress={handlePress}>
      <View className="relative h-[92px] w-full overflow-hidden rounded-[14px]">
        {hasImage ? (
          <>
            {/* Placeholder 이미지 - 항상 표시 */}
            <Image
              source={require("../../assets/images/content_placeholder.png")}
              className="absolute inset-0 h-full w-full rounded-[14px]"
              resizeMode="cover"
            />
            {/* API 이미지 - 로딩 완료 시 표시 */}
            <Image
              source={imageSource}
              className={`absolute inset-0 h-full w-full rounded-[14px] ${
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
            className="absolute inset-0 h-full w-full rounded-[14px]"
            resizeMode="cover"
          />
        )}
      </View>
      <View className="mt-2">
        <Text
          className="text-lg font-semibold leading-6 text-[#424242]"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="mb-2 text-sm font-normal text-[#BDBDBD]">
          {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
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
