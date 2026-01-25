import {
  logEvent as firebaseLogEvent,
  logLogin as firebaseLogLogin,
  logScreenView as firebaseLogScreenView,
  logSearch as firebaseLogSearch,
  logSelectContent as firebaseLogSelectContent,
  logShare as firebaseLogShare,
  setUserId as firebaseSetUserId,
  getAnalytics,
} from "@react-native-firebase/analytics";

/**
 * 화면 조회 이벤트 기록
 */
export const logScreenView = async (screenName: string) => {
  try {
    await firebaseLogScreenView(getAnalytics(), {
      screen_name: screenName,
      screen_class: screenName,
    });
  } catch (error) {
    console.error("Analytics screen view error:", error);
  }
};

/**
 * 커스텀 이벤트 기록
 */
export const logEvent = async (
  eventName: string,
  params?: Record<string, string | number>,
) => {
  try {
    await firebaseLogEvent(getAnalytics(), eventName, params);
  } catch (error) {
    console.error("Analytics event error:", error);
  }
};

/**
 * 사용자 ID 설정 (로그인 후 사용자 식별용)
 */
export const setUserId = async (userId: string | null) => {
  try {
    await firebaseSetUserId(getAnalytics(), userId);
  } catch (error) {
    console.error("Analytics user ID error:", error);
  }
};

/**
 * 로그인 이벤트 기록
 */
export const logLogin = async (method: "kakao" | "apple") => {
  try {
    await firebaseLogLogin(getAnalytics(), { method });
  } catch (error) {
    console.error("Analytics login error:", error);
  }
};

/**
 * 검색 이벤트 기록
 */
export const logSearch = async (searchTerm: string) => {
  try {
    await firebaseLogSearch(getAnalytics(), {
      search_term: searchTerm,
    });
  } catch (error) {
    console.error("Analytics search error:", error);
  }
};

/**
 * 콘텐츠 선택 이벤트 기록
 */
export const logSelectContent = async (contentType: string, itemId: string) => {
  try {
    await firebaseLogSelectContent(getAnalytics(), {
      content_type: contentType,
      item_id: itemId,
    });
  } catch (error) {
    console.error("Analytics select content error:", error);
  }
};

/**
 * 공유 이벤트 기록
 */
export const logShare = async (
  contentType: string,
  itemId: string,
  method: string,
) => {
  try {
    await firebaseLogShare(getAnalytics(), {
      content_type: contentType,
      item_id: itemId,
      method,
    });
  } catch (error) {
    console.error("Analytics share error:", error);
  }
};
