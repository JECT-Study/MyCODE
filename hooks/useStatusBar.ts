import { useCallback } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { setStatusBarStyle, StatusBarStyle } from "expo-status-bar";

/**
 * 화면 포커스 시 StatusBar 스타일을 설정하는 훅
 * @param style - StatusBar 스타일 ("dark" | "light")
 */
export const useStatusBar = (style: StatusBarStyle = "dark") => {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(style);
    }, [style]),
  );
};
