import React from "react";

import { useRouter } from "expo-router";
import { Modal, Pressable, Text } from "react-native";

interface LoginPromptModalProps {
  visible: boolean;
  onClose: () => void;
  shouldDismissAll?: boolean;
}

export default function LoginPromptModal({
  visible,
  onClose,
  shouldDismissAll = false,
}: LoginPromptModalProps) {
  const router = useRouter();

  const handleStartMaicord = () => {
    onClose();
    if (shouldDismissAll) {
      router.dismissAll();
    }
    router.push("/");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50"
        onPress={onClose}
      >
        <Pressable
          className="mx-5 w-[90%] max-w-[320px] rounded-3xl bg-white p-6"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-center text-xl font-semibold text-[#212121]">
            로그인 후 이용할 수 있어요
          </Text>

          <Text className="mt-3 text-center text-base text-[#424242]">
            로그인하고 마이코드에서
          </Text>
          <Text className="text-center text-base text-[#424242]">
            다양한 문화생활을 즐겨요!
          </Text>

          <Pressable
            className="mt-6 rounded-xl bg-[#6C4DFF] py-3.5"
            onPress={handleStartMaicord}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            <Text className="text-center text-lg font-semibold text-white">
              마이코드 시작하기
            </Text>
          </Pressable>

          <Pressable
            className="mt-3 py-2"
            onPress={onClose}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-center text-base text-[#9E9E9E]">다음에</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
