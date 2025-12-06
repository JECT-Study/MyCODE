import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login, me } from "@react-native-kakao/user";
import Constants from "expo-constants";
import { router } from "expo-router";

import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";
import { handleLoginError, handleLoginSuccess } from "@/utils/authUtils";

const kakaoNativeAppKey = Constants.expoConfig?.extra?.kakaoNativeAppKey ?? "";

// SDK 초기화 함수
export const initializeKakao = () => {
  const appKey = kakaoNativeAppKey;
  if (!appKey) {
    console.error("카카오 앱 키가 설정되지 않았습니다.");
    return;
  }

  initializeKakaoSDK(appKey);
};

// 카카오 로그인 함수
export const kakaoLogin = async () => {
  try {
    try {
      // 먼저 카카오톡 로그인 시도
      await login();
    } catch (kakaoError: any) {
      // 카카오톡이 설치되어 있지만 로그인이 안 되어 있는 경우 웹뷰로 재시도
      if (kakaoError.message?.includes("not connected to Kakao account")) {
        console.log("카카오톡 로그인 실패, 웹뷰로 재시도");
        await login({
          useKakaoAccountLogin: true, // 웹뷰로 로그인
        });
      } else {
        throw kakaoError; // 다른 에러는 그대로 throw
      }
    }

    const profile = await me();
    const id = profile.id;

    const response = await publicApi.post(LoginUrl, {
      socialId: id,
      socialType: "KAKAO",
    });

    await handleLoginSuccess(response.data.result);
    router.push("/(tabs)");
  } catch (error: any) {
    handleLoginError(error);
  }
};
