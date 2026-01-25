import "dotenv/config";

export default {
  name: "마이코드",
  slug: "mycode",
  owner: "donggukim",
  version: "1.0.5",
  orientation: "portrait",
  icon: "./assets/mycode_icon.png",
  scheme: "mycode",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  backgroundColor: "#6B51FB",

  ios: {
    supportsTablet: true,
    usesAppleSignIn: true,
    bundleIdentifier: process.env.MYCODE_BUNDLE_IDENTIFIER,
    buildNumber: "37",
    backgroundColor: "#6B51FB",
    googleServicesFile: "./GoogleService-Info.plist",
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      CFBundleDevelopmentRegion: "ko",
      CFBundleLocalizations: ["ko"],
      LSApplicationQueriesSchemes: [
        "kakaokompassauth",
        "kakaolink",
        "kakaoplus",
        "nmap",
      ],
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            `kakao${process.env.MYCODE_KAKAO_NATIVE_APP_KEY}`,
          ],
        },
      ],
      NSAppTransportSecurity: { NSAllowsArbitraryLoads: true },
      NSLocationWhenInUseUsageDescription:
        "마이코드가 지도 서비스를 제공하기 위해 위치 정보를 사용합니다.",
    },
  },

  android: {
    package: process.env.MYCODE_BUNDLE_IDENTIFIER,
    versionCode: 36,
    edgeToEdgeEnabled: true,
    icon: "./assets/mycode_icon.png",
    backgroundColor: "#111111",
    googleServicesFile: "./google-services.json",
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/mycode_logo.png",
        imageWidth: 270,
        resizeMode: "contain",
        backgroundColor: "#6C4DFF",
        android: {
          imageWidth: 190,
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          extraMavenRepos: [
            "https://devrepo.kakao.com/nexus/content/groups/public/",
            "https://repository.map.naver.com/archive/maven",
          ],
          usesCleartextTraffic: true,
          // Android 15+ 16KB 메모리 페이지 크기 지원
          enable16kPageSize: true,
          // 네이티브 라이브러리를 16KB 정렬로 컴파일
          extraCmakeArgs: ["-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON"],
          packagingOptions: {
            jniLibs: {
              // 16KB 페이지 크기 지원을 위해 압축 패키징 사용 (AGP 8.5 이하)
              useLegacyPackaging: true,
            },
          },
        },
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    [
      "@react-native-kakao/core",
      {
        nativeAppKey: process.env.MYCODE_KAKAO_NATIVE_APP_KEY,
        android: {
          authCodeHandlerActivity: true,
        },
        ios: {
          handleKakaoOpenUrl: true,
        },
      },
    ],
    "expo-apple-authentication",
    [
      "expo-image-picker",
      {
        photosPermission: "마이코드가 당신의 사진(앱)에 접근하려합니다.",
        cameraPermission: "마이코드가 당신의 카메라(앱)에 접근하려합니다.",
      },
    ],
    [
      "@mj-studio/react-native-naver-map",
      {
        client_id: process.env.NAVER_MAP_CLIENT_ID,
      },
    ],
    "expo-maps",
    "./plugins/withAndroidQueries",
    "@react-native-firebase/app",
  ],

  experiments: {
    typedRoutes: true,
  },

  extra: {
    kakaoNativeAppKey: process.env.MYCODE_KAKAO_NATIVE_APP_KEY,
    kakaoWebAppKey: process.env.MYCODE_KAKAO_REST_API_KEY,
    BACKEND_URL: process.env.MYCODE_BACKEND_URL,
    NAVER_MAP_CLIENT_ID: process.env.NAVER_MAP_CLIENT_ID,
    eas: {
      projectId: process.env.MYCODE_EAS_PROJECT_ID,
    },
  },
};
