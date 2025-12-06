import { useEffect } from "react";

import { useRouter } from "expo-router";
import { AppState, View } from "react-native";

export default function KakaoLink() {
  const router = useRouter();

  useEffect(() => {
    const currentAppState = AppState.currentState;

    if (currentAppState === "background") {
      // 앱이 백그라운드에서 실행 중일 때만 스택 모두 제거
      router.dismissAll();
    }

    router.replace("/");
  }, [router]);

  return <View />;
}
