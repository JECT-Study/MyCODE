import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";

import { LoginUrl } from "@/constants/ApiUrls";
import { publicApi } from "@/features/axios/axiosInstance";
import { logEvent } from "@/utils/analytics";
import { handleLoginError, handleLoginSuccess } from "@/utils/authUtils";

export const IOSAppleLogin = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    const id = credential.user;
    const response = await publicApi.post(LoginUrl, {
      socialId: id,
      socialType: "APPLE",
    });

    await handleLoginSuccess(response.data.result);
    logEvent("login_complete", { method: "apple" });
    router.push("/(tabs)");
  } catch (error: any) {
    handleLoginError(error);
  }
};

export const AndroidAppleLogin = () => {
  console.log("Android Login");
};
