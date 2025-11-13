# 마이코드 (MyCode)

> 문화행사 정보를 한 곳에서 관리하고 검색할 수 있는 크로스 플랫폼 애플리케이션

<table>
  <tr>
    <td>
      <a href="https://apps.apple.com/kr/app/%EB%A7%88%EC%9D%B4%EC%BD%94%EB%93%9C/id6751580479">
        <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1280617600" alt="Download on the App Store" height="60">
      </a>
    </td>
    <td style="padding-top: 8px;">
      <a href="https://play.google.com/store/apps/details?id=com.ject3.mycode">
        <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" height="60">
      </a>
    </td>
  </tr>
</table>

<img width="5760" height="3240" alt="27" src="https://github.com/user-attachments/assets/3983cddc-0a54-4617-8ea6-826487bb41ec" />

## 목차

- [소개](#소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)

## 소개

마이코드는 문화행사 정보를 편리하게 검색하고 관리할 수 있는 모바일 애플리케이션입니다.
Expo와 React Native를 기반으로 iOS, Android 플랫폼을 지원합니다.

## 주요 기능

- **홈** - 다양한 문화행사 정보 탐색
- **검색** - 키워드 기반 행사 검색
- **일정 관리** - 관심 있는 행사 일정 관리
- **찜하기** - 관심 행사 북마크
- **지도** - Naver Map 기반 행사 위치 확인
- **마이페이지** - 프로필 및 설정 관리
- **소셜 로그인** - Kakao, Apple 로그인 지원
- **공유** - Kakao 공유 기능

## 기술 스택

### Core

- **React Native** 0.79.3
- **Expo SDK** ~53.0
- **TypeScript** ~5.8.3
- **React** 19.0.0

### Navigation & Routing

- **Expo Router** ~5.1.4
- **React Navigation** 7.x

### Styling

- **NativeWind** 4.x (TailwindCSS for React Native)
- **TailwindCSS** 3.4.17

### State Management

- **Zustand** 5.x

### Key Libraries

- **@react-native-kakao** - Kakao SDK (로그인, 공유)
- **@mj-studio/react-native-naver-map** - Naver Map
- **expo-apple-authentication** - Apple 로그인
- **react-native-calendars** - 캘린더 UI
- **react-native-reanimated** - 애니메이션
- **axios** - HTTP 클라이언트

## 프로젝트 구조

```
JECT-1-FE/
├── app/                    # Expo Router 페이지
│   ├── (tabs)/            # 탭 네비게이션 페이지
│   │   ├── index.tsx         # 홈
│   │   ├── search_tab.tsx    # 검색
│   │   ├── schedule.tsx      # 일정
│   │   └── mypage.tsx        # 마이페이지
│   ├── detail/            # 상세 페이지
│   ├── my/                # 마이페이지 하위 페이지
│   ├── search-keywords/   # 검색 키워드
│   ├── search-results/    # 검색 결과
│   ├── _layout.tsx        # Root Layout
│   └── +not-found.tsx     # 404 페이지
│
├── components/             # 재사용 가능한 컴포넌트
│   ├── ui/                # UI 기본 컴포넌트
│   ├── home/              # 홈 관련 컴포넌트
│   ├── detail/            # 상세 페이지 컴포넌트
│   ├── search/            # 검색 관련 컴포넌트
│   ├── schedule/          # 일정 관련 컴포넌트
│   ├── like/              # 좋아요 관련 컴포넌트
│   └── map/               # 지도 관련 컴포넌트
│
├── features/               # 기능별 모듈
├── hooks/                  # Custom Hooks
├── stores/                 # Zustand 스토어
├── constants/              # 상수 정의
├── types/                  # TypeScript 타입 정의
├── utils/                  # 유틸리티 함수
├── assets/                 # 정적 파일
│   ├── fonts/             # 폰트 파일
│   └── images/            # 이미지 파일
├── scripts/                # 스크립트
├── plugins/                # Expo 플러그인
│
├── app.config.js           # Expo 설정
├── package.json            # 프로젝트 의존성
├── tsconfig.json           # TypeScript 설정
├── tailwind.config.js      # TailwindCSS 설정
├── babel.config.js         # Babel 설정
└── metro.config.js         # Metro 번들러 설정
```
