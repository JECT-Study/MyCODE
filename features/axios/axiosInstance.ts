import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const baseURL = Constants.expoConfig?.extra?.BACKEND_URL ?? "";

const ERROR_CODES = {
  // 인증 관련
  TOKEN_LOGGED_OUT: 2401, // 로그아웃된 토큰
  INACTIVE_USER: 2404, // 탈퇴한 사용자
  INVALID_TOKEN: 4004, // 유효하지 않은 토큰
  UNAUTHORIZED: 4010, // 인증 필요
  TOKEN_EXPIRED: 4011, // 토큰 만료
  FORBIDDEN: 4030, // 접근 권한 없음
} as const;

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
      } else {
        console.log("액세스 토큰이 없습니다. 로그인이 필요할 수 있습니다.");
      }
    } catch (error) {
      console.error("토큰 조회 실패:", error);
    }
    return config;
  },
  (error) => {
    console.error("Request 인터셉터 에러:", error);
    return Promise.reject(error);
  },
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
    if (errorCode === ERROR_CODES.TOKEN_EXPIRED && !originalRequest._retry) {
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
        console.log("토큰 갱신:", {
          reason: "토큰 만료 (4011)",
          backendCode: ERROR_CODES.TOKEN_EXPIRED,
          action: "리프레시 토큰으로 갱신 시도",
        });

        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) {
          throw new Error("리프레시 토큰이 없습니다.");
        }

        // 리프레시 토큰으로 새 액세스 토큰 요청
        const refreshResponse = await publicApi.post("/auth/token/refresh", {
          refreshToken,
        });

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

        console.log("토큰 갱신 성공:", {
          action: "원래 요청 재시도",
          url: originalRequest.url,
        });
        return await authApi(originalRequest);
      } catch (refreshError) {
        const refreshErrorCode = (refreshError as any).response?.data?.code;
        const refreshHttpStatus = (refreshError as any).response?.status;

        console.error("토큰 갱신 실패:", {
          httpStatus: refreshHttpStatus,
          backendCode: refreshErrorCode,
          message: (refreshError as any).response?.data?.message,
        });

        // 대기 중인 요청들에 에러 전달
        processQueue(refreshError, null);

        // 인증 관련 에러 시 로그아웃 처리
        const authErrorCodes = [
          ERROR_CODES.TOKEN_LOGGED_OUT,
          ERROR_CODES.INVALID_TOKEN,
          ERROR_CODES.UNAUTHORIZED,
          ERROR_CODES.TOKEN_EXPIRED,
        ];

        if (authErrorCodes.includes(refreshErrorCode)) {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          await SecureStore.deleteItemAsync("nickname");
          await SecureStore.deleteItemAsync("profileImage");
          await SecureStore.deleteItemAsync("userRegions");

          console.log("로그아웃:", {
            reason: "토큰 갱신 실패",
            httpStatus: refreshHttpStatus,
            backendCode: refreshErrorCode,
            action: "로그인 페이지로 이동",
          });
          router.replace("/");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 인증 오류 처리 - 즉시 로그아웃
    const immediateLogoutCodes = [
      ERROR_CODES.TOKEN_LOGGED_OUT,
      ERROR_CODES.INVALID_TOKEN,
      ERROR_CODES.UNAUTHORIZED,
    ];

    if (immediateLogoutCodes.includes(errorCode)) {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      console.log("로그아웃:", {
        reason: "인증 오류",
        httpStatus,
        backendCode: errorCode,
        action: "로그인 페이지로 이동",
      });
      router.replace("/");
    }

    // 접근 권한 오류 처리
    const forbiddenErrorCodes = [
      ERROR_CODES.FORBIDDEN,
      ERROR_CODES.INACTIVE_USER,
    ];

    if (forbiddenErrorCodes.includes(errorCode)) {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      console.log("로그아웃:", {
        reason: "접근 권한 오류",
        httpStatus,
        backendCode: errorCode,
        action: "로그인 페이지로 이동",
      });
      router.replace("/");
    }

    // 에러 상세 정보 로깅
    console.error("API 에러 발생:", {
      httpStatus, // HTTP 상태 코드 (3자리)
      backendCode: errorCode, // 백엔드 커스텀 에러 코드 (4자리)
      message: error.response?.data?.message,
      isSuccess: error.response?.data?.isSuccess,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    });

    return Promise.reject(error);
  },
);
