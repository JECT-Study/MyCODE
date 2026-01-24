/**
 * 사용자 지역 정보 타입
 */
export interface UserRegion {
  id: number;
  name: string;
}

/**
 * 사용자 정보 타입
 */
export interface UserInfo {
  nickname: string;
  profileImage: string;
  userRegions: UserRegion[];
}

/**
 * 로그인 응답 데이터 타입
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  nickname?: string;
  image?: string;
  userRegions?: UserRegion[];
}
