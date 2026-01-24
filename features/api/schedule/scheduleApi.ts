import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi, publicApi } from "@/features/axios/axiosInstance";
import type { BaseApiResponse } from "@/types/api";
import type { ScheduleApiResponse } from "@/types/schedule";

interface FetchScheduleParams {
  page: number;
  limit?: number;
}

interface AddScheduleResponse {
  scheduleId: number;
}

/**
 * 스케줄 API 서비스
 */
export const scheduleApi = {
  /**
   * 공개 스케줄 조회 (캘린더용)
   */
  fetchPublicSchedule: async ({ page, limit = 10 }: FetchScheduleParams) => {
    const response = await publicApi.get<ScheduleApiResponse>(
      `${BACKEND_URL}/schedules?page=${page}&size=${limit}`,
    );
    return response.data;
  },

  /**
   * 사용자 스케줄 조회 (마이페이지용)
   */
  fetchUserSchedule: async ({ page, limit = 10 }: FetchScheduleParams) => {
    const response = await authApi.get<ScheduleApiResponse>(
      `${BACKEND_URL}/users/schedules?page=${page}&size=${limit}`,
    );
    return response.data;
  },

  /**
   * 스케줄 추가
   */
  addToSchedule: async (contentId: number, dates: string[]) => {
    const response = await authApi.post<BaseApiResponse<AddScheduleResponse>>(
      `${BACKEND_URL}/schedules`,
      { contentId, dates },
    );
    return response.data;
  },

  /**
   * 스케줄 삭제
   */
  removeFromSchedule: async (contentId: number) => {
    const response = await authApi.delete<BaseApiResponse<null>>(
      `${BACKEND_URL}/users/schedules/${contentId}`,
    );
    return response.data;
  },
};
