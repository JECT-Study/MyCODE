import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { LoginResponse, UserRegion } from "@/types/user";

interface AuthState {
  // 상태 (AsyncStorage에 persist됨)
  nickname: string;
  profileImage: string;
  userRegions: UserRegion[];
  isLoggedIn: boolean;

  // hydration 상태 (persist 안됨)
  _hasHydrated: boolean;
}

interface AuthActions {
  // 동기 액션
  setUserInfo: (
    nickname: string,
    profileImage: string,
    userRegions?: UserRegion[],
  ) => void;
  setNickname: (nickname: string) => void;
  setProfileImage: (profileImage: string) => void;
  setUserRegions: (userRegions: UserRegion[]) => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  clearUserInfo: () => void;

  // 비동기 액션 (토큰은 SecureStore에 저장)
  login: (loginData: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // 초기 상태
      nickname: "",
      profileImage: "",
      userRegions: [],
      isLoggedIn: false,
      _hasHydrated: false,

      // 동기 액션
      setUserInfo: (nickname, profileImage, userRegions = []) =>
        set({ nickname, profileImage, userRegions, isLoggedIn: true }),
      setNickname: (nickname) => set({ nickname }),
      setProfileImage: (profileImage) => set({ profileImage }),
      setUserRegions: (userRegions) => set({ userRegions }),
      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      clearUserInfo: () =>
        set({
          nickname: "",
          profileImage: "",
          userRegions: [],
          isLoggedIn: false,
        }),

      // 로그인: 토큰은 SecureStore, 나머지는 상태 업데이트 (자동 persist)
      login: async (loginData) => {
        const {
          accessToken,
          refreshToken,
          nickname,
          image,
          userRegions = [],
        } = loginData;

        // 토큰만 SecureStore에 저장
        await Promise.all([
          SecureStore.setItemAsync("accessToken", accessToken),
          SecureStore.setItemAsync("refreshToken", refreshToken),
        ]);

        // 사용자 정보는 Zustand 상태로 (자동으로 AsyncStorage에 persist)
        set({
          isLoggedIn: true,
          nickname: nickname || "",
          profileImage: image || "",
          userRegions,
        });
      },

      // 로그아웃: SecureStore 토큰 삭제 + 상태 초기화
      logout: async () => {
        await Promise.all([
          SecureStore.deleteItemAsync("accessToken"),
          SecureStore.deleteItemAsync("refreshToken"),
        ]);

        set({
          isLoggedIn: false,
          nickname: "",
          profileImage: "",
          userRegions: [],
        });
      },

      // 토큰 존재 여부로 인증 상태 확인 + 기존 데이터 마이그레이션
      checkAuthStatus: async () => {
        try {
          const [accessToken, refreshToken] = await Promise.all([
            SecureStore.getItemAsync("accessToken"),
            SecureStore.getItemAsync("refreshToken"),
          ]);
          const isAuthenticated = !!(accessToken && refreshToken);

          // 토큰이 있는데 isLoggedIn이 false인 경우 (마이그레이션 필요)
          if (isAuthenticated && !get().isLoggedIn) {
            // 기존 SecureStore에서 사용자 정보 로드
            const [nickname, profileImage, userRegionsStr] = await Promise.all([
              SecureStore.getItemAsync("nickname"),
              SecureStore.getItemAsync("profileImage"),
              SecureStore.getItemAsync("userRegions"),
            ]);

            const userRegions = userRegionsStr
              ? JSON.parse(userRegionsStr)
              : [];

            // 새 시스템으로 마이그레이션
            set({
              isLoggedIn: true,
              nickname: nickname || "",
              profileImage: profileImage || "",
              userRegions,
            });

            // 마이그레이션 완료 후 SecureStore에서 사용자 정보 삭제 (토큰은 유지)
            await Promise.all([
              SecureStore.deleteItemAsync("nickname"),
              SecureStore.deleteItemAsync("profileImage"),
              SecureStore.deleteItemAsync("userRegions"),
            ]);
          }

          // 토큰이 없으면 상태도 초기화
          if (!isAuthenticated && get().isLoggedIn) {
            set({ isLoggedIn: false });
          }

          return isAuthenticated;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // _hasHydrated는 persist하지 않음
      partialize: (state) => ({
        nickname: state.nickname,
        profileImage: state.profileImage,
        userRegions: state.userRegions,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

// Selectors
export const useNickname = () => useAuthStore((s) => s.nickname);
export const useProfileImage = () => useAuthStore((s) => s.profileImage);
export const useUserRegions = () => useAuthStore((s) => s.userRegions);
export const useIsLoggedIn = () => useAuthStore((s) => s.isLoggedIn);
export const useHasHydrated = () => useAuthStore((s) => s._hasHydrated);

// Actions (훅으로 사용)
export const useSetUserInfo = () => useAuthStore((s) => s.setUserInfo);
export const useSetNickname = () => useAuthStore((s) => s.setNickname);
export const useSetProfileImage = () => useAuthStore((s) => s.setProfileImage);
export const useSetUserRegions = () => useAuthStore((s) => s.setUserRegions);
export const useSetLoggedIn = () => useAuthStore((s) => s.setLoggedIn);
export const useClearUserInfo = () => useAuthStore((s) => s.clearUserInfo);

// Actions (컴포넌트 외부에서 사용)
export const authActions = {
  login: (data: LoginResponse) => useAuthStore.getState().login(data),
  logout: () => useAuthStore.getState().logout(),
  checkAuthStatus: () => useAuthStore.getState().checkAuthStatus(),
  setUserRegions: (regions: UserRegion[]) =>
    useAuthStore.getState().setUserRegions(regions),
  setNickname: (nickname: string) =>
    useAuthStore.getState().setNickname(nickname),
  setProfileImage: (image: string) =>
    useAuthStore.getState().setProfileImage(image),
};

export default useAuthStore;
