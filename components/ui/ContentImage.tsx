import { useState } from "react";

import { Image, View } from "react-native";

import { getImageSource, hasValidImage } from "@/utils/imageUtils";

interface ContentImageProps {
  imageUrl: string | null | undefined;
  className?: string;
  rounded?: string;
}

/**
 * 콘텐츠 이미지 컴포넌트
 * - Placeholder 이미지와 실제 이미지를 관리
 * - 이미지 로딩 상태에 따라 opacity 조절
 */
export default function ContentImage({
  imageUrl,
  className = "h-[111px] w-[111px]",
  rounded = "rounded-[10px]",
}: ContentImageProps) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const hasImage = hasValidImage(imageUrl);
  const imageSource = getImageSource(imageUrl);

  return (
    <View className={`relative overflow-hidden ${className} ${rounded}`}>
      {hasImage ? (
        <>
          {/* Placeholder 이미지 - 로딩 중에 표시 */}
          <Image
            source={require("@/assets/images/content_placeholder.png")}
            className={`absolute inset-0 h-full w-full ${rounded}`}
            resizeMode="cover"
          />
          {/* API 이미지 - 로딩 완료 시 표시 */}
          <Image
            source={imageSource}
            className={`absolute inset-0 h-full w-full ${rounded} ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            resizeMode="cover"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
        </>
      ) : (
        /* 이미지가 없는 경우 placeholder만 표시 */
        <Image
          source={require("@/assets/images/content_placeholder.png")}
          className={`absolute inset-0 h-full w-full ${rounded}`}
          resizeMode="cover"
        />
      )}
    </View>
  );
}
