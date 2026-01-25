import { useCallback, useEffect, useRef, useState } from "react";

import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import {
  AppState,
  AppStateStatus,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppleIcon from "@/components/icons/AppleIcon";
import KakaoIcon from "@/components/icons/KakaoIcon";
import { loginImages, LoginImageType } from "@/constants/LoginImages";
import { AndroidAppleLogin, IOSAppleLogin } from "@/features/auth/appleLogin";
import { initializeKakao, kakaoLogin } from "@/features/auth/kakaoLogin";
import { useStatusBar } from "@/hooks/useStatusBar";
import { authActions } from "@/stores/useAuthStore";
import { logEvent } from "@/utils/analytics";

function LoginMarquee({
  imageList,
  direction,
  cardWidth,
  cardHeight,
}: {
  imageList: LoginImageType;
  direction: "down" | "up";
  cardWidth: number;
  cardHeight: number;
}) {
  const speed = direction === "down" ? -0.3 : 0.3;
  return (
    <Marquee direction="vertical" speed={speed} withGesture={false}>
      {imageList.map((imageInfo) => {
        const imageName = imageInfo[0];
        const imageSrc = imageInfo[1];
        return (
          <View
            key={imageName}
            style={{ width: cardWidth, height: cardHeight }}
            className="my-2 flex items-center justify-center overflow-hidden rounded-[26px]"
          >
            <Image
              source={imageSrc}
              style={{ width: "100%", height: "100%", opacity: 1 }}
              contentFit="cover"
            />
          </View>
        );
      })}
    </Marquee>
  );
}

function LoginCardSlider() {
  const { width } = useWindowDimensions();
  const images = Object.entries(loginImages);
  const leftImages = images.splice(0, Math.floor(images.length / 2));

  // 반응형 카드 크기 계산
  const HORIZONTAL_PADDING = 20 * 2; // 좌우 패딩 합계
  const COLUMN_GAP = 8;
  const cardWidth = (width - HORIZONTAL_PADDING - COLUMN_GAP) / 2;
  const ASPECT_RATIO = 240 / 176;
  const cardHeight = cardWidth * ASPECT_RATIO;

  return (
    <View className="flex flex-1 flex-row px-[18px]">
      <LoginMarquee
        imageList={leftImages}
        direction={"up"}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
      />
      <View className="m-2" />
      <LoginMarquee
        imageList={images}
        direction={"down"}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
      />
    </View>
  );
}

function KakaoLogin({ disabled = false }: { disabled?: boolean }) {
  useEffect(() => {
    initializeKakao();
  }, []);

  const handleKakaoLogin = () => {
    logEvent("login_button_click", { button_id: "kakao" });
    kakaoLogin();
  };

  return (
    <Pressable
      onPress={disabled ? undefined : handleKakaoLogin}
      disabled={disabled}
      className={`relative mx-auto h-16 w-full flex-row items-center justify-center rounded-xl bg-[#FEE700] px-6 ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <View className="absolute left-6">
        <KakaoIcon size={20} color="#3E1918" />
      </View>
      <Text className="text-lg font-medium text-black">
        카카오톡으로 시작하기
      </Text>
    </Pressable>
  );
}

function AppleLogin({ disabled = false }: { disabled?: boolean }) {
  const platformLogin =
    Platform.OS === "android" ? AndroidAppleLogin : IOSAppleLogin;

  const handleAppleLogin = () => {
    logEvent("login_button_click", { button_id: "apple" });
    platformLogin();
  };

  return (
    <Pressable
      onPress={disabled ? undefined : handleAppleLogin}
      disabled={disabled}
      className={`relative mx-auto h-16 w-full flex-row items-center justify-center rounded-xl bg-[#F6F6F9] px-6 ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <View className="absolute left-6">
        <AppleIcon size={20} color="black" />
      </View>
      <Text className="text-lg font-medium text-black">Apple로 시작하기</Text>
    </Pressable>
  );
}

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const appState = useRef(AppState.currentState);

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === "ios";

  useStatusBar("light");

  useFocusEffect(
    useCallback(() => {
      const checkTokens = async () => {
        const isAuthenticated = await authActions.checkAuthStatus();

        if (isAuthenticated) {
          setIsLoggedIn(true);
          router.push("/(tabs)");
        } else {
          setIsLoggedIn(false);
          logEvent("login_view");
        }
      };
      checkTokens();

      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (
          appState.current === "active" &&
          nextAppState.match(/inactive|background/)
        ) {
          logEvent("login_exit", { exit_type: "app_background" });
        }
        appState.current = nextAppState;
      };

      const subscription = AppState.addEventListener(
        "change",
        handleAppStateChange,
      );

      return () => {
        subscription.remove();
      };
    }, [router, setIsLoggedIn]),
  );

  return (
    <View className="flex-1 items-center bg-white">
      <LoginCardSlider />
      <View className="absolute inset-0 bg-black/80" />
      <View className="absolute top-1/3 z-10 flex -translate-y-1/2 items-center gap-y-2">
        <Image
          source={require("@/assets/images/mycode_logo.png")}
          style={{ width: 270, height: 68 }}
          contentFit="contain"
        />
      </View>

      <View className="z-10 w-full">
        <LinearGradient
          colors={[
            "rgba(85, 85, 85, 0)",
            "rgba(85, 85, 85, 0.5)",
            "rgba(85, 85, 85, 0.8)",
            "rgba(85, 85, 85, 0.95)",
            "#555555",
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ height: 60, width: "100%" }}
          pointerEvents="none"
        />
        <View className="bg-[#555555] px-[18px]">
          <View className="mb-6 w-full items-center">
            <KakaoLogin disabled={isLoggedIn} />
            <View className="my-2" />
            {isIOS && <AppleLogin disabled={isLoggedIn} />}
          </View>

          <Pressable
            onPress={() => router.push("/(tabs)")}
            className="flex-row items-center justify-center px-6"
          >
            <View className="items-center">
              <Text className="text-lg text-[#F4F4F4]">둘러보기</Text>
              <View className="h-px w-full bg-[#F4F4F4]" />
            </View>
          </Pressable>
          <View className="m-6" />
          <View style={{ marginBottom: insets.bottom - 1 }} />
        </View>
      </View>
    </View>
  );
}
