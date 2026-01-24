/**
 * API 응답 기본 타입
 * 모든 API 응답에 공통으로 사용되는 래퍼 타입
 */
export interface BaseApiResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  result: T;
}

/**
 * 페이지네이션 응답 타입
 */
export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}
