import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import type { BaseApiResponse } from "@/types/api";
import type { FavoriteItem } from "@/types/content";

interface FetchFavoritesParams {
  page: number;
  limit?: number;
  category?: string;
}

interface ToggleFavoriteResponse {
  likeId?: number;
  likeCount: number;
}

/**
 * 좋아요/즐겨찾기 API 서비스
 */
export const favoritesApi = {
  /**
   * 좋아요 목록 조회
   */
  fetchFavorites: async ({
    page,
    limit = 10,
    category = "ALL",
  }: FetchFavoritesParams) => {
    const response = await authApi.get<BaseApiResponse<FavoriteItem[]>>(
      `${BACKEND_URL}/users/favorites?page=${page}&size=${limit}&category=${category}`,
    );
    return response.data;
  },

  /**
   * 좋아요 추가
   */
  addFavorite: async (contentId: number) => {
    const response = await authApi.post<
      BaseApiResponse<ToggleFavoriteResponse>
    >(`${BACKEND_URL}/contents/${contentId}/favorites`);
    return response.data;
  },

  /**
   * 좋아요 취소
   */
  removeFavorite: async (contentId: number) => {
    const response = await authApi.delete<BaseApiResponse<number>>(
      `${BACKEND_URL}/contents/${contentId}/favorites`,
    );
    return response.data;
  },
};
