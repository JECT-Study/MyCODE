import "@/global.css";
import { useEffect, useState } from "react";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { AppState, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "react-native-reanimated";

import ErrorBoundary from "@/components/error/ErrorBoundary";
import { useColorScheme } from "@/hooks/useColorScheme";
import { logScreenView } from "@/utils/analytics";

// 전역 플래그로 초기 URL 처리 중복 방지
let initialURLProcessed = false;

SplashScreen.setOptions({
  // duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const [loaded] = useFonts({
    Pretendard: require("pretendard/dist/public/static/Pretendard-Regular.otf"),
    "Pretendard-Bold": require("pretendard/dist/public/static/Pretendard-Bold.otf"),
    "Pretendard-SemiBold": require("pretendard/dist/public/static/Pretendard-SemiBold.otf"),
    "Pretendard-Medium": require("pretendard/dist/public/static/Pretendard-Medium.otf"),
    "Pretendard-Light": require("pretendard/dist/public/static/Pretendard-Light.otf"),
  });
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // 최소 1초 타이머 설정 (딥링크가 아닐 때만)
  useEffect(() => {
    const checkInitialUrlAndSetTimer = async () => {
      const url = await Linking.getInitialURL();
      const isDeepLink = url && url.includes("kakaolink");

      if (isDeepLink) {
        // 딥링크로 실행된 경우 즉시 설정
        setMinTimeElapsed(true);
      } else {
        // 일반 실행인 경우 1초 지연
        const timer = setTimeout(() => {
          setMinTimeElapsed(true);
        }, 1000);

        return () => clearTimeout(timer);
      }
    };

    checkInitialUrlAndSetTimer();
  }, []);

  // 폰트 로딩과 최소 시간이 모두 완료되면 스플래시 숨기기
  useEffect(() => {
    if (loaded && minTimeElapsed) {
      SplashScreen.hideAsync();
    }
  }, [loaded, minTimeElapsed]);

  // 화면 추적
  useEffect(() => {
    if (pathname) {
      const screenName = segments.join("/") || "index";
      logScreenView(screenName);
    }
  }, [pathname, segments]);

  // 앱이 이미 실행 중일 때만 딥링크 처리
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      const parsed = Linking.parse(url);

      // 카카오 딥링크 처리: kakao[앱키]://kakaolink?target=detail&id=123
      if (parsed.hostname === "kakaolink" && parsed.queryParams) {
        const { target, id } = parsed.queryParams;

        if (target === "detail" && id) {
          // 앱이 백그라운드에서 실행 중일 때는 활성화될 때까지 대기
          const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === "active") {
              router.push(`/detail/${id}`);
              subscription.remove();
            }
          };
          const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange,
          );
        }
      }
    };

    // 앱이 이미 실행 중일 때 딥링크 처리
    const subscription = Linking.addEventListener("url", (e) => {
      handleDeepLink(e.url);
    });

    return () => subscription?.remove();
  }, [router]);

  // 앱이 종료된 상태에서 딥링크로 실행될 때만 처리
  useEffect(() => {
    if (!initialURLProcessed) {
      initialURLProcessed = true;

      const handleInitialURL = async () => {
        const url = await Linking.getInitialURL();
        if (url) {
          const parsed = Linking.parse(url);

          // 카카오 딥링크 처리: kakao[앱키]://kakaolink?target=detail&id=123
          if (parsed.hostname === "kakaolink" && parsed.queryParams) {
            const { target, id } = parsed.queryParams;

            if (target === "detail" && id) {
              // 약간의 딜레이 후 네비게이션 (KakaoLink 처리 완료 대기)
              setTimeout(() => {
                router.push(`/detail/${id}`);
              }, 500);
            }
          }
        }
      };

      handleInitialURL();
    }
  }, [router]);

  if (!loaded || !minTimeElapsed) {
    // 폰트 로딩이 완료되지 않았거나 최소 시간이 경과하지 않은 경우
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView>
        <ActionSheetProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <StatusBar style="light" />
            <View
              style={{
                flex: 1,
                alignItems: "center",
                backgroundColor: "#FFFFFF",
              }}
            >
              <View
                style={{
                  width: "100%",
                  maxWidth: 500,
                  flex: 1,
                }}
              >
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="survey/index"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false, gestureEnabled: false }}
                  />
                  <Stack.Screen
                    name="+not-found"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="my/withdrawal"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="my/terms/service_terms"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="my/terms/service_privacy"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="my/terms/service_location"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="search-keywords/index"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="search-results/index"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="detail/[id]"
                    options={{
                      headerShown: false,
                      presentation: "card",
                    }}
                  />
                  <Stack.Screen
                    name="edit-profile/index"
                    options={{
                      headerShown: false,
                      presentation: "card",
                    }}
                  />
                  <Stack.Screen
                    name="plan/index"
                    options={{
                      headerShown: false,
                      presentation: "card",
                    }}
                  />
                  <Stack.Screen
                    name="like/index"
                    options={{
                      headerShown: false,
                      presentation: "card",
                    }}
                  />
                  <Stack.Screen
                    name="terms/index"
                    options={{
                      headerShown: false,
                      presentation: "card",
                    }}
                  />
                  <Stack.Screen
                    name="image-viewer/index"
                    options={{
                      headerShown: false,
                      presentation: "card",
                    }}
                  />
                </Stack>
              </View>
            </View>
          </ThemeProvider>
        </ActionSheetProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

// let AppEntryPoint = RootLayout;
