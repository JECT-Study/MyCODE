import { useEffect, useState } from "react";

import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";

import CameraIcon from "@/components/icons/CameraIcon";
import DefaultProfileIcon from "@/components/icons/DefaultProfileIcon";
import XIcon from "@/components/icons/X";
import ActionBottomSheet from "@/components/ui/ActionBottomSheet";
import CommonModal from "@/components/ui/CommonModal";
import CustomHeader from "@/components/ui/CustomHeader";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import useCustomImagePicker from "@/hooks/useCustomImagePicker";
import {
  authActions,
  useNickname,
  useProfileImage,
} from "@/stores/useAuthStore";
import {
  useCancelEditProfile,
  useTempImageUri,
} from "@/stores/useEditProfileStore";

export default function EditProfile() {
  const cancelEdit = useCancelEditProfile();

  const currentNickname = useNickname();
  const currentProfileImage = useProfileImage();

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalSubTitle, setModalSubTitle] = useState("");
  const [modalConfirmText, setModalConfirmText] = useState("확인");
  const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | null>(
    null,
  );

  // 프로필 이미지 관련
  const { onPress, isBottomSheetOpen, onCloseBottomSheet, onLibrary } =
    useCustomImagePicker();
  const profileUri = useTempImageUri();

  // 닉네임 관련 - 직접 상태 관리
  const [inputNickname, setInputNickname] = useState("");

  // 스토어에서 초기값 설정
  useEffect(() => {
    if (currentNickname) {
      setInputNickname(currentNickname);
    }
  }, [currentNickname]);

  // 프로필 업데이트 API 요청
  const handleUpdateProfile = async () => {
    if (!inputNickname.trim()) {
      setModalTitle("알림");
      setModalSubTitle("닉네임을 입력해주세요.");
      setModalConfirmText("확인");
      setModalOnConfirm(() => () => setShowModal(false));
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      // 닉네임 추가
      formData.append("nickname", inputNickname.trim());

      // 이미지 추가 (새로운 이미지가 선택된 경우에만)
      const hasNewImage =
        profileUri &&
        profileUri.trim() !== "" &&
        !profileUri.startsWith("data:image/svg+xml");

      if (hasNewImage) {
        const imageUri = profileUri;
        const filename = imageUri.split("/").pop() || "profile.jpg";

        // 파일 확장자에 따른 MIME 타입 설정
        let mimeType = "image/jpeg"; // 기본값
        if (filename.toLowerCase().includes(".png")) {
          mimeType = "image/png";
        } else if (
          filename.toLowerCase().includes(".jpg") ||
          filename.toLowerCase().includes(".jpeg")
        ) {
          mimeType = "image/jpeg";
        } else if (filename.toLowerCase().includes(".gif")) {
          mimeType = "image/gif";
        } else if (filename.toLowerCase().includes(".webp")) {
          mimeType = "image/webp";
        }

        // React Native에서 FormData에 파일 추가하는 방식
        const imageFile = {
          uri: imageUri,
          type: mimeType,
          name: filename,
        } as unknown as Blob;

        // 이미지를 FormData에 추가
        formData.append("image", imageFile);
      }

      const response = await authApi.patch(
        `${BACKEND_URL}/users/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.isSuccess) {
        // 스토어 상태 업데이트 (자동으로 AsyncStorage에 persist)
        authActions.setNickname(inputNickname.trim());

        // 이미지가 업데이트된 경우 스토어에도 반영
        if (hasNewImage && response.data.result?.profileImage) {
          authActions.setProfileImage(response.data.result.profileImage);
        } else if (hasNewImage && profileUri) {
          // 서버에서 이미지 URL을 반환하지 않는 경우, 로컬 URI 사용
          authActions.setProfileImage(profileUri);
        }

        setModalTitle("성공");
        setModalSubTitle("프로필이 성공적으로 업데이트되었습니다.");
        setModalConfirmText("확인");
        setModalOnConfirm(() => () => {
          setShowModal(false);
          // 모달이 완전히 닫힌 후 화면 이동
          setTimeout(() => {
            router.back();
          }, 100);
        });
        setShowModal(true);
      } else {
        setModalTitle("오류");
        setModalSubTitle(
          response.data.message || "프로필 업데이트에 실패했습니다.",
        );
        setModalConfirmText("확인");
        setModalOnConfirm(() => () => setShowModal(false));
        setShowModal(true);
      }
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      setModalTitle("오류");
      setModalSubTitle("프로필 업데이트 중 오류가 발생했습니다.");
      setModalConfirmText("확인");
      setModalOnConfirm(() => () => setShowModal(false));
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 소스 결정 로직
  const getImageSource = () => {
    // profileUri가 실제 이미지 URI인지 확인 (기본 SVG가 아닌 경우)
    const hasNewImage =
      profileUri &&
      profileUri.trim() !== "" &&
      !profileUri.startsWith("data:image/svg+xml");

    // 1. 새로 선택한 이미지가 있으면 사용
    if (hasNewImage) {
      return profileUri;
    }

    // 2. 현재 사용자의 프로필 이미지가 있으면 사용
    if (currentProfileImage && currentProfileImage.trim() !== "") {
      return currentProfileImage;
    }

    // 3. 둘 다 없으면 null 반환 (기본 아이콘 사용)
    return null;
  };

  const imageSource = getImageSource();

  return (
    <SafeAreaView className="w-full flex-1 items-center bg-white">
      <CustomHeader
        title="프로필 수정"
        isCommit={true}
        separator
        commit={handleUpdateProfile}
        cancel={() => {
          cancelEdit();
          router.back();
        }}
      />

      {/* 프로필 이미지 섹션 */}
      <View aria-label="edit profile" className="m-6">
        <View
          aria-label="profile_image"
          className="relative size-[100px] rounded-full"
        >
          {imageSource ? (
            <Image
              source={imageSource}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <DefaultProfileIcon size={100} />
          )}
          <Pressable
            onPress={onPress}
            disabled={isLoading}
            className="absolute bottom-0.5 right-0.5 flex size-[30px] items-center justify-center rounded-full border-2 border-[#F2F3F6] bg-white"
            style={({ pressed }) => [
              { opacity: isLoading ? 0.5 : pressed ? 0.7 : 1 },
            ]}
          >
            <CameraIcon />
          </Pressable>
        </View>
      </View>

      {/* 닉네임 섹션 */}
      <View className="w-full px-6">
        <Text className="text-lg font-medium">닉네임</Text>
        <View className="relative my-3 h-14 w-full">
          <TextInput
            className="h-full w-full rounded-lg border-[1px] border-[#D1D3D8] bg-white px-4 pr-10"
            placeholder="닉네임을 입력해주세요."
            placeholderTextColor="#9CA3AF"
            onChangeText={setInputNickname}
            value={inputNickname}
            editable={!isLoading}
            style={{ opacity: isLoading ? 0.5 : 1, fontSize: 16 }}
          />
          {inputNickname.length > 0 && (
            <Pressable
              onPress={() => setInputNickname("")}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={({ pressed }) => [
                { opacity: isLoading ? 0.5 : pressed ? 0.7 : 1 },
              ]}
            >
              <XIcon size={20} />
            </Pressable>
          )}
        </View>
        {inputNickname.length > 0 ? null : (
          <Text className="text-[12px] text-[#DC0000]">
            닉네임을 입력해주세요!
          </Text>
        )}
      </View>

      {/* 이미지 피커 바텀시트 */}
      <ActionBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={onCloseBottomSheet}
        actions={[
          {
            label: "앨범에서 선택",
            onPress: () => {
              onLibrary();
              onCloseBottomSheet();
            },
            color: "#007AFF",
          },
          {
            label: "닫기",
            onPress: onCloseBottomSheet,
            color: "#007AFF",
          },
        ]}
        snapPoint={200}
      />

      {/* 공통 모달 */}
      <CommonModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        mainTitle={modalTitle}
        subTitle={modalSubTitle}
        showCancelButton={false}
        confirmText={modalConfirmText}
        onConfirm={modalOnConfirm || (() => setShowModal(false))}
      />
    </SafeAreaView>
  );
}
