import {
  logEvent as firebaseLogEvent,
  setUserId as firebaseSetUserId,
  getAnalytics,
} from "@react-native-firebase/analytics";

/**
 * 화면 조회 이벤트 기록
 * @param screenName 화면 이름 (예: "(tabs)/home", "detail/123")
 */
export const logScreenView = async (screenName: string) => {
  try {
    const analytics = getAnalytics();
    await firebaseLogEvent(analytics, "screen_view" as "select_content", {
      screen_name: screenName,
      screen_class: screenName,
    });
  } catch (error) {
    console.error("Analytics screen view error:", error);
  }
};

/**
 * 커스텀 이벤트 기록
 * @param eventName 이벤트 이름 (예: "like_event", "add_to_schedule")
 * @param params 추가 파라미터 (선택)
 */
export const logEvent = async (
  eventName: string,
  params?: Record<string, unknown>,
) => {
  try {
    const analytics = getAnalytics();
    await firebaseLogEvent(analytics, eventName as "select_content", params);
  } catch (error) {
    console.error("Analytics event error:", error);
  }
};

/**
 * 사용자 ID 설정 (로그인 후 사용자 식별용)
 * @param userId 사용자 ID (로그아웃 시 null)
 */
export const setUserId = async (userId: string | null) => {
  try {
    const analytics = getAnalytics();
    await firebaseSetUserId(analytics, userId);
  } catch (error) {
    console.error("Analytics user ID error:", error);
  }
};

/**
 * 로그인 이벤트 기록
 * @param method 로그인 방식 ("kakao" | "apple")
 */
export const logLogin = async (method: "kakao" | "apple") => {
  try {
    const analytics = getAnalytics();
    await firebaseLogEvent(analytics, "login", { method });
  } catch (error) {
    console.error("Analytics login error:", error);
  }
};

/**
 * 검색 이벤트 기록
 * @param searchTerm 검색어 (예: "뮤지컬", "서울 전시회")
 */
export const logSearch = async (searchTerm: string) => {
  try {
    const analytics = getAnalytics();
    await firebaseLogEvent(analytics, "search", {
      search_term: searchTerm,
    });
  } catch (error) {
    console.error("Analytics search error:", error);
  }
};

/**
 * 콘텐츠 선택 이벤트 기록 (상세 페이지 진입 등)
 * @param contentType 콘텐츠 유형 (예: "event", "exhibition", "concert")
 * @param itemId 문화행사 ID (예: "123")
 */
export const logSelectContent = async (contentType: string, itemId: string) => {
  try {
    const analytics = getAnalytics();
    await firebaseLogEvent(analytics, "select_content", {
      content_type: contentType,
      item_id: itemId,
    });
  } catch (error) {
    console.error("Analytics select content error:", error);
  }
};

/**
 * 공유 이벤트 기록
 * @param contentType 콘텐츠 유형 (예: "event", "exhibition", "concert")
 * @param itemId 문화행사 ID (예: "123")
 * @param method 공유 방식 (예: "kakaolink", "clipboard")
 */
export const logShare = async (
  contentType: string,
  itemId: string,
  method: string,
) => {
  try {
    const analytics = getAnalytics();
    await firebaseLogEvent(analytics, "share", {
      content_type: contentType,
      item_id: itemId,
      method,
    });
  } catch (error) {
    console.error("Analytics share error:", error);
  }
};
