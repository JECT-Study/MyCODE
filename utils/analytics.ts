import analytics from "@react-native-firebase/analytics";

/**
 * 화면 조회 이벤트 기록
 */
export const logScreenView = async (screenName: string) => {
  try {
    await analytics().logScreenView({
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
  params?: Record<string, unknown>,
) => {
  try {
    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.error("Analytics event error:", error);
  }
};

/**
 * 사용자 ID 설정 (로그인 후 사용자 식별용)
 */
export const setUserId = async (userId: string | null) => {
  try {
    await analytics().setUserId(userId);
  } catch (error) {
    console.error("Analytics user ID error:", error);
  }
};

/**
 * 로그인 이벤트 기록
 */
export const logLogin = async (method: "kakao" | "apple") => {
  try {
    await analytics().logLogin({ method });
  } catch (error) {
    console.error("Analytics login error:", error);
  }
};

/**
 * 검색 이벤트 기록
 */
export const logSearch = async (searchTerm: string) => {
  try {
    await analytics().logSearch({ search_term: searchTerm });
  } catch (error) {
    console.error("Analytics search error:", error);
  }
};

/**
 * 콘텐츠 선택 이벤트 기록
 */
export const logSelectContent = async (contentType: string, itemId: string) => {
  try {
    await analytics().logSelectContent({
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
    await analytics().logShare({
      content_type: contentType,
      item_id: itemId,
      method,
    });
  } catch (error) {
    console.error("Analytics share error:", error);
  }
};
