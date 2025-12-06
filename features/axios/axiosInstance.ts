import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { RESPONSE_CODES } from "@/features/axios/responseCodes";
import { handleLogout } from "@/utils/authUtils";

const baseURL = Constants.expoConfig?.extra?.BACKEND_URL ?? "";

export const publicApi = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    indexes: null, // regions[]=값 대신 regions=값 형식으로 변환
  },
});

// 토큰 갱신 중복 방지를 위한 변수들
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

authApi.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error("토큰 조회 실패:", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errorCode = error.response?.data?.code;
    const httpStatus = error.response?.status;

    // 토큰 만료 처리 - 갱신 시도
    // 1. 4011(TOKEN_EXPIRED) 에러
    // 2. 401 Unauthorized 에러 (백엔드가 토큰 만료를 401로 반환하는 경우)
    // 3. 500 에러 중 인증 관련 에러
    const shouldRefreshToken =
      (errorCode === RESPONSE_CODES.TOKEN_EXPIRED ||
        httpStatus === 401 ||
        (httpStatus === 500 && errorCode === 4000)) &&
      !originalRequest._retry;

    if (shouldRefreshToken) {
      // 이미 토큰 갱신 중이면 큐에 추가하고 대기
      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return await authApi(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) {
          throw new Error("리프레시 토큰이 없습니다.");
        }

        // 리프레시 토큰으로 새 액세스 토큰 요청 (헤더로 전달)
        const refreshResponse = await publicApi.post(
          "/auth/token/refresh",
          {},
          {
            headers: {
              RefreshToken: refreshToken,
            },
          },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.result;

        // 새 토큰 저장
        if (newAccessToken) {
          await SecureStore.setItemAsync("accessToken", newAccessToken);
        } else {
          throw new Error("새로운 액세스 토큰을 받지 못했습니다.");
        }

        if (newRefreshToken) {
          await SecureStore.setItemAsync("refreshToken", newRefreshToken);
        }

        // 원래 요청에 새 토큰 적용하여 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 대기 중인 요청들에 새 토큰 전달
        processQueue(null, newAccessToken);

        return await authApi(originalRequest);
      } catch (refreshError) {
        const refreshErrorCode = (refreshError as any).response?.data?.code;

        // 대기 중인 요청들에 에러 전달
        processQueue(refreshError, null);

        // 인증 관련 에러 시 로그아웃 처리
        const authErrorCodes = [
          RESPONSE_CODES.TOKEN_LOGGED_OUT,
          RESPONSE_CODES.INVALID_TOKEN,
          RESPONSE_CODES.UNAUTHORIZED,
          RESPONSE_CODES.TOKEN_EXPIRED,
        ];

        if (authErrorCodes.includes(refreshErrorCode)) {
          await handleLogout();
          router.replace("/");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 인증 오류 처리 - 즉시 로그아웃
    const immediateLogoutCodes = [
      RESPONSE_CODES.TOKEN_LOGGED_OUT,
      RESPONSE_CODES.INVALID_TOKEN,
      RESPONSE_CODES.UNAUTHORIZED,
    ];

    if (immediateLogoutCodes.includes(errorCode)) {
      await handleLogout();
      router.replace("/");
    }

    // 접근 권한 오류 처리
    const forbiddenErrorCodes = [
      RESPONSE_CODES.FORBIDDEN,
      RESPONSE_CODES.INACTIVE_USER,
    ];

    if (forbiddenErrorCodes.includes(errorCode)) {
      await handleLogout();
      router.replace("/");
    }

    return Promise.reject(error);
  },
);
