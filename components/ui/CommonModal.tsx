import React from "react";

import { Modal, Pressable, Text, View } from "react-native";

interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
  mainTitle: string;
  subTitle?: string;
  showSubTitle?: boolean;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  showCancelButton?: boolean;
  confirmButtonColor?: "primary" | "danger";
}

export default function CommonModal({
  visible,
  onClose,
  mainTitle,
  subTitle,
  showSubTitle = true,
  cancelText = "취소",
  confirmText = "확인",
  onCancel,
  onConfirm,
  showCancelButton = true,
  confirmButtonColor = "primary",
}: CommonModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
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
            {mainTitle}
          </Text>

          {showSubTitle && subTitle && (
            <Text className="mt-3 text-center text-base text-[#424242]">
              {subTitle}
            </Text>
          )}

          <View className={`mt-6 ${showCancelButton ? "flex-row gap-3" : ""}`}>
            {showCancelButton && (
              <Pressable
                className="h-14 flex-1 items-center justify-center rounded-xl border border-[#E0E0E0] bg-white active:bg-gray-100"
                onPress={handleCancel}
              >
                <Text className="text-center text-lg font-medium text-[#616161]">
                  {cancelText}
                </Text>
              </Pressable>
            )}

            <Pressable
              className={`${showCancelButton ? "flex-1" : "w-full"} h-14 items-center justify-center rounded-xl ${
                confirmButtonColor === "danger"
                  ? "bg-[#EF4444] active:bg-[#DC2626]"
                  : "bg-[#6C4DFF] active:bg-[#5638E6]"
              }`}
              onPress={handleConfirm}
            >
              <Text className="text-center text-lg font-semibold text-white">
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
