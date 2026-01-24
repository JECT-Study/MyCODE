import { useCallback, useEffect, useState } from "react";

import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";

import BackArrow from "@/components/icons/BackArrow";
import Chevron from "@/components/icons/Chevron";
import ClearIcon from "@/components/icons/ClearIcon";
import FilterIcon from "@/components/icons/FilterIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import FilterBottomSheet from "@/components/search/CategoryBottomSheet";
import RegionBottomSheet from "@/components/search/RegionBottomSheet";
import CommonModal from "@/components/ui/CommonModal";
import Divider from "@/components/ui/Divider";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import { useStatusBar } from "@/hooks/useStatusBar";
import {
  CategorySearchResponse,
  EventCardProps,
  SEARCH_LIMIT,
  SearchContentItem,
} from "@/types/search";
import {
  getCategoryLabel,
  getRegionKeyword,
  getRegionLabel,
} from "@/utils/searchUtils";

function EventCard({ item, onPress }: EventCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasImage = item.thumbnailUrl && item.thumbnailUrl.trim() !== "";
  const imageSource = hasImage
    ? { uri: item.thumbnailUrl }
    : require("../../assets/images/content_placeholder.png");

  return (
    <Pressable
      className="mb-6 flex w-[48%] items-center"
      onPress={() => onPress(item.id)}
    >
      <View className="h-[208px] w-full overflow-hidden rounded-[11px] bg-gray-200">
        {hasImage ? (
          <>
            {/* Placeholder 이미지 - 항상 표시 */}
            <Image
              source={require("../../assets/images/content_placeholder.png")}
              className="absolute inset-0 h-full w-full"
              resizeMode="cover"
            />
            {/* API 이미지 - 로딩 완료 시 표시 */}
            <Image
              source={imageSource}
              className={`absolute inset-0 h-full w-full ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
          </>
        ) : (
          /* 이미지가 없는 경우 placeholder만 표시 */
          <Image
            source={imageSource}
            className="h-full w-full"
            resizeMode="cover"
          />
        )}
      </View>
      <View className="mt-3 w-full">
        <Text
          className="text-lg font-semibold leading-6 text-gray-800"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="mt-1 text-sm text-gray-500" numberOfLines={1}>
          {item.address}
        </Text>
      </View>
    </Pressable>
  );
}

export default function SearchResults() {
  // URL 파라미터에서 검색어, 카테고리, 지역 값 받기
  const {
    keyword = "",
    category = "ALL",
    region = "",
  } = useLocalSearchParams();

  const [searchText, setSearchText] = useState<string>(keyword as string);
  const [lastValidSearchText, setLastValidSearchText] = useState<string>(
    keyword as string,
  );
  const [searchResults, setSearchResults] = useState<SearchContentItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    category as string,
  );
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] =
    useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string[]>(
    region && region !== "ALL"
      ? (region as string).split(",").filter((r) => r)
      : [],
  );
  const [isRegionFilterOpen, setIsRegionFilterOpen] = useState<boolean>(false);
  const [showEmptyKeywordModal, setShowEmptyKeywordModal] =
    useState<boolean>(false);

  useStatusBar("dark");

  // 기본 검색 함수 (둘 다 ALL일 때)
  const searchDefault = useCallback(
    async (page: number = 1, isLoadMore: boolean = false) => {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        const response = await authApi.get(
          `https://mycodemycode.site/search?page=${page}&limit=10&sort=latest`,
        );

        if (response.data.isSuccess && response.data.result) {
          const { contents, currentPage, totalCount } = response.data.result;

          if (contents.length === 0 && isLoadMore) {
            setHasMoreData(false);
            return;
          }

          const transformedResults: SearchContentItem[] = contents.map(
            (item: any) => ({
              id: item.id,
              title: item.title,
              thumbnailUrl: item.thumbnailUrl || "",
              category: item.category,
              address: item.address,
              date: item.date || "",
              views: item.views || 0,
            }),
          );

          if (isLoadMore) {
            setSearchResults((prev) => [...prev, ...transformedResults]);
          } else {
            setSearchResults(transformedResults);
          }

          setCurrentPage(currentPage);
          const totalPages = Math.ceil(totalCount / 10);
          setHasMoreData(currentPage < totalPages && contents.length === 10);
        } else {
          if (!isLoadMore) {
            setSearchResults([]);
          }
          setHasMoreData(false);
        }
      } catch (error) {
        console.error("기본 검색 실패:", error);
        if (!isLoadMore) {
          setSearchResults([]);
        }
        setHasMoreData(false);
      } finally {
        if (isLoadMore) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  // 검색 실행 함수
  const executeSearch = useCallback(
    async (
      searchKeyword: string,
      page: number = 1,
      isLoadMore: boolean = false,
      regions: string[] = selectedRegion,
    ) => {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        // 여러 지역의 키워드를 배열로 변환
        const regionKeywords = regions.map((region) =>
          getRegionKeyword(region),
        );

        const params: any = {
          keyword: searchKeyword || "", // 빈 문자열도 허용
          page: page,
          size: SEARCH_LIMIT,
        };

        if (selectedCategory !== "ALL") {
          params.category = selectedCategory;
        }

        if (regions.length > 0) {
          params.regions = regionKeywords;
        }

        const response = await authApi.get<CategorySearchResponse>(
          `${BACKEND_URL}/search/results`,
          { params },
        );

        if (response.data.isSuccess && response.data.result) {
          const { contentList, pageInfo } = response.data.result;

          const transformedResults: SearchContentItem[] = contentList.map(
            (item) => ({
              id: item.id,
              title: item.title,
              thumbnailUrl: item.thumbnailUrl || "",
              category: item.category,
              address: item.address,
              date: "",
              views: 0,
            }),
          );

          if (isLoadMore) {
            setSearchResults((prev) => [...prev, ...transformedResults]);
          } else {
            setSearchResults(transformedResults);
          }

          setCurrentPage(pageInfo.currentPage);
          setHasMoreData(pageInfo.currentPage < pageInfo.totalPages);
        } else {
          if (!isLoadMore) {
            setSearchResults([]);
          }
          setHasMoreData(false);
        }
      } catch (error) {
        console.error("검색 실패:", error);
        if (!isLoadMore) {
          setSearchResults([]);
        }
        setHasMoreData(false);
      } finally {
        if (isLoadMore) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [selectedCategory, selectedRegion],
  );

  // 페이지 로드 시 자동 검색 실행
  useEffect(() => {
    // 둘 다 ALL일 때는 기본 검색 API 호출
    if (selectedCategory === "ALL" && selectedRegion.length === 0) {
      searchDefault(1, false);
    } else if (
      // keyword가 있거나, 카테고리나 지역 필터가 설정된 경우 검색 실행
      (keyword && (keyword as string).trim()) ||
      selectedCategory !== "ALL" ||
      selectedRegion.length > 0
    ) {
      executeSearch((keyword as string) || "", 1, false);
    }
  }, [keyword, selectedCategory, selectedRegion, executeSearch, searchDefault]);

  const handleFilterOpen = useCallback(() => {
    setIsCategoryFilterOpen(true);
  }, []);

  const handleFilterClose = useCallback(() => {
    setIsCategoryFilterOpen(false);
  }, []);

  // 카테고리 선택 처리
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // 카테고리 바텀시트에서 검색 버튼 클릭 시
  const handleCategorySearchPress = useCallback(
    async (category: string) => {
      setSelectedCategory(category);
      // 둘 다 ALL일 때는 기본 검색 API 호출
      if (category === "ALL" && selectedRegion.length === 0) {
        searchDefault(1, false);
      } else {
        // 새로운 category 값을 직접 사용하여 검색
        try {
          setIsLoading(true);

          const regionKeywords = selectedRegion.map((region) =>
            getRegionKeyword(region),
          );

          const params: any = {
            keyword: searchText || "",
            page: 1,
            size: SEARCH_LIMIT,
          };

          if (category !== "ALL") {
            params.category = category;
          }

          if (selectedRegion.length > 0) {
            params.regions = regionKeywords;
          }

          const response = await authApi.get<CategorySearchResponse>(
            `${BACKEND_URL}/search/results`,
            { params },
          );

          if (response.data.isSuccess && response.data.result) {
            const { contentList, pageInfo } = response.data.result;

            const transformedResults: SearchContentItem[] = contentList.map(
              (item) => ({
                id: item.id,
                title: item.title,
                thumbnailUrl: item.thumbnailUrl || "",
                category: item.category,
                address: item.address,
                date: "",
                views: 0,
              }),
            );

            setSearchResults(transformedResults);
            setCurrentPage(pageInfo.currentPage);
            setHasMoreData(pageInfo.currentPage < pageInfo.totalPages);
          } else {
            setSearchResults([]);
            setHasMoreData(false);
          }
        } catch (error) {
          console.error("검색 실패:", error);
          setSearchResults([]);
          setHasMoreData(false);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [searchText, selectedRegion, searchDefault],
  );

  const handleRegionFilterOpen = useCallback(() => {
    setIsRegionFilterOpen(true);
  }, []);

  const handleRegionFilterClose = useCallback(() => {
    setIsRegionFilterOpen(false);
  }, []);

  // 지역 선택 처리
  const handleRegionSelect = useCallback((regions: string[]) => {
    setSelectedRegion(regions);
  }, []);

  // 지역 바텀시트에서 검색 버튼 클릭 시
  const handleRegionSearchPress = useCallback(
    async (regions: string[]) => {
      setSelectedRegion(regions);
      // 둘 다 ALL일 때는 기본 검색 API 호출
      if (selectedCategory === "ALL" && regions.length === 0) {
        searchDefault(1, false);
      } else {
        // 새로운 regions 값을 직접 사용하여 검색
        try {
          setIsLoading(true);

          const regionKeywords = regions.map((region) =>
            getRegionKeyword(region),
          );

          const params: any = {
            keyword: searchText || "",
            page: 1,
            size: SEARCH_LIMIT,
          };

          if (selectedCategory !== "ALL") {
            params.category = selectedCategory;
          }

          if (regions.length > 0) {
            params.regions = regionKeywords;
          }

          const response = await authApi.get<CategorySearchResponse>(
            `${BACKEND_URL}/search/results`,
            { params },
          );

          if (response.data.isSuccess && response.data.result) {
            const { contentList, pageInfo } = response.data.result;

            const transformedResults: SearchContentItem[] = contentList.map(
              (item) => ({
                id: item.id,
                title: item.title,
                thumbnailUrl: item.thumbnailUrl || "",
                category: item.category,
                address: item.address,
                date: "",
                views: 0,
              }),
            );

            setSearchResults(transformedResults);
            setCurrentPage(pageInfo.currentPage);
            setHasMoreData(pageInfo.currentPage < pageInfo.totalPages);
          } else {
            setSearchResults([]);
            setHasMoreData(false);
          }
        } catch (error) {
          console.error("검색 실패:", error);
          setSearchResults([]);
          setHasMoreData(false);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [searchText, selectedCategory, searchDefault],
  );

  // 무한스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (searchResults.length > 0 && hasMoreData && !isLoadingMore) {
      const nextPage = currentPage + 1;
      // 둘 다 ALL일 때는 기본 검색 API 호출
      if (selectedCategory === "ALL" && selectedRegion.length === 0) {
        searchDefault(nextPage, true);
      } else {
        executeSearch(searchText, nextPage, true);
      }
    }
  }, [
    searchResults.length,
    hasMoreData,
    isLoadingMore,
    searchText,
    currentPage,
    selectedCategory,
    selectedRegion.length,
    executeSearch,
    searchDefault,
  ]);

  // 카드 클릭 핸들러
  const handleCardPress = useCallback(
    (id: number) => {
      // 바텀시트가 열려있으면 닫기
      if (isCategoryFilterOpen) {
        setIsCategoryFilterOpen(false);
      }
      if (isRegionFilterOpen) {
        setIsRegionFilterOpen(false);
      }
      router.push(`/detail/${id}`);
    },
    [isCategoryFilterOpen, isRegionFilterOpen],
  );

  // 이벤트 카드 렌더링 함수
  const renderEventCard = useCallback(
    ({ item }: { item: SearchContentItem }) => {
      return <EventCard item={item} onPress={handleCardPress} />;
    },
    [handleCardPress],
  );

  // 새로고침 핸들러
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // 둘 다 ALL일 때는 기본 검색 API 호출
    if (selectedCategory === "ALL" && selectedRegion.length === 0) {
      await searchDefault(1, false);
    } else {
      await executeSearch(searchText, 1, false);
    }
    setRefreshing(false);
  }, [
    searchText,
    selectedCategory,
    selectedRegion.length,
    executeSearch,
    searchDefault,
  ]);

  return (
    <View className="flex-1 bg-white pt-[65px]">
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
              className="ml-3 flex-1 text-[15px] text-gray-700"
              placeholder="검색어를 입력해주세요."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() => {
                if (!searchText.trim()) {
                  setShowEmptyKeywordModal(true);
                  return;
                }
                setLastValidSearchText(searchText);
                executeSearch(searchText, 1, false);
              }}
              returnKeyType="search"
              style={Platform.OS === "android" ? { paddingVertical: 12 } : {}}
            />
            {searchText.trim() && (
              <Pressable
                onPress={() => setSearchText("")}
                className="ml-2"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ClearIcon />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* 필터 영역 */}
      <View className="flex-row items-center px-4 pb-4">
        <View className="mr-4 flex-row items-center">
          <FilterIcon
            size={19}
            color={isRegionFilterOpen ? "#9CA3AF" : "#424242"}
          />
          <Text
            className={`ml-2 text-[14px] ${
              isRegionFilterOpen ? "text-[#9CA3AF]" : "text-[#424242]"
            }`}
          >
            필터
          </Text>
        </View>

        <Pressable
          className={`mr-3 flex-row items-center rounded-full px-3 py-2.5 ${
            isCategoryFilterOpen || selectedCategory !== "ALL"
              ? "border border-[#6C4DFF] bg-[#DFD8FD]"
              : isRegionFilterOpen
                ? "border border-[#E0E0E0] bg-gray-100"
                : "border border-[#E0E0E0] bg-white"
          } ${isRegionFilterOpen ? "opacity-50" : "opacity-100"}`}
          onPress={!isRegionFilterOpen ? handleFilterOpen : undefined}
          disabled={isRegionFilterOpen}
        >
          <Text
            className={`mr-1 text-[14px] ${
              isCategoryFilterOpen || selectedCategory !== "ALL"
                ? "text-[#6C4DFF]"
                : isRegionFilterOpen
                  ? "text-[#9CA3AF]"
                  : "text-[#424242]"
            }`}
          >
            {getCategoryLabel(selectedCategory)}
          </Text>
          <Chevron
            direction="down"
            size={12}
            color={
              isCategoryFilterOpen || selectedCategory !== "ALL"
                ? "#6C4DFF"
                : isRegionFilterOpen
                  ? "#9CA3AF"
                  : "#424242"
            }
          />
        </Pressable>

        <Pressable
          className={`flex-row items-center rounded-full px-3 py-2.5 ${
            isRegionFilterOpen || selectedRegion.length > 0
              ? "border border-[#6C4DFF] bg-[#DFD8FD]"
              : isCategoryFilterOpen
                ? "border border-[#E0E0E0] bg-gray-100"
                : "border border-[#E0E0E0] bg-white"
          } ${isCategoryFilterOpen ? "opacity-50" : "opacity-100"}`}
          onPress={!isCategoryFilterOpen ? handleRegionFilterOpen : undefined}
          disabled={isCategoryFilterOpen}
        >
          <Text
            className={`mr-1 text-[14px] ${
              isRegionFilterOpen || selectedRegion.length > 0
                ? "text-[#6C4DFF]"
                : isCategoryFilterOpen
                  ? "text-[#9CA3AF]"
                  : "text-[#424242]"
            }`}
          >
            {selectedRegion.length === 0
              ? "지역"
              : selectedRegion.length === 1
                ? getRegionLabel(selectedRegion[0])
                : `${getRegionLabel(selectedRegion[0])} 외 ${selectedRegion.length - 1}`}
          </Text>
          <Chevron
            direction="down"
            size={12}
            color={
              isRegionFilterOpen || selectedRegion.length > 0
                ? "#6C4DFF"
                : isCategoryFilterOpen
                  ? "#9CA3AF"
                  : "#424242"
            }
          />
        </Pressable>
      </View>

      <Divider />

      <FlatList
        className="flex-1 pt-8"
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
          flexGrow: 1,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        renderItem={renderEventCard}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6C4DFF"
            colors={["#6C4DFF"]}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#6C4DFF" />
              <Text className="mt-4 text-center text-gray-500">검색 중...</Text>
            </View>
          ) : (
            <View className="mt-[-70px] flex-1 items-center justify-center">
              <Text className="text-center text-xl font-medium text-gray-700">
                일치하는 검색결과가 없어요.
              </Text>
              <Text className="mt-1 text-center text-lg text-gray-500">
                검색어를 변경해 보세요!
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View className="flex-row items-center justify-center py-4">
              <ActivityIndicator size="large" color="#6C4DFF" />
            </View>
          ) : null
        }
      />

      <FilterBottomSheet
        isOpen={isCategoryFilterOpen}
        onClose={handleFilterClose}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        onSearch={handleCategorySearchPress}
      />

      <RegionBottomSheet
        isOpen={isRegionFilterOpen}
        onClose={handleRegionFilterClose}
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
        onSearch={handleRegionSearchPress}
      />

      <CommonModal
        visible={showEmptyKeywordModal}
        onClose={() => {
          setSearchText(lastValidSearchText);
          setShowEmptyKeywordModal(false);
        }}
        mainTitle="검색어를 입력해주세요."
        confirmText="확인"
        showCancelButton={false}
        onConfirm={() => {
          setSearchText(lastValidSearchText);
          setShowEmptyKeywordModal(false);
        }}
      />
    </View>
  );
}
