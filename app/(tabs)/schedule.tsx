import React, { useCallback, useEffect, useRef, useState } from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { CalendarProvider } from "react-native-calendars";

import ScheduleItem from "@/components/schedule/ScheduleItem";
import CommonCalendar from "@/components/ui/CommonCalendar";
import Divider from "@/components/ui/Divider";
import EmptyState from "@/components/ui/EmptyState";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { ScheduleItemType } from "@/constants/ScheduleData";
import { publicApi } from "@/features/axios/axiosInstance";
import { ScheduleApiResponse } from "@/types/schedule";
import { formatDateWithDay } from "@/utils/dateUtils";

// 페이지네이션 상수
const SCHEDULE_LIMIT = 8;

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState<ScheduleItemType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);

  const router = useRouter();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const isFocusedRef = useRef(false);

  // 포커스 상태 추적
  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      return () => {
        isFocusedRef.current = false;
      };
    }, []),
  );

  // 탭 재클릭 시 스크롤을 최상단으로 이동
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress" as any, () => {
      // 이미 포커스된 상태에서 탭을 누르면 스크롤을 최상단으로
      if (isFocusedRef.current) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
    });

    return unsubscribe;
  }, [navigation]);

  // 탭 포커스 시 StatusBar 스타일 설정
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("dark");
    }, []),
  );

  // 스케줄 데이터 API 호출 함수
  const fetchScheduleData = useCallback(
    async (date: string, page: number = 1, isLoadMore: boolean = false) => {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          if (page === 1) {
            setSchedules([]); // 새로운 날짜 검색시 기존 데이터 초기화
          }
        }

        const response = await publicApi.get<ScheduleApiResponse>(
          `${BACKEND_URL}/schedules`,
          {
            params: {
              page: page,
              limit: SCHEDULE_LIMIT,
              day: date,
            },
          },
        );

        if (response.data.isSuccess && response.data.result) {
          const { content, totalPages, number } = response.data.result;

          if (isLoadMore) {
            setSchedules((prev) => [...prev, ...content]);
          } else {
            setSchedules(content);
          }

          setCurrentPage(number);
          setHasMoreData(number < totalPages);

          console.log(
            `스케줄 데이터 로딩 완료: ${date}, 페이지 ${number}/${totalPages}`,
          );
        } else {
          if (!isLoadMore) {
            setSchedules([]);
          }
          setHasMoreData(false);
          console.log("스케줄 데이터 없음 또는 API 오류");
        }
      } catch (error) {
        console.error("스케줄 데이터 로딩 실패:", error);
        if (!isLoadMore) {
          setSchedules([]);
        }
        setHasMoreData(false);
      } finally {
        if (isLoadMore) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  // 초기 데이터 로딩
  useEffect(() => {
    fetchScheduleData(selectedDate, 0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 무한스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (hasMoreData && !isLoadingMore) {
      const nextPage = currentPage + 1;
      console.log(`다음 페이지 로딩: ${nextPage}`);
      fetchScheduleData(selectedDate, nextPage, true);
    }
  }, [
    hasMoreData,
    isLoadingMore,
    currentPage,
    selectedDate,
    fetchScheduleData,
  ]);

  // 날짜 변경 핸들러
  const handleDateChange = useCallback(
    (date: string) => {
      setSelectedDate(date);
      setCurrentPage(1);
      setHasMoreData(true);
      fetchScheduleData(date, 0, false);
    },
    [fetchScheduleData],
  );

  // 스케줄 아이템 클릭 핸들러
  const handleScheduleItemPress = useCallback(
    (contentId: number) => {
      router.push(`/detail/${contentId}`);
    },
    [router],
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="h-14 items-center justify-center border-b border-[#DCDEE3] bg-white px-4">
          <Text className="text-center text-[19px] font-semibold text-[#212121]">
            컨텐츠 일정
          </Text>
        </View>

        <CalendarProvider date={selectedDate}>
          <CommonCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />

          <FlatList
            ref={flatListRef}
            className="mx-4 flex-1"
            data={schedules}
            renderItem={({ item }) => (
              <ScheduleItem item={item} onPress={handleScheduleItemPress} />
            )}
            keyExtractor={(item) => item.contentId.toString()}
            ListEmptyComponent={
              isLoading ? (
                <View className="flex-1 items-center justify-center py-20">
                  <ActivityIndicator size="large" color="#6C4DFF" />
                </View>
              ) : (
                <EmptyState
                  title="예정된 일정이 없어요."
                  subtitle="다른 날을 조회해보세요!"
                />
              )
            }
            ListHeaderComponent={
              schedules.length > 0 ? (
                <View className="mb-4">
                  <Text className="text-[13px] font-normal text-[#9E9E9E]">
                    {formatDateWithDay(selectedDate)}
                  </Text>
                </View>
              ) : null
            }
            ListFooterComponent={
              isLoadingMore && !isLoading ? (
                <View className="flex-row items-center justify-center py-4">
                  <ActivityIndicator size="large" color="#6C4DFF" />
                </View>
              ) : null
            }
            ItemSeparatorComponent={() => (
              <Divider bg="bg-[#EEE]" className="my-3" />
            )}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: schedules.length === 0 ? "center" : "flex-start",
              paddingVertical: 20,
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
          />
        </CalendarProvider>
      </View>
    </View>
  );
}
