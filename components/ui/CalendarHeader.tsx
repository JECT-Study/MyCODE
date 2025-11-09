import React, { useCallback } from "react";

import dayjs from "dayjs";
import { Pressable, Text, View } from "react-native";

import CalendarArrow from "@/components/icons/CalendarArrow";
import { formatYearMonth } from "@/utils/dateUtils";

interface CalendarHeaderProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  /** 최소 날짜 (YYYY-MM-DD 형식) */
  minDate?: string;
  /** 최대 날짜 (YYYY-MM-DD 형식) */
  maxDate?: string;
}

export default function CalendarHeader({
  selectedDate,
  setSelectedDate,
  minDate,
  maxDate,
}: CalendarHeaderProps) {
  const { year, month } = formatYearMonth(selectedDate);

  // minDate/maxDate가 제공된 경우에만 제한 적용
  const currentMonthStr = dayjs(selectedDate).format("YYYY-MM");

  // 이전/다음 월 이동 가능 여부 체크
  const canGoPrevious = minDate
    ? currentMonthStr > dayjs(minDate).format("YYYY-MM")
    : true;
  const canGoNext = maxDate
    ? currentMonthStr < dayjs(maxDate).format("YYYY-MM")
    : true;

  // 이전 월로 이동
  const goToPreviousMonth = useCallback(() => {
    if (!canGoPrevious) return;

    // 이전 월의 1일로 selectedDate 업데이트
    const firstDayOfPreviousMonth = dayjs(selectedDate)
      .subtract(1, "month")
      .date(1)
      .format("YYYY-MM-DD");
    setSelectedDate(firstDayOfPreviousMonth);
  }, [selectedDate, setSelectedDate, canGoPrevious]);

  // 다음 월로 이동
  const goToNextMonth = useCallback(() => {
    if (!canGoNext) return;

    // 다음 월의 1일로 selectedDate 업데이트
    const firstDayOfNextMonth = dayjs(selectedDate)
      .add(1, "month")
      .date(1)
      .format("YYYY-MM-DD");
    setSelectedDate(firstDayOfNextMonth);
  }, [selectedDate, setSelectedDate, canGoNext]);

  return (
    <View className="flex-row items-center justify-between px-4 py-2.5">
      <Pressable
        onPress={goToPreviousMonth}
        className="p-2"
        disabled={!canGoPrevious}
      >
        <CalendarArrow
          direction="left"
          color={canGoPrevious ? "#424242" : "#BDBDBD"}
        />
      </Pressable>

      <Text className="mx-1 text-2xl font-semibold text-[#424242]">
        {year}. {month}
      </Text>

      <Pressable onPress={goToNextMonth} className="p-2" disabled={!canGoNext}>
        <CalendarArrow
          direction="right"
          color={canGoNext ? "#424242" : "#BDBDBD"}
        />
      </Pressable>
    </View>
  );
}
