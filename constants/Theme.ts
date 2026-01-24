/**
 * 앱 전체 테마 색상
 */
export const COLORS = {
  // Primary 색상
  primary: "#6C4DFF",
  primaryLight: "#816BFF",
  primaryDark: "#5E47E3",
  primaryFaded: "#6B51FB",

  // Gradient 색상
  gradientStart: "#7F69FE",
  gradientEnd: "#6B52FB",

  // Gray 스케일
  gray900: "#212121",
  gray800: "#424242",
  gray700: "#616161",
  gray600: "#757575",
  gray500: "#9E9E9E",
  gray400: "#BDBDBD",
  gray300: "#E0E0E0",
  gray200: "#ECECEC",
  gray100: "#F5F5F5",

  // 텍스트 색상
  textPrimary: "#111111",
  textSecondary: "#424242",
  textTertiary: "#707070",
  textMuted: "#9E9E9E",
  textDisabled: "#BDBDBD",

  // 시맨틱 색상
  error: "#FF5252",
  success: "#4CAF50",
  warning: "#FFC107",
  info: "#2196F3",

  // 배경 색상
  background: "#FFFFFF",
  surface: "#F5F5F5",
  overlay: "rgba(0, 0, 0, 0.5)",

  // 테두리 색상
  border: "#DCDEE3",
  borderLight: "#ECECEC",
} as const;

/**
 * 카테고리 색상 (태그, 배지 등)
 */
export const CATEGORY_COLORS = {
  PERFORMANCE: "#FF6B6B",
  EXHIBITION: "#4ECDC4",
  FESTIVAL: "#FFE66D",
  EVENT: "#95E1D3",
} as const;
