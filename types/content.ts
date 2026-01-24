/**
 * 홈 화면 맞춤 콘텐츠 아이템 타입
 * 사용처: app/(tabs)/index.tsx, components/home/Card.tsx, components/home/HotCard.tsx
 */
export interface CustomContentItem {
  contentId: number;
  title: string;
  image: string;
  contentType: string;
  address: string;
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
}

/**
 * 주간 콘텐츠 아이템 타입
 * 사용처: app/(tabs)/index.tsx, components/home/WeeklyCard.tsx
 */
export interface WeeklyContentItem {
  contentId: number;
  title: string;
  image: string | null;
  address: string;
  startDate: string;
  endDate: string;
}

/**
 * 카테고리 콘텐츠 아이템 타입
 * 사용처: app/(tabs)/index.tsx, components/home/MoreCard.tsx
 */
export interface CategoryContentItem {
  contentId: number;
  title: string;
  image: string | null;
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
}

/**
 * 콘텐츠 상세 정보 타입
 * 사용처: app/detail/[id].tsx
 */
export interface ContentDetail {
  contentId: number;
  likeId: number | null;
  scheduleId: number | null;
  title: string;
  images: string[];
  tags: string[];
  placeName: string;
  startDate: string;
  endDate: string;
  likes: number;
  isAlwaysOpen: boolean | null;
  openingHour: string | null;
  closedHour: string | null;
  address: string;
  introduction: string;
  description: string;
  longitude: number;
  latitude: number;
  telNumber: string | null;
  homepage: string | null;
}

/**
 * 좋아요 목록 아이템 타입
 * 사용처: app/like/index.tsx, components/like/FavoriteContentItem.tsx
 */
export interface FavoriteItem {
  contentId: number;
  title: string;
  address: string;
  start_date: string;
  end_date: string;
  img_url?: string;
  likeId?: number | null;
  likes?: number;
}

/**
 * 카테고리 타입
 */
export type CategoryType = "PERFORMANCE" | "EXHIBITION" | "FESTIVAL" | "EVENT";
