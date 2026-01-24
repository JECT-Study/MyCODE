import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import type { BaseApiResponse } from "@/types/api";
import type { ContentDetail } from "@/types/content";

/**
 * 콘텐츠 상세 API 서비스
 */
export const contentApi = {
  /**
   * 콘텐츠 상세 정보 조회
   */
  fetchDetail: async (contentId: string | number) => {
    const response = await authApi.get<BaseApiResponse<ContentDetail>>(
      `${BACKEND_URL}/contents/${contentId}`,
    );
    return response.data;
  },
};
