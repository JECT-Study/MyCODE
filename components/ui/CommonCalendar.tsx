import React, { useCallback, useEffect, useRef, useState } from "react";

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Pressable, View } from "react-native";
import {
  DateData,
  ExpandableCalendar,
  LocaleConfig,
} from "react-native-calendars";

import CalendarHeader from "@/components/ui/CalendarHeader";
import { CustomDay } from "@/components/ui/CustomDay";
import { getCalendarTheme } from "@/constants/CalendarTheme";

// dayjs 플러그인 확장 및 타임존 설정
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.tz.setDefault("Asia/Seoul");

// 한국어 로케일 설정
LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};

LocaleConfig.defaultLocale = "ko";

interface CommonCalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function CommonCalendar({
  selectedDate,
  onDateChange,
}: CommonCalendarProps) {
  // 캘린더 확장/축소 상태 관리
  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(true);
  // 캘린더 토글 중인지 여부 (손잡이 비활성화용)
  const [isToggling, setIsToggling] = useState<boolean | null>(null);
  // 초기 렌더링 완료 상태
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 캘린더 컴포넌트 참조 (확장/축소 제어용)
  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);

  // 날짜 선택 시 호출되는 핸들러 - 선택된 날짜 상태 업데이트
  const handleDateChange = useCallback(
    (day: DateData) => {
      onDateChange(day.dateString);
    },
    [onDateChange],
  );

  // 월 변경 시 호출되는 핸들러 - 월이 바뀔 때마다 실행
  const handleMonthChange = useCallback(
    (month: DateData) => {
      // 현재 selectedDate의 월과 다른 경우에만 업데이트
      const currentSelectedMonth = dayjs(selectedDate).format("YYYY-MM");
      const newMonth = dayjs(month.dateString).format("YYYY-MM");

      if (currentSelectedMonth !== newMonth) {
        // 변경된 월의 1일로 selectedDate 업데이트
        const firstDayOfMonth = dayjs(month.dateString)
          .startOf("month")
          .format("YYYY-MM-DD");
        onDateChange(firstDayOfMonth);
      }
    },
    [selectedDate, onDateChange],
  );

  // 캘린더 확장/축소 상태 변경 시 호출되는 핸들러
  const handleCalendarToggled = useCallback((calendarOpened: boolean) => {
    setIsCalendarExpanded(calendarOpened);
    setIsToggling(null);
  }, []);

  // 커스텀 손잡이 클릭 시 캘린더 확장/축소 토글
  const toggleCalendar = useCallback(() => {
    if (calendarRef.current) {
      const isOpen = calendarRef.current.toggleCalendarPosition();
      setIsToggling(isOpen);
    }
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <CalendarHeader
        selectedDate={selectedDate}
        setSelectedDate={onDateChange}
      />
    );
  }, [selectedDate, onDateChange]);

  // 초기 렌더링 시 캘린더 초기화
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="z-0">
      <ExpandableCalendar
        ref={calendarRef}
        key={isInitialized ? "initialized" : "loading"}
        theme={getCalendarTheme()}
        firstDay={0} // 주의 첫 번째 요일 설정 (0: 일요일, 1: 월요일)
        renderHeader={renderHeader} // 커스텀 헤더 렌더링
        hideArrows={true} // 기본 화살표 숨김 (커스텀 헤더에서 처리)
        onDayPress={handleDateChange} // 날짜 선택 시 실행할 콜백 함수
        onMonthChange={handleMonthChange} // 월 변경 시 실행할 콜백 함수
        onCalendarToggled={handleCalendarToggled} // 캘린더 확장/축소 시 실행할 콜백 함수
        hideKnob={true} // 기본 캘린더 확장/축소 손잡이 숨김 (커스텀 손잡이 사용)
        closeOnDayPress={false} // 날짜 선택 시 캘린더 자동 닫기 여부 (false: 닫지 않음)
        disablePan={false} // 팬(드래그) 제스처 비활성화 여부 (false: 활성화)
        animateScroll={true} // 스크롤 애니메이션 활성화 여부 (true: 부드러운 애니메이션)
        pastScrollRange={3} // 과거 방향으로 스크롤 가능한 개월 수 (12개월 전까지)
        futureScrollRange={3} // 미래 방향으로 스크롤 가능한 개월 수 (12개월 후까지)
        markingType="dot" // 일정이 있는 날짜에 점(dot) 표시
        dayComponent={CustomDay} // 커스텀 Day 컴포넌트 사용 (일요일 빨간색 표시)
        date={selectedDate} // 현재 선택된 날짜 명시적 전달
      />

      {isInitialized && (
        <View
          className={`items-center rounded-b-[32px] bg-white px-4 pb-4 pt-2 shadow-[0px_2px_14px_0px_rgba(0,0,0,0.12)]`}
        >
          <Pressable
            disabled={isToggling !== null}
            className={`p-2 ${isToggling !== null ? "opacity-50" : ""}`}
            onPress={toggleCalendar}
          >
            <View
              style={{
                width: 45,
                height: 4,
                borderRadius: 11,
                backgroundColor: "#CDCDCD",
              }}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}
