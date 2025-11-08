/**
 * 이미지 URL 검증 및 Placeholder 처리
 * @param imageUrl - 이미지 URL
 * @returns 이미지 소스 객체
 */
export const getImageSource = (imageUrl: string | null | undefined) => {
  const hasImage = imageUrl && imageUrl.trim() !== "";
  return hasImage
    ? { uri: imageUrl }
    : require("@/assets/images/content_placeholder.png");
};

/**
 * 이미지 존재 여부 확인
 * @param imageUrl - 이미지 URL
 * @returns 유효한 이미지 URL 여부
 */
export const hasValidImage = (imageUrl: string | null | undefined): boolean => {
  return !!(imageUrl && imageUrl.trim() !== "");
};
