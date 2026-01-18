#!/bin/bash

# EAS 빌드 전에 Secret 환경변수에서 Firebase 설정 파일 생성
# EAS file type secret은 base64 인코딩된 내용을 환경변수로 전달

if [ -n "$GOOGLE_SERVICES_JSON" ]; then
  # 파일 경로인지 base64 문자열인지 확인
  if [ -f "$GOOGLE_SERVICES_JSON" ]; then
    cp "$GOOGLE_SERVICES_JSON" ./google-services.json
  else
    echo "$GOOGLE_SERVICES_JSON" | base64 -d > ./google-services.json
  fi
  echo "✓ google-services.json created"
fi

if [ -n "$GOOGLE_SERVICES_PLIST" ]; then
  if [ -f "$GOOGLE_SERVICES_PLIST" ]; then
    cp "$GOOGLE_SERVICES_PLIST" ./GoogleService-Info.plist
  else
    echo "$GOOGLE_SERVICES_PLIST" | base64 -d > ./GoogleService-Info.plist
  fi
  echo "✓ GoogleService-Info.plist created"
fi
