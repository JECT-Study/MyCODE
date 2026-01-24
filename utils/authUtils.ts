import { Alert } from "react-native";

/**
 * 로그인 에러 처리
 * - 2404 에러(탈퇴한 사용자)인 경우 알림 표시
 */
export const handleLoginError = (error: unknown): void => {
  const axiosError = error as {
    response?: { data?: { code?: number; message?: string } };
  };

  if (axiosError?.response?.data?.code === 2404) {
    const message =
      axiosError.response?.data?.message || "이미 탈퇴한 사용자입니다.";
    Alert.alert("로그인 오류", message);
  }
};
