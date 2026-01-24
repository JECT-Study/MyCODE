import { useCallback, useEffect, useRef } from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, ScrollView } from "react-native";

type ScrollableRef = FlatList | ScrollView | null;

/**
 * 탭 재클릭 시 스크롤을 최상단으로 이동시키는 훅
 * @param scrollRef - FlatList 또는 ScrollView의 ref
 */
export const useTabScrollReset = (
  scrollRef: React.RefObject<ScrollableRef>,
) => {
  const isFocusedRef = useRef(false);
  const navigation = useNavigation();

  // 포커스 상태 추적
  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      return () => {
        isFocusedRef.current = false;
      };
    }, []),
  );

  // 탭 재클릭 시 스크롤 최상단으로
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress" as never, () => {
      if (isFocusedRef.current && scrollRef.current) {
        if ("scrollToOffset" in scrollRef.current) {
          // FlatList
          scrollRef.current.scrollToOffset({ offset: 0, animated: true });
        } else if ("scrollTo" in scrollRef.current) {
          // ScrollView
          scrollRef.current.scrollTo({ y: 0, animated: true });
        }
      }
    });

    return unsubscribe;
  }, [navigation, scrollRef]);
};
