import { useCallback, useRef, useState } from "react";

import { AxiosError } from "axios";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { setStatusBarStyle } from "expo-status-bar";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import CalendarEditIcon from "@/components/icons/CalendarEditIcon";
import DefaultProfileIcon from "@/components/icons/DefaultProfileIcon";
import DiaryIcon from "@/components/icons/DiaryIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import NewChevronRight from "@/components/icons/NewChevronRight";
import CommonModal from "@/components/ui/CommonModal";
import Separator from "@/components/ui/Separator";
import useUserStore, {
  useIsLoggedIn,
  useNickname,
  useProfileImage,
} from "@/stores/useUserStore";

export default function MyScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [statusModalMessage, setStatusModalMessage] = useState<string>("");
  const [showLoginPromptModal, setShowLoginPromptModal] =
    useState<boolean>(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState<string>("");

  const isFirstLoad = useRef<boolean>(true);

  const isLoggedIn = useIsLoggedIn();
  const nickname = useNickname();
  const profileImage = useProfileImage();

  const handleAuthAction = async () => {
    // 항상 로그아웃 확인 모달 표시
    setShowLogoutAlert(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      // 로그아웃 API 호출
      // const response = await authApi.post("/auth/logout");

      // 로컬 저장소에서 토큰 및 사용자 정보 삭제
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("nickname");
      await SecureStore.deleteItemAsync("profileImage");
      await SecureStore.deleteItemAsync("userRegions");

      const { clearUserInfo } = useUserStore.getState().action;
      clearUserInfo();

      setShowLogoutAlert(false);

      // 성공 모달 표시
      setStatusModalMessage("로그아웃이 완료되었습니다.");
      setShowStatusModal(true);

      // 모달 표시 후 화면 이동
      setTimeout(() => {
        setShowStatusModal(false);
        router.dismissAll();
        router.push("/");
      }, 1500);
    } catch (error) {
      const axiosError = error as AxiosError;
      setShowLogoutAlert(false);

      // 에러 모달 표시
      setStatusModalMessage(
        `로그아웃 도중 에러가 발생했습니다. ${axiosError.message}`,
      );
      setShowStatusModal(true);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutAlert(false);
  };

  // 화면 포커스 시 실행
  useFocusEffect(
    useCallback(() => {
      // StatusBar 스타일을 dark로 설정
      setStatusBarStyle("dark");

      // 모달 상태 초기화
      setShowStatusModal(false);
      setShowLogoutAlert(false);
      setShowLoginPromptModal(false);

      // SecureStore의 토큰을 확인하고 로그인 상태 동기화
      const checkLoginStatus = async () => {
        try {
          // 첫 로드일 때만 로딩 스피너 표시
          if (isFirstLoad.current) {
            setIsLoading(true);
          }

          const accessToken = await SecureStore.getItemAsync("accessToken");
          const refreshToken = await SecureStore.getItemAsync("refreshToken");

          const { setLoggedIn } = useUserStore.getState().action;

          if (accessToken && refreshToken) {
            setLoggedIn(true);

            // nickname과 profileImage도 SecureStore에서 불러와서 Store에 설정
            const storedNickname = await SecureStore.getItemAsync("nickname");
            const storedProfileImage =
              await SecureStore.getItemAsync("profileImage");

            const { setNickname, setProfileImage } =
              useUserStore.getState().action;

            if (storedNickname) {
              setNickname(storedNickname);
            }
            if (storedProfileImage) {
              setProfileImage(storedProfileImage);
            }
          } else {
            setLoggedIn(false);
          }
        } catch (error) {
          console.log("❌ 토큰 확인 중 에러:", error);
        } finally {
          if (isFirstLoad.current) {
            setIsLoading(false);
            isFirstLoad.current = false;
          }
        }
      };

      checkLoginStatus();
    }, []),
  );

  // 프로필 수정 버튼 클릭 핸들러
  const handleEditProfile = () => {
    if (!isLoggedIn) {
      setLoginPromptMessage("프로필을 수정하려면 먼저 로그인해주세요.");
      setShowLoginPromptModal(true);
      return;
    }
    router.push("/edit-profile");
  };

  // 프로필 이미지 결정 로직
  const getProfileImageSource = () => {
    if (!isLoggedIn) {
      return null;
    }
    return profileImage && profileImage.trim() !== "" ? profileImage : null;
  };

  // 닉네임 결정 로직
  const getDisplayName = () => {
    if (!isLoggedIn) {
      return "사용자";
    }
    return nickname || "사용자";
  };

  // 나의일정 버튼 클릭 핸들러
  const handlePlan = () => {
    if (!isLoggedIn) {
      setLoginPromptMessage("나의일정을 보려면 먼저 로그인해주세요.");
      setShowLoginPromptModal(true);
      return;
    }
    router.push("/plan");
  };

  // 관심목록 버튼 클릭 핸들러
  const handleLike = () => {
    if (!isLoggedIn) {
      setLoginPromptMessage("관심목록을 보려면 먼저 로그인해주세요.");
      setShowLoginPromptModal(true);
      return;
    }
    router.push("/like");
  };

  // 취향 분석하기 버튼 클릭 핸들러
  const handleSurvey = () => {
    if (!isLoggedIn) {
      setLoginPromptMessage("취향 분석을 하려면 먼저 로그인해주세요.");
      setShowLoginPromptModal(true);
      return;
    }
    router.push("/survey");
  };

  return (
    <View className="w-full flex-1 bg-white">
      <View className="h-14 items-center justify-center border-b border-[#DCDEE3] bg-white px-4">
        <Text className="text-center text-[19px] font-semibold text-[#212121]">
          마이페이지
        </Text>
      </View>

      {isLoggedIn ? (
        <View>
          <View
            aria-label="user-info"
            className="mt-4 flex h-[60px] flex-row px-4"
          >
            <View className="size-[60px] overflow-hidden rounded-full">
              {getProfileImageSource() ? (
                <Image
                  source={getProfileImageSource()}
                  style={{ width: 60, height: 60 }}
                />
              ) : (
                <DefaultProfileIcon size={60} />
              )}
            </View>
            <View className="ml-2 h-full justify-center p-2">
              <Text className="mr-1 text-xl font-medium">
                {getDisplayName()}
              </Text>
            </View>
          </View>

          <Pressable
            className="mx-4 mt-4 flex h-12 items-center justify-center rounded-lg bg-gray-100 active:bg-gray-200"
            onPress={handleEditProfile}
          >
            <Text className="text-base font-semibold text-[#424242]">
              프로필 수정
            </Text>
          </Pressable>

          <View className="mx-4 my-4 flex flex-row items-center justify-center rounded-lg bg-[#F2F3F6]">
            <Pressable
              onPress={handlePlan}
              className="m-2 flex h-[70px] w-[105px] items-center justify-center rounded-lg active:bg-gray-200"
            >
              <DiaryIcon />
              <Text className="mt-1.5 text-sm text-[#424242]">나의 일정</Text>
            </Pressable>
            <View
              aria-label="seperator"
              className="h-[20px] w-[1px] bg-[#DDDFE6]"
            />
            <Pressable
              onPress={handleLike}
              className="m-2 flex h-[70px] w-[105px] items-center justify-center rounded-lg active:bg-gray-200"
            >
              <HeartIcon />
              <Text className="mt-1.5 text-sm text-[#424242]">관심목록</Text>
            </Pressable>
            <View
              aria-label="seperator"
              className="h-[20px] w-[1px] bg-[#DDDFE6]"
            />
            <Pressable
              onPress={handleSurvey}
              className="m-2 flex h-[70px] w-[105px] items-center justify-center rounded-lg active:bg-gray-200"
            >
              <CalendarEditIcon />
              <Text className="mt-1.5 text-sm text-[#424242]">
                취향 분석하기
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View className="px-5 py-4">
          <View>
            <Text className="mb-1 text-2xl font-semibold text-[#212121]">
              내 코드에 딱 맞는 문화생활,
            </Text>
            <Text className="mb-3.5 text-2xl font-semibold text-[#212121]">
              마이코드와 함께하세요!
            </Text>
            <Pressable
              className="flex h-16 w-full items-center justify-center rounded-xl bg-[#6C4DFF] px-6 active:bg-[#5638E6]"
              onPress={() => {
                router.dismissAll();
                router.push("/");
              }}
            >
              <Text className="text-center text-xl font-semibold text-white">
                로그인 / 회원가입
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      <View
        aria-label="seperator"
        className="my-2 h-[12px] w-full bg-[#F2F2F7]"
      />

      <View className="w-full gap-y-1 px-4">
        <Pressable
          onPress={() => router.push("/terms")}
          className="flex h-14 w-full flex-row items-center justify-between rounded-lg px-2 active:bg-gray-100"
        >
          <Text className="text-lg">이용약관</Text>
          <NewChevronRight />
        </Pressable>
        <Separator />
        {isLoggedIn && (
          <>
            <Pressable
              onPress={handleAuthAction}
              className="flex h-14 w-full flex-row items-center justify-between rounded-lg px-2 active:bg-gray-100"
            >
              <Text className="text-lg">로그아웃</Text>
              <NewChevronRight />
            </Pressable>
            <Separator />
          </>
        )}
        {isLoggedIn && (
          <Pressable
            onPress={() => router.push("/my/withdrawal")}
            className="flex h-14 w-full flex-row items-center justify-between rounded-lg px-2 active:bg-gray-100"
          >
            <Text className="text-lg">회원탈퇴</Text>
            <NewChevronRight />
          </Pressable>
        )}
      </View>

      {/* 로딩 스피너 */}
      {isLoading && (
        <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#6C4DFF" />
        </View>
      )}

      {/* 로그아웃 확인 모달 */}
      <CommonModal
        visible={showLogoutAlert && !showStatusModal}
        onClose={handleLogoutCancel}
        mainTitle="로그아웃 하시겠어요?"
        subTitle="언제든지 다시 로그인할 수 있어요."
        cancelText="취소"
        confirmText="로그아웃"
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      {/* 로그아웃 상태 모달 */}
      <CommonModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        mainTitle={statusModalMessage}
        showSubTitle={false}
        showCancelButton={false}
        confirmText="확인"
        onConfirm={() => setShowStatusModal(false)}
      />

      {/* 로그인 프롬프트 모달 */}
      <CommonModal
        visible={showLoginPromptModal}
        onClose={() => setShowLoginPromptModal(false)}
        mainTitle="로그인이 필요합니다"
        subTitle={loginPromptMessage}
        cancelText="취소"
        confirmText="로그인하러 가기"
        onCancel={() => setShowLoginPromptModal(false)}
        onConfirm={() => {
          setShowLoginPromptModal(false);
          router.push("/");
        }}
      />
    </View>
  );
}
