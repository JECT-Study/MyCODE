import React, { memo, useCallback, useEffect, useState } from "react";

import { useRouter } from "expo-router";
import { GestureResponderEvent, Pressable, Text, View } from "react-native";

import HeartFilledIcon from "@/components/icons/HeartFilledIcon";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import ContentImage from "@/components/ui/ContentImage";
import Separator from "@/components/ui/Separator";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import { useIsLoggedIn } from "@/stores/useAuthStore";
import { formatAddress } from "@/utils/addressUtils";

interface infoInterface {
  contentId: number;
  title: string;
  address: string;
  start_date: string;
  end_date: string;
  img_url?: string;
  likeId?: number | null;
  likes?: number;
}

interface FavoriteContentItemProps {
  info: infoInterface;
  onLikeChange?: (
    contentId: number,
    isLiked: boolean,
    likeCount: number,
  ) => void;
  showSeparator?: boolean;
}

function FavoriteContentItem({
  info,
  onLikeChange,
  showSeparator = true,
}: FavoriteContentItemProps) {
  const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const isLoggedIn = useIsLoggedIn();

  const router = useRouter();

  // 초기 좋아요 상태 설정
  useEffect(() => {
    if (info) {
      setIsLiked(info.likeId !== null && info.likeId !== undefined);
    }
  }, [info]);

  // 상세 페이지로 이동
  const handlePress = useCallback(() => {
    router.push(`/detail/${info.contentId}`);
  }, [router, info.contentId]);

  // 좋아요 토글 함수
  const handleLikeToggle = useCallback(
    async (e: GestureResponderEvent) => {
      // 이벤트 전파 중지 (아이템 클릭 이벤트가 발생하지 않도록)
      e.stopPropagation();

      if (!info.contentId || isLikeLoading || !isLoggedIn) return;

      setIsLikeLoading(true);

      // 현재 좋아요 상태를 미리 저장
      const currentIsLiked = isLiked;

      try {
        let response;

        if (!currentIsLiked) {
          // 좋아요 추가
          response = await authApi.post(
            `${BACKEND_URL}/contents/${info.contentId}/favorites`,
          );
        } else {
          // 좋아요 취소
          response = await authApi.delete(
            `${BACKEND_URL}/contents/${info.contentId}/favorites`,
          );
        }

        if (response.data.isSuccess) {
          // UI 상태 업데이트
          setIsLiked(!currentIsLiked);

          // 부모 컴포넌트에 변경사항 알리기
          if (onLikeChange) {
            onLikeChange(info.contentId, !currentIsLiked, 0);
          }
        }
      } catch (error) {
        console.error("좋아요 오류:", error);
      } finally {
        setIsLikeLoading(false);
      }
    },
    [info.contentId, isLikeLoading, isLoggedIn, isLiked, onLikeChange],
  );

  return (
    <>
      <Pressable
        className="flex-row"
        onPress={handlePress}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        <ContentImage
          imageUrl={info.img_url}
          className="h-[92px] w-[92px]"
          rounded="rounded-[4px]"
        />
        <View className="ml-3.5 mr-2 flex-1">
          <Text
            className="text-lg font-semibold leading-normal text-[#111]"
            numberOfLines={2}
          >
            {info.title}
          </Text>
          <Text className="text-[13px] leading-[1.4] text-[#9E9E9E]">
            {formatAddress(info.address)}
          </Text>
          <Text className="text-[13px] leading-normal text-[#6D6D6D]">
            {info.start_date} - {info.end_date}
          </Text>
        </View>
        <View className="items-center justify-center">
          <Pressable
            className="items-center justify-center"
            style={({ pressed }) => [
              {
                opacity: !isLoggedIn || isLikeLoading ? 0.5 : pressed ? 0.7 : 1,
              },
            ]}
            onPress={handleLikeToggle}
            disabled={!isLoggedIn || isLikeLoading}
          >
            {isLiked ? (
              <HeartFilledIcon
                size={28}
                color={!isLoggedIn ? "#BDBDBD" : undefined}
              />
            ) : (
              <HeartOutlineIcon
                size={28}
                color={!isLoggedIn ? "#BDBDBD" : undefined}
              />
            )}
          </Pressable>
        </View>
      </Pressable>
      {showSeparator && (
        <View className="py-5">
          <Separator />
        </View>
      )}
    </>
  );
}

export default memo(FavoriteContentItem);
