import { useCallback, useEffect, useRef, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import BackArrow from "@/components/icons/BackArrow";
import ClearIcon from "@/components/icons/ClearIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import { useStatusBar } from "@/hooks/useStatusBar";
import { RecentSearchResponse } from "@/types/search";

export default function SearchKeywords() {
  const [searchWord, setSearchWord] = useState<string>("");
  const [recentSearchWords, setRecentSearchWords] = useState<string[]>([]);
  const inputRef = useRef<TextInput>(null);

  // URL 파라미터에서 카테고리와 지역 값 받기
  const { category = "ALL", region = "" } = useLocalSearchParams();

  useStatusBar("dark");

  useFocusEffect(
    useCallback(() => {
      fetchRecentSearches();
    }, []),
  );

  // 페이지 진입 0.6초 후 자동 포커스
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const fetchRecentSearches = async () => {
    try {
      const response = await authApi.get<RecentSearchResponse>(
        `${BACKEND_URL}/search/recent`,
      );
      if (response.data.isSuccess && response.data.result) {
        setRecentSearchWords(response.data.result);
      }
    } catch (error) {
      console.error("최근 검색어 로딩 실패:", error);
      setRecentSearchWords([]);
    }
  };

  // 최근 검색어 클릭 처리
  const handleRecentSearchClick = (keyword: string) => {
    setSearchWord(keyword);
    // /search-results 페이지로 이동하면서 검색어와 필터 정보 전달
    router.push({
      pathname: "/search-results",
      params: {
        keyword: keyword,
        category: category,
        region: region,
      },
    });
  };

  // 최근 검색어 삭제 처리
  const handleDeleteRecentSearch = async (keyword: string) => {
    try {
      const response = await authApi.delete(
        `${BACKEND_URL}/search/keywords/${encodeURIComponent(keyword)}`,
      );
      if (response.data.isSuccess) {
        // 삭제 성공 시 목록에서 제거
        setRecentSearchWords((prev) => prev.filter((item) => item !== keyword));
      }
    } catch (error) {
      console.error("최근 검색어 삭제 실패:", error);
    }
  };

  // 최근 검색어 전체 삭제 처리
  const handleDeleteAllRecentSearches = async () => {
    try {
      const response = await authApi.delete(`${BACKEND_URL}/search/keywords`);
      if (response.data.isSuccess) {
        // 전체 삭제 성공 시 목록 비우기
        setRecentSearchWords([]);
      }
    } catch (error) {
      console.error("최근 검색어 전체 삭제 실패:", error);
    }
  };

  // 검색 처리 함수
  const handleSearch = async () => {
    if (searchWord.trim()) {
      // /search API 호출하여 검색어 저장
      try {
        await authApi.get(`${BACKEND_URL}/search`, {
          params: {
            keyword: searchWord,
            page: 1,
            limit: 10,
            sort: "latest",
          },
        });
      } catch (error) {
        console.error("검색 API 호출 실패:", error);
      }

      // /search-results 페이지로 이동하면서 검색어와 필터 정보 전달
      router.push({
        pathname: "/search-results",
        params: {
          keyword: searchWord,
          category: category,
          region: region,
        },
      });
    }
  };

  return (
    <View className="flex-1 bg-white pt-[65px]">
      {/* 검색바 영역 */}
      <View className="px-4 pb-4 pt-2">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <BackArrow />
          </Pressable>
          <View
            className={`flex-1 flex-row items-center rounded-full border-[1.2px] border-[#6C4DFF] bg-white px-4 ${Platform.OS === "ios" ? "py-3" : ""}`}
          >
            <SearchIcon size={20} color="#6C4DFF" />
            <TextInput
              ref={inputRef}
              className="ml-3 flex-1 text-[15px] text-gray-700"
              placeholder="검색어를 입력해주세요."
              placeholderTextColor="#9CA3AF"
              value={searchWord}
              onChangeText={setSearchWord}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              style={Platform.OS === "android" ? { paddingVertical: 12 } : {}}
            />

            {searchWord.trim() && (
              <Pressable
                onPress={() => setSearchWord("")}
                className="ml-2"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ClearIcon />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* 최근 검색어 영역 */}
      {recentSearchWords.length > 0 ? (
        <View className="px-4 py-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-medium text-gray-800">
              최근 검색어
            </Text>
            <Pressable onPress={handleDeleteAllRecentSearches}>
              <Text className="text-base text-gray-500">전체삭제</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-4 px-4"
          >
            <View className="flex-row gap-2">
              {recentSearchWords.map((keyword, index) => (
                <View
                  key={index}
                  className="flex-row items-center gap-x-1 rounded-full bg-[#F4F2FF] px-3 py-1.5"
                >
                  <Pressable onPress={() => handleRecentSearchClick(keyword)}>
                    <Text className="text-base text-[#6C4DFF]">{keyword}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteRecentSearch(keyword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <CloseIcon size={16} />
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View className="mt-[-100px] flex-1 items-center justify-center">
          <Text className="text-center text-xl font-medium text-gray-700">
            최근 검색어가 없어요.
          </Text>
          <Text className="mt-1 text-center text-lg text-gray-500">
            관심사를 검색해보세요!
          </Text>
        </View>
      )}
    </View>
  );
}
