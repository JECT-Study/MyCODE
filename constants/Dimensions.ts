/**
 * UI 관련 치수 상수
 */
export const DIMENSIONS = {
  /** 스크롤 임계값 (헤더 표시 기준) */
  SCROLL_THRESHOLD: 20,
  /** 상세 페이지 헤더 배경 표시 임계값 */
  HEADER_BACKGROUND_THRESHOLD: 300,
  /** 상세 페이지 이미지 높이 */
  DETAIL_IMAGE_HEIGHT: 350,
  /** 카드 기본 테두리 반경 */
  CARD_BORDER_RADIUS: 14,
} as const;

/**
 * API 관련 타임아웃 상수
 */
export const TIMEOUTS = {
  /** 기본 API 타임아웃 (ms) */
  API_DEFAULT: 10000,
  /** 최소 로딩 시간 (ms) - UX 개선용 */
  MIN_LOADING_TIME: 500,
} as const;
