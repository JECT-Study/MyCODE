import dayjs from "dayjs";

/**
 * 날짜를 YY.MM.DD 형식으로 포맷팅
 * @param date - 날짜 문자열
 * @returns YY.MM.DD 형식의 문자열
 */
export const formatShortDate = (date: string): string => {
  return dayjs(date).format("YY.MM.DD");
};

/**
 * 날짜 범위를 포맷팅 (같은 년도면 MM.DD만 표시)
 * @param startDate - 시작 날짜
 * @param endDate - 종료 날짜
 * @returns 포맷된 날짜 범위 문자열
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (start.year() === end.year()) {
    return `${start.format("YYYY.MM.DD")} - ${end.format("MM.DD")}`;
  }
  return `${start.format("YYYY.MM.DD")} - ${end.format("YYYY.MM.DD")}`;
};

/**
 * 상대적 날짜 표시 (오늘/내일/어제)
 * @param dateString - 날짜 문자열
 * @returns 상대적 날짜 표현 문자열
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = dayjs(dateString);
  const today = dayjs();

  if (date.isSame(today, "day")) {
    return `오늘 ${date.format("M월 D일")}`;
  } else if (date.isSame(today.add(1, "day"), "day")) {
    return `내일 ${date.format("M월 D일")}`;
  } else if (date.isSame(today.subtract(1, "day"), "day")) {
    return `어제 ${date.format("M월 D일")}`;
  }
  return date.format("M월 D일");
};

const DAY_OF_WEEK = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
] as const;

/**
 * 요일 포함 날짜 포맷팅
 * @param date - 날짜 문자열
 * @returns 요일이 포함된 날짜 문자열
 */
export const formatDateWithDay = (date: string): string => {
  const selectedDay = dayjs(date);
  const today = dayjs();
  const isToday = selectedDay.isSame(today, "day");

  const dayName = DAY_OF_WEEK[selectedDay.day()];
  const dateText = `${selectedDay.date()}일 ${dayName}`;
  return isToday ? `${dateText} (오늘)` : dateText;
};

/**
 * 년월 포맷팅
 * @param dateString - 날짜 문자열
 * @returns { year: 년도, month: 월(01-12) }
 */
export const formatYearMonth = (
  dateString: string,
): { year: number; month: string } => {
  const date = dayjs(dateString);
  return {
    year: date.year(),
    month: String(date.month() + 1).padStart(2, "0"),
  };
};
