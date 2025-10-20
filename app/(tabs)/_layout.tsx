import { useEffect, useRef } from "react";

import { Tabs, usePathname } from "expo-router";
import { Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import { ROUTES } from "@/constants/Routes";
import { TAB_SCREENS } from "@/constants/TabScreens";

const TabColors = {
  active: "#6C4DFF",
  inactive: "#424242",
  inactiveText: "#767676",
};

export default function TabLayout() {
  const pathname = usePathname();
  const lastTabRef = useRef<string>("index"); // 마지막으로 방문한 탭을 추적

  // 탭 활성화 상태를 판별하는 함수
  const isTabActive = (screen: { activePage?: string; name: string }) => {
    if (screen.activePage) {
      // activeGroup이 정의된 경우, 해당 그룹 경로로 시작하는지 확인
      return pathname?.startsWith(`/${screen.activePage}`);
    } else if (screen.name === "index") {
      // 홈 페이지에 있을 때 활성화
      return pathname === ROUTES.HOME;
    } else {
      // activeGroup이 없는 경우, 해당 탭 경로와 정확히 일치하는지 확인
      return pathname === `/${screen.name}`;
    }
  };

  // 탭 페이지일 때 마지막 탭 업데이트
  useEffect(() => {
    const isTabPage = TAB_SCREENS.some(
      (screen) => pathname === `/${screen.name}` || pathname === ROUTES.HOME,
    );

    if (isTabPage) {
      const currentTab = TAB_SCREENS.find(
        (screen) => pathname === `/${screen.name}` || pathname === ROUTES.HOME,
      );
      if (currentTab) {
        lastTabRef.current = currentTab.name;
      }
    }
  }, [pathname]);

  const isHomePage = pathname === ROUTES.HOME;
  const isDetailPage = pathname?.startsWith("/detail/");
  const isSearchResultsPage = pathname?.startsWith("/search-results");
  const isSearchKeywordsPage = pathname?.startsWith("/search-keywords");
  const isSurveyPage = pathname?.startsWith("/survey");

  // 홈 탭에서 온 경우에만 보라색 배경 적용
  const isDetailFromHome = isDetailPage && lastTabRef.current === "index";
  const isSearchKeywordsFromHome =
    isSearchKeywordsPage && lastTabRef.current === "index";
  const isSurveyFromHome = isSurveyPage && lastTabRef.current === "index";

  return (
    <>
      <SafeAreaView
        className="flex-1"
        style={{
          backgroundColor:
            isHomePage ||
            isDetailFromHome ||
            isSearchResultsPage ||
            isSearchKeywordsFromHome ||
            isSurveyFromHome
              ? "#816BFF"
              : "#FFFFFF",
        }}
        edges={["top"]}
      >
        <View className="flex-1">
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarButton: HapticTab,
              tabBarStyle: {
                paddingBottom: 10,
                paddingTop: 5,
                height: Platform.OS === "ios" ? 60 : 70,
                backgroundColor: "white",
                borderTopWidth: 0, // 기존 border 제거
                shadowColor: "#575757",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 0, // Android에서 그림자 제거
              },
              tabBarIconStyle: {
                marginBottom: 3,
              },
              tabBarLabelStyle: {
                fontSize: 11,
              },
              tabBarActiveTintColor: TabColors.active,
              tabBarInactiveTintColor: TabColors.inactive,
            }}
          >
            {TAB_SCREENS.map((screen) => {
              // 일반 탭 처리
              return (
                <Tabs.Screen
                  key={screen.name}
                  name={screen.name}
                  options={{
                    title: screen.title,
                    tabBarIcon: ({ size }) => {
                      const isActive = isTabActive(screen);
                      const color = isActive
                        ? TabColors.active
                        : TabColors.inactive;
                      const iconSize = 28; // 아이콘 크기를 28로 고정

                      // 홈, 검색, 일정, 마이페이지 아이콘의 경우 isActive prop 추가
                      if (
                        screen.name === "index" ||
                        screen.name === "search_tab" ||
                        screen.name === "schedule" ||
                        screen.name === "mypage"
                      ) {
                        return (
                          <screen.Icon
                            color={color}
                            size={iconSize}
                            isActive={isActive}
                          />
                        );
                      }

                      return <screen.Icon color={color} size={iconSize} />;
                    },
                    tabBarLabel: ({ focused }) => {
                      const isActive = isTabActive(screen);
                      const color = isActive
                        ? TabColors.active
                        : TabColors.inactiveText;
                      return (
                        <Text
                          style={{
                            fontSize: 11,
                            color: color,
                            lineHeight: 11, // 웹 렌더링 호환성을 위한 설정
                          }}
                        >
                          {screen.title}
                        </Text>
                      );
                    },
                  }}
                />
              );
            })}
          </Tabs>
        </View>
      </SafeAreaView>
      <SafeAreaView className="bg-white" edges={["bottom"]} />
    </>
  );
}
