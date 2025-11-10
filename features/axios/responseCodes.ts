/**
 * 백엔드 응답 코드 관리
 * BaseResponseCode enum과 동기화
 */
export const RESPONSE_CODES = {
  // 1000번대: 성공 코드
  LOGIN_SUCCESS: 1000, // 로그인 성공
  TOKEN_REISSUE_SUCCESS: 1001, // 토큰 재발급이 완료되었습니다.
  LOGOUT_SUCCESS: 1002, // 로그아웃이 완료되었습니다.
  WITHDRAW_SUCCESS: 1003, // 회원탈퇴가 완료되었습니다.

  // 1100 ~ 1199: 컨텐츠 관련
  ADD_FAVORITE: 1100, // 관심목록에 추가했습니다.
  GET_CONTENT_DETAILS: 1101, // 컨텐츠 상세페이지를 불러옵니다.
  GET_RECOMMENDED_CONTENT: 1102, // 맞춤 콘텐츠를 불러옵니다.
  GET_HOT_CONTENT: 1103, // 핫한 콘텐츠를 불러옵니다.
  GET_WEEKLY_CONTENT: 1103, // 금주 콘텐츠를 불러옵니다.
  GET_SAME_CATEGORY_CONTENT: 1104, // 카테고리별 콘텐츠를 불러옵니다.
  REMOVE_FAVORITE: 1105, // 관심목록에서 제거했습니다.
  GET_RECOMMENDED_REGION_CONTENT: 1106, // 사용자 지역 기반 콘텐츠를 추천합니다.

  // 1200 ~ 1299: 일정 관련
  ADD_MY_SCHEDULE_SUCCESS: 1200, // 내 일정에 추가했습니다.
  GET_SCHEDULE_SUCCESS: 1201, // 해당 날짜 컨텐츠들을 불러옵니다.

  // 1300 ~ 1399: 마이페이지 관련
  GET_FAVORITES: 1300, // 관심목록을 불러옵니다.
  GET_MY_SCHEDULES: 1301, // 나의 일정을 불러옵니다.
  GET_SCHEDULED_DATES: 1302, // 일정이 있는 날짜들을 불러옵니다.
  DELETE_MY_SCHEDULE: 1303, // 나의 일정을 삭제합니다.
  CHANGE_PROFILE_SUCCESS: 1304, // 프로필을 수정했습니다.

  // 1400 ~ 1499: 설문 관련
  SAVE_ANSWER_SUCCESS: 1400, // 설문이 완료되었습니다.

  // 1900 ~ 1999: 기타
  SAVE_CONTENT_INFO: 1900, // 컨텐츠 정보를 api로 불러와서 저장했습니다.

  // 2000번대: 클라이언트 오류
  DUPLICATED_NICKNAME: 2001, // 이미 존재하는 닉네임입니다.
  REGION_NOT_EXIST: 2002, // 존재하지 않는 지역입니다.

  // 2100 ~ 2199: 컨텐츠 관련
  CONTENT_NOT_EXIST: 2100, // 존재하지 않는 컨텐츠입니다.
  FAVORITE_NOT_EXIST: 2101, // 존재하지 않는 즐겨찾기입니다.
  USER_REGION_NOT_SET: 2102, // 사용자 지역 정보가 설정되지 않았습니다.

  // 2200 ~ 2299: 일정 관련
  SCHEDULE_NOT_EXIST: 2200, // 해당 일정이 없습니다.
  VALIDATION_FAILED: 2999, // 잘못된 요청입니다.

  // 2300 ~ 2399: 검색 관련
  SEARCH_SUCCESS: 2300, // 컨텐츠를 검색합니다.
  RECENT_SEARCH_SUCCESS: 2301, // 최근 검색어 목록을 조회합니다.
  DELETE_SUCCESS: 2302, // 최근 검색어가 삭제되었습니다.
  DELETE_ALL_SUCCESS: 2303, // 최근 검색어가 모두 삭제되었습니다.
  POPULAR_KEYWORD_SUCCESS: 2304, // 인기 검색어를 조회합니다. (최대 10개)
  SEARCH_RESULT_SUCCESS: 2305, // 검색 결과 페이지를 조회합니다.
  SEARCH_KEYWORD_MISSING: 2311, // 검색어를 입력해 주세요.
  SEARCH_KEYWORD_NOT_FOUND: 2312, // 검색어를 찾을 수 없습니다.

  // 2400 ~ 2499: 인증 관련
  PASSWORD_NOT_EQUAL: 2400, // 비밀번호가 일치하지 않습니다.
  TOKEN_LOGGED_OUT: 2401, // 로그아웃된 토큰입니다.
  USER_NOT_FOUND: 2402, // 사용자를 찾을 수 없습니다.
  UNSUPPORTED_PROVIDER: 2403, // 지원하지 않는 소셜 provider입니다
  INACTIVE_USER: 2404, // 이미 탈퇴한 사용자입니다.

  // 2500 ~ 2599: 설문 관련
  QUESTION_OPTION_ID_NOT_EXIST: 2500, // 해당 questionId/optionId에 매칭되는 QuestionOption이 없습니다

  // 4000번대: 서버 내부 오류
  INTERNAL_SERVER_ERROR: 4000, // 서버 내부 오류입니다.
  INVALID_TOKEN: 4004, // 유효하지 않은 토큰입니다.
  UNAUTHORIZED: 4010, // 인증이 필요합니다.
  TOKEN_EXPIRED: 4011, // 토큰이 만료되었습니다.
  FORBIDDEN: 4030, // 접근 권한이 없습니다.
} as const;
