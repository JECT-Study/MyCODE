import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

import useUserStore, { UserRegion } from "@/stores/useUserStore";

/**
 * 로그인 응답 데이터 타입
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  nickname?: string;
  image?: string;
  userRegions?: UserRegion[];
}

/**
 * 로그인 성공 후 공통 처리 (핵심 로직)
 * - SecureStore에 토큰 및 사용자 정보 저장
 * - Zustand 스토어 업데이트
 * - 리다이렉트는 호출하는 곳에서 처리
 */
export const handleLoginSuccess = async (
  loginData: LoginResponse,
): Promise<void> => {
  const {
    accessToken,
    refreshToken,
    nickname,
    image,
    userRegions = [],
  } = loginData;

  await SecureStore.setItemAsync("accessToken", accessToken);
  await SecureStore.setItemAsync("refreshToken", refreshToken);

  await SecureStore.setItemAsync("nickname", nickname || "");
  await SecureStore.setItemAsync("profileImage", image || "");
  await SecureStore.setItemAsync("userRegions", JSON.stringify(userRegions));

  const { setUserInfo } = useUserStore.getState().action;
  setUserInfo(nickname || "", image || "", userRegions);
};

/**
 * 로그인 에러 처리
 * - 2404 에러(탈퇴한 사용자)인 경우 알림 표시
 */
export const handleLoginError = (error: any): void => {
  if (error?.response?.data?.code === 2404) {
    const message =
      error.response?.data?.message || "이미 탈퇴한 사용자입니다.";
    Alert.alert("로그인 오류", message);
  }
};

/**
 * 로그아웃 처리
 * - SecureStore에서 모든 인증 정보 삭제
 * - Zustand 스토어 초기화
 * - 리다이렉트는 호출하는 곳에서 처리
 */
export const handleLogout = async (): Promise<void> => {
  await Promise.all([
    SecureStore.deleteItemAsync("accessToken"),
    SecureStore.deleteItemAsync("refreshToken"),
    SecureStore.deleteItemAsync("nickname"),
    SecureStore.deleteItemAsync("profileImage"),
    SecureStore.deleteItemAsync("userRegions"),
  ]);

  const { clearUserInfo } = useUserStore.getState().action;
  clearUserInfo();
};

/**
 * 인증 상태 확인
 * - SecureStore에서 토큰 확인
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    return !!(accessToken && refreshToken);
  } catch (error) {
    console.error("인증 상태 확인 실패:", error);
    return false;
  }
};

/**
 * SecureStore에서 사용자 정보 로드
 */
export const loadUserInfo = async (): Promise<{
  nickname: string;
  profileImage: string;
  userRegions: UserRegion[];
}> => {
  try {
    const nickname = await SecureStore.getItemAsync("nickname");
    const profileImage = await SecureStore.getItemAsync("profileImage");
    const regionsStr = await SecureStore.getItemAsync("userRegions");

    return {
      nickname: nickname || "",
      profileImage: profileImage || "",
      userRegions: regionsStr ? JSON.parse(regionsStr) : [],
    };
  } catch (error) {
    console.error("사용자 정보 로드 실패:", error);
    return { nickname: "", profileImage: "", userRegions: [] };
  }
};
