import { useCallback } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import Confetti from "@/components/survey/Confetti";
import CustomHeader from "@/components/ui/CustomHeader";
import { useStatusBar } from "@/hooks/useStatusBar";
import { logEvent } from "@/utils/analytics";

interface Props {
  type: "END" | "INTRO";
  onNext: () => void;
}

export default function SurveyBalloon({ type, onNext }: Props) {
  // 애니메이션 값들
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  const balloonScale = useSharedValue(0.3);
  const balloonOpacity = useSharedValue(0);

  const descriptionOpacity = useSharedValue(0);
  const descriptionTranslateY = useSharedValue(20);

  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useStatusBar("dark");

  useFocusEffect(
    useCallback(() => {
      // INTRO 화면일 때만 survey_intro_view 이벤트 기록
      if (type === "INTRO") {
        logEvent("survey_intro_view");
      }

      // 애니메이션 시작
      // 1. 타이틀 등장 (페이드인 + 슬라이드업)
      titleOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });
      titleTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });

      // 2. 풍선 이미지 등장 (스케일 + 바운스)
      balloonOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
      balloonScale.value = withDelay(
        200,
        withSpring(1, {
          damping: 10,
          stiffness: 80,
        }),
      );

      // 3. 설명 텍스트 등장
      descriptionOpacity.value = withDelay(
        400,
        withTiming(1, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        }),
      );
      descriptionTranslateY.value = withDelay(
        400,
        withSpring(0, {
          damping: 15,
          stiffness: 100,
        }),
      );

      // 4. 버튼 등장
      buttonOpacity.value = withDelay(
        600,
        withTiming(1, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        }),
      );
      buttonTranslateY.value = withDelay(
        600,
        withSpring(0, {
          damping: 15,
          stiffness: 100,
        }),
      );

      return () => {
        // 언마운트 시 초기화
        titleOpacity.value = 0;
        titleTranslateY.value = 20;
        balloonScale.value = 0.3;
        balloonOpacity.value = 0;
        descriptionOpacity.value = 0;
        descriptionTranslateY.value = 20;
        buttonOpacity.value = 0;
        buttonTranslateY.value = 20;
      };
    }, []),
  );

  // 애니메이션 스타일들
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const balloonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: balloonOpacity.value,
    transform: [{ scale: balloonScale.value }],
  }));

  const descriptionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
    transform: [{ translateY: descriptionTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <View className="flex-1 justify-between bg-white">
      <CustomHeader
        title="취향 분석"
        isCommit={false}
        cancel={type === "END" ? undefined : () => router.back()}
      />
      {type === "END" ? <Confetti /> : null}
      <Animated.View
        className="w-full items-center pt-16"
        style={titleAnimatedStyle}
      >
        <Text className="text-3xl font-semibold text-[#6C4DFF]">
          {type === "INTRO" ? "나의 전시·공연 취향," : "설문이 끝났습니다."}
        </Text>
        <Text className="text-3xl font-semibold text-[#6C4DFF]">
          {type === "INTRO" ? "지금 알아볼까요?" : "지금 결과를 확인해보세요!"}
        </Text>
      </Animated.View>
      <Animated.View
        className="flex-1 items-center justify-center"
        style={balloonAnimatedStyle}
      >
        <Image
          source={require("@/assets/images/survey/balloon.png")}
          style={{ width: 256, height: 256 }}
        />
      </Animated.View>
      <Animated.View className="px-4 py-6" style={buttonAnimatedStyle}>
        {type === "INTRO" && (
          <Animated.View className="mx-auto" style={descriptionAnimatedStyle}>
            <Text className="w-full p-5 text-lg font-normal text-[#9E9E9E]">
              6문항으로 나만의 콘텐츠 리스트 완성!
            </Text>
          </Animated.View>
        )}
        <Pressable
          className="z-50 h-16 w-full items-center justify-center rounded-lg bg-[#6C4DFF] active:bg-[#5638E6]"
          onPress={() => {
            if (type === "INTRO") {
              logEvent("survey_start_click");
            }
            onNext();
          }}
        >
          <Text className="text-xl font-semibold text-white">
            {type === "INTRO" ? "취향 분석 시작" : "마이코드 시작하기"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
