import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi, publicApi } from "@/features/axios/axiosInstance";
import type { BaseApiResponse } from "@/types/api";
import type {
  CategoryContentItem,
  CategoryType,
  CustomContentItem,
  WeeklyContentItem,
} from "@/types/content";

/**
 * 홈 화면 API 서비스
 */
export const homeApi = {
  /**
   * 카테고리별 맞춤 추천 콘텐츠 조회
   */
  fetchRecommendations: async (category: CategoryType) => {
    const response = await authApi.get<BaseApiResponse<CustomContentItem[]>>(
      `${BACKEND_URL}/home/recommendations?category=${category}`,
    );
    return response.data;
  },

  /**
   * 이번달 핫한 축제 조회
   */
  fetchHotFestival: async () => {
    const response = await publicApi.get<BaseApiResponse<CustomContentItem[]>>(
      `${BACKEND_URL}/home/festival/hot`,
    );
    return response.data;
  },

  /**
   * 주간 콘텐츠 조회
   */
  fetchWeeklyContent: async (date: string) => {
    const response = await publicApi.get<BaseApiResponse<WeeklyContentItem[]>>(
      `${BACKEND_URL}/home/contents/week?date=${date}`,
    );
    return response.data;
  },

  /**
   * 카테고리 콘텐츠 조회
   */
  fetchCategoryContent: async () => {
    const response = await publicApi.get<
      BaseApiResponse<CategoryContentItem[]>
    >(`${BACKEND_URL}/home/category`);
    return response.data;
  },
};
