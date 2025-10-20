import { useState } from "react";

import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  LayoutChangeEvent,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import CommonModal from "@/components/ui/CommonModal";
import CustomHeader from "@/components/ui/CustomHeader";
import Separator from "@/components/ui/Separator";
import { WithdrawUrl } from "@/constants/ApiUrls";
import { reason } from "@/constants/WithDrawal";
import { authApi } from "@/features/axios/axiosInstance";
import useUserStore from "@/stores/useUserStore";

export default function Withdrawal() {
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const isOpen = useSharedValue(0);

  const toggle = () => {
    isOpen.value = withTiming(isOpen.value === 0 ? 1 : 0, {
      duration: 200,
      easing: Easing.ease,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: contentHeight > 0 ? isOpen.value * contentHeight : 0,
    overflow: "hidden",
  }));

  const onLayoutContent = (e: LayoutChangeEvent) => {
    setContentHeight(e.nativeEvent.layout.height);
  };

  const animatedArrowRotation = useAnimatedStyle(() => {
    const rotation = isOpen.value * 180;
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const checkSubmit = () => {
    if (selected === null) return false;
    if (selected === "기타") {
      return otherReason.length > 0;
    } else {
      return true;
    }
  };

  // 제출 버튼 클릭 시 확인 모달 표시
  const handleSubmitPress = () => {
    if (checkSubmit()) {
      setShowConfirmModal(true);
    }
  };

  // 회원탈퇴 확인 후 실행
  const handleWithdraw = async () => {
    setShowConfirmModal(false);
    try {
      await authApi.delete(WithdrawUrl);

      // 토큰 및 사용자 정보 삭제
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("nickname");
      await SecureStore.deleteItemAsync("profileImage");
      await SecureStore.deleteItemAsync("userRegions");

      // Store 초기화
      const { clearUserInfo } = useUserStore.getState().action;
      clearUserInfo();

      // 로그인 화면으로 이동
      router.replace("/");
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
    }
  };

  // 회원탈퇴 취소
  const handleCancelWithdraw = () => {
    setShowConfirmModal(false);
  };

  return (
    <SafeAreaView className="w-full flex-1 bg-white">
      <CustomHeader
        title="회원탈퇴"
        isCommit={false}
        separator
        cancel={() => router.back()}
      />
      <View className="flex-1 px-4">
        <Text className="my-7 text-xl font-medium">
          서비스를 탈퇴하는 이유가 궁금해요.
        </Text>

        <View className="relative flex-1">
          <View className="z-50 mb-4 w-full overflow-hidden rounded-xl border border-[#757575]">
            <Pressable
              onPress={toggle}
              className="flex h-16 flex-row items-center justify-between bg-white px-4 py-3"
            >
              {selected === null ? (
                <Text className="text-base text-[#BDBDBD]">
                  탈퇴 사유를 선택해주세요
                </Text>
              ) : (
                <Text className="text-base text-[#212121]">{selected}</Text>
              )}
              <Animated.View style={animatedArrowRotation}>
                <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <Path
                    d="M7.76314 11L12.5263 6.5H3L7.76314 11Z"
                    fill="#BDBDBD"
                  />
                </Svg>
              </Animated.View>
            </Pressable>

            <Animated.View style={animatedStyle}>
              <View onLayout={onLayoutContent} className="bg-white pt-px">
                <Separator color="#757575" />
                {reason.map((item, index) => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      setSelected(item);
                      toggle();
                    }}
                    className={`flex h-14 justify-center bg-white px-4 py-3 ${index !== reason.length - 1 ? "border-b-[1px] border-[#D9D9D9]" : ""}`}
                  >
                    <Text className="text-base text-[#212121]">{item}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          </View>

          <View className="absolute top-[80px] z-10 w-full">
            {selected === "기타" && (
              <TextInput
                placeholder="회원탈퇴 이유를 알려주세요."
                placeholderTextColor="#BDBDBD"
                className="h-[158px] w-full rounded-lg border-[1px] border-[#757575] bg-white p-4"
                onChangeText={setOtherReason}
                value={otherReason}
                multiline
                textAlignVertical="top"
              />
            )}
          </View>

          <View
            className={`absolute ${selected === "기타" ? "top-[250px]" : "top-[96px]"}`}
          >
            <Text className="text-base font-normal text-[#424242]">
              소중한 의견을 반영하여
            </Text>
            <Text className="text-base font-normal text-[#424242]">
              더 좋은 서비스로 보답하겠습니다.
            </Text>
          </View>
        </View>

        <View className="pb-8">
          <Pressable
            className={`flex h-16 w-full items-center justify-center rounded-lg ${
              checkSubmit()
                ? "bg-[#EF4444] active:bg-[#DC2626]"
                : "bg-[#E0E0E0]"
            }`}
            onPress={handleSubmitPress}
            disabled={!checkSubmit()}
          >
            <Text className="text-center text-xl font-semibold text-white">
              제출
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 회원탈퇴 확인 모달 */}
      <CommonModal
        visible={showConfirmModal}
        onClose={handleCancelWithdraw}
        mainTitle="정말 탈퇴하시겠어요?"
        subTitle="탈퇴 시 모든 데이터가 삭제되며 복구할 수 없어요."
        cancelText="취소"
        confirmText="탈퇴"
        onCancel={handleCancelWithdraw}
        onConfirm={handleWithdraw}
        confirmButtonColor="danger"
      />
    </SafeAreaView>
  );
}
