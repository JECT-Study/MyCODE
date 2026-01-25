import { useCallback, useEffect, useRef, useState } from "react";

import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

import Chevron from "@/components/icons/Chevron";
import FilterIcon from "@/components/icons/FilterIcon";
import CategoryBottomSheet from "@/components/search/CategoryBottomSheet";
import RegionBottomSheet from "@/components/search/RegionBottomSheet";
import Divider from "@/components/ui/Divider";
import { BACKEND_URL } from "@/constants/ApiUrls";
import { authApi } from "@/features/axios/axiosInstance";
import { useStatusBar } from "@/hooks/useStatusBar";
import { useTabScrollReset } from "@/hooks/useTabScrollReset";
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

export default function SearchScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false); // 무한스크롤로 추가 데이터를 불러오는 중인지 여부 (하단 로딩 인디케이터 표시용)
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL"); // 선택된 카테고리 필터
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] =
    useState<boolean>(false); // 카테고리 바텀시트 열림/닫힘 상태
  const [selectedRegion, setSelectedRegion] = useState<string[]>([]); // 선택된 지역 필터
  const [isRegionFilterOpen, setIsRegionFilterOpen] = useState<boolean>(false); // 지역 바텀시트 열림/닫힘 상태

  const [filterSearchResults, setFilterSearchResults] = useState<
    SearchContentItem[]
  >([]);
  const [isFilterSearchMode, setIsFilterSearchMode] = useState<boolean>(false); // 필터 검색 모드 여부 (카테고리 또는 지역 필터 적용 시)
  const [filterSearchPage, setFilterSearchPage] = useState<number>(1); // 필터 검색 페이지
  const [filterHasMoreData, setFilterHasMoreData] = useState<boolean>(true); // 필터 검색 더 불러올 데이터 있는지

  // 기본 검색 상태 (둘 다 ALL일 때)
  const [defaultSearchResults, setDefaultSearchResults] = useState<
    SearchContentItem[]
  >([]);
  const [defaultSearchPage, setDefaultSearchPage] = useState<number>(1); // 기본 검색 페이지
  const [defaultHasMoreData, setDefaultHasMoreData] = useState<boolean>(true); // 기본 검색 더 불러올 데이터 있는지

  const flatListRef = useRef<FlatList>(null);

  useStatusBar("dark");
  useTabScrollReset(flatListRef);

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

          // contents가 빈 배열이면 더 이상 불러올 데이터가 없음
          if (contents.length === 0 && isLoadMore) {
            setDefaultHasMoreData(false);
            return;
          }

          // API 응답을 SearchContentItem으로 변환
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
            setDefaultSearchResults((prev) => [...prev, ...transformedResults]);
          } else {
            setDefaultSearchResults(transformedResults);
          }

          setDefaultSearchPage(currentPage);
          // 현재 페이지와 총 페이지 수를 비교하거나, contents가 10개 미만이면 마지막 페이지
          const totalPages = Math.ceil(totalCount / 10);
          setDefaultHasMoreData(
            currentPage < totalPages && contents.length === 10,
          );
        } else {
          if (!isLoadMore) {
            setDefaultSearchResults([]);
          }
          setDefaultHasMoreData(false);
        }
      } catch (error) {
        console.error("기본 검색 실패:", error);
        if (!isLoadMore) {
          setDefaultSearchResults([]);
        }
        setDefaultHasMoreData(false);
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

  // 컴포넌트 마운트 시 기본 검색 실행
  useEffect(() => {
    if (selectedCategory === "ALL" && selectedRegion.length === 0) {
      searchDefault(1, false);
      setIsFilterSearchMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedRegion]);

  // 통합 필터 검색 함수 (카테고리와 지역 교집합 검색)
  const searchByFilters = useCallback(
    async (
      category: string,
      regions: string[],
      page: number = 1,
      isLoadMore: boolean = false,
    ) => {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          setIsFilterSearchMode(true);
        }

        // 여러 지역의 키워드를 배열로 변환
        const regionKeywords = regions.map((region) =>
          getRegionKeyword(region),
        );

        // API 파라미터 구성
        const params: any = {
          keyword: "", // 빈 문자열로 검색
          page: page,
          size: SEARCH_LIMIT,
        };

        // 카테고리 필터 조건 추가
        if (category !== "ALL") {
          params.category = category;
        }

        // 지역 필터 조건 추가 (배열로 전달)
        if (regions.length > 0) {
          params.regions = regionKeywords;
        }

        const response = await authApi.get<CategorySearchResponse>(
          `${BACKEND_URL}/search/results`,
          { params },
        );

        if (response.data.isSuccess && response.data.result) {
          const { contentList, pageInfo } = response.data.result;

          // CategorySearchItem을 SearchContentItem으로 변환
          const transformedResults: SearchContentItem[] = contentList.map(
            (item) => ({
              id: item.id,
              title: item.title,
              thumbnailUrl: item.thumbnailUrl || "",
              category: item.category,
              address: item.address,
              date: "", // 필터 검색에는 date 정보가 없음
              views: 0, // 필터 검색에는 views 정보가 없음
            }),
          );

          if (isLoadMore) {
            setFilterSearchResults((prev) => [...prev, ...transformedResults]);
          } else {
            setFilterSearchResults(transformedResults);
          }

          setFilterSearchPage(pageInfo.currentPage);
          setFilterHasMoreData(pageInfo.currentPage < pageInfo.totalPages);
        } else {
          if (!isLoadMore) {
            setFilterSearchResults([]);
          }
          setFilterHasMoreData(false);
        }
      } catch (error) {
        console.error("필터 검색 실패:", error);
        if (!isLoadMore) {
          setFilterSearchResults([]);
        }
        setFilterHasMoreData(false);
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
    (category: string) => {
      setSelectedCategory(category);
      searchByFilters(category, selectedRegion, 1, false);
    },
    [selectedRegion, searchByFilters],
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
    (regions: string[]) => {
      setSelectedRegion(regions);
      searchByFilters(selectedCategory, regions, 1, false);
    },
    [selectedCategory, searchByFilters],
  );

  // 무한스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;

    if (isFilterSearchMode && filterHasMoreData) {
      // 필터 검색 모드에서의 무한스크롤
      const nextPage = filterSearchPage + 1;
      searchByFilters(selectedCategory, selectedRegion, nextPage, true);
    } else if (!isFilterSearchMode && defaultHasMoreData) {
      // 기본 검색 모드에서의 무한스크롤
      const nextPage = defaultSearchPage + 1;
      searchDefault(nextPage, true);
    }
  }, [
    isFilterSearchMode,
    filterHasMoreData,
    filterSearchPage,
    selectedCategory,
    selectedRegion,
    isLoadingMore,
    searchByFilters,
    defaultHasMoreData,
    defaultSearchPage,
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
    if (isFilterSearchMode) {
      await searchByFilters(selectedCategory, selectedRegion, 1, false);
    } else {
      await searchDefault(1, false);
    }
    setRefreshing(false);
  }, [
    isFilterSearchMode,
    selectedCategory,
    selectedRegion,
    searchByFilters,
    searchDefault,
  ]);

  return (
    <View className="flex-1 bg-white">
      <View className="px-[18px] pb-5 pt-3">
        <Pressable
          className="h-12 flex-row items-center rounded-[18px] border border-[#6C4DFF] px-4"
          onPress={() =>
            router.push({
              pathname: "/search-keywords",
              params: {
                category: selectedCategory,
                region: selectedRegion.join(","),
              },
            })
          }
        >
          <Text className="text-[16px] text-[#9E9E9E]">
            이번 주말, 뭐 할지 검색해 볼까?
          </Text>
        </Pressable>
      </View>

      {/* 필터 영역 */}
      <View className="flex-row items-center px-[18px] pb-4">
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
        ref={flatListRef}
        className="pt-5"
        data={isFilterSearchMode ? filterSearchResults : defaultSearchResults}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingBottom: 100,
          flexGrow: 1,
          justifyContent:
            (isFilterSearchMode ? filterSearchResults : defaultSearchResults)
              .length === 0
              ? "center"
              : "flex-start",
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
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              {isFilterSearchMode ? (
                <Text className="text-center text-gray-500">
                  필터 검색 결과가 없습니다.
                </Text>
              ) : (
                <Text className="text-center text-gray-500">
                  검색 결과가 없습니다.
                </Text>
              )}
            </View>
          )
        }
        ListFooterComponent={
          isLoadingMore && !isLoading ? (
            <View className="flex-row items-center justify-center py-4">
              <ActivityIndicator size="large" color="#6C4DFF" />
            </View>
          ) : null
        }
      />

      <CategoryBottomSheet
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
    </View>
  );
}
