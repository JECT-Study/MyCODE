import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
import { create } from "zustand/react";

import useAuthStore from "@/stores/useAuthStore";

interface EditProfileStore {
  profileImageFromPicker: string;
  tempImageFromPicker: string;
  action: {
    setTempImageFromPicker: (
      pickerResult: ImagePicker.ImagePickerResult,
    ) => void;
    cancelChanges: () => void;
    initializeFromUserStore: () => void;
  };
}

const useEditProfileStore = create<EditProfileStore>((set) => ({
  profileImageFromPicker: "",
  tempImageFromPicker: "",
  action: {
    setTempImageFromPicker: (pickerResult: ImagePickerResult) => {
      if (
        !pickerResult.canceled &&
        pickerResult.assets &&
        pickerResult.assets[0]
      ) {
        const asset = pickerResult.assets[0];
        set(() => ({
          tempImageFromPicker: asset.uri,
        }));
      }
    },

    cancelChanges: () => {
      set((state) => ({
        tempImageFromPicker: state.profileImageFromPicker,
      }));
    },

    initializeFromUserStore: () => {
      const authStore = useAuthStore.getState();
      const profileImage = authStore.profileImage || "";

      set({
        profileImageFromPicker: profileImage,
        tempImageFromPicker: profileImage,
      });
    },
  },
}));

export const useTempImageUri = () =>
  useEditProfileStore((state) => state.tempImageFromPicker);

export const useSetTempImageUri = () =>
  useEditProfileStore((state) => state.action.setTempImageFromPicker);
export const useCancelEditProfile = () =>
  useEditProfileStore((state) => state.action.cancelChanges);
export const useInitializeFromUserStore = () =>
  useEditProfileStore((state) => state.action.initializeFromUserStore);
