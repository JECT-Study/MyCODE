import { View } from "react-native";

import Skeleton from "@/components/ui/Skeleton";

// 맞춤 콘텐츠 카드 스켈레톤
function RecommendationCardSkeleton() {
  return (
    <View className="flex-row">
      <Skeleton width={120} height={90} borderRadius={10} />
      <View className="ml-3.5 flex-1 justify-center">
        <Skeleton
          width="95%"
          height={18}
          borderRadius={4}
          style={{ marginBottom: 10 }}
        />
        <Skeleton
          width="50%"
          height={14}
          borderRadius={4}
          style={{ marginBottom: 4 }}
        />
        <Skeleton width="70%" height={14} borderRadius={4} />
      </View>
    </View>
  );
}

// 핫한 축제 카드 스켈레톤
function HotCardSkeleton() {
  return (
    <View style={{ width: 154 }}>
      <Skeleton width={154} height={154} borderRadius={14} />
      <View className="mt-2">
        <Skeleton
          width={50}
          height={28}
          borderRadius={14}
          style={{ marginBottom: 8 }}
        />
        <Skeleton
          width="95%"
          height={18}
          borderRadius={4}
          style={{ marginBottom: 4 }}
        />
        <Skeleton
          width="60%"
          height={18}
          borderRadius={4}
          style={{ marginBottom: 6 }}
        />
      </View>
    </View>
  );
}

// 금주 콘텐츠 카드 스켈레톤
function WeeklyCardSkeleton() {
  return (
    <View className="flex-row">
      <Skeleton width={92} height={92} borderRadius={8} />
      <View className="ml-3.5 flex-1 justify-center">
        <Skeleton
          width="95%"
          height={18}
          borderRadius={4}
          style={{ marginBottom: 10 }}
        />
        <Skeleton
          width="55%"
          height={14}
          borderRadius={4}
          style={{ marginBottom: 4 }}
        />
        <Skeleton width="70%" height={14} borderRadius={4} />
      </View>
    </View>
  );
}

// 이런 축제 어때요 카드 스켈레톤
function MoreCardSkeleton() {
  return (
    <View style={{ width: 154 }}>
      <Skeleton width={154} height={92} borderRadius={14} />
      <View className="mt-2">
        <Skeleton
          width={50}
          height={28}
          borderRadius={14}
          style={{ marginBottom: 8 }}
        />
        <Skeleton
          width="95%"
          height={18}
          borderRadius={4}
          style={{ marginBottom: 4 }}
        />
        <Skeleton
          width="60%"
          height={18}
          borderRadius={4}
          style={{ marginBottom: 8 }}
        />
      </View>
    </View>
  );
}

export default function HomeSkeleton() {
  return (
    <View className="gap-y-[34px]">
      {/* 맞춤 콘텐츠 섹션 */}
      <View className="py-2.5">
        {/* 섹션 타이틀 */}
        <View className="mb-3 px-[18px]">
          <Skeleton width={273} height={22} borderRadius={4} />
        </View>

        {/* 필터 버튼 4개 (h-9 = 36px, w-14 = 56px, rounded-full) */}
        <View className="mb-5 flex-row gap-x-2.5 px-[18px]">
          <Skeleton width={56} height={36} borderRadius={18} />
          <Skeleton width={56} height={36} borderRadius={18} />
          <Skeleton width={56} height={36} borderRadius={18} />
          <Skeleton width={56} height={36} borderRadius={18} />
        </View>

        {/* 카드 2열 (가로 스크롤, 각 열에 3개 카드) */}
        <View className="flex-row px-[18px]" style={{ gap: 14 }}>
          {/* 1열 */}
          <View style={{ width: 287, gap: 15.5 }}>
            <RecommendationCardSkeleton />
            <RecommendationCardSkeleton />
            <RecommendationCardSkeleton />
          </View>
          {/* 2열 */}
          <View style={{ width: 287, gap: 15.5 }}>
            <RecommendationCardSkeleton />
            <RecommendationCardSkeleton />
            <RecommendationCardSkeleton />
          </View>
        </View>
      </View>

      {/* 이번달 핫한 축제 섹션 */}
      <View className="py-2.5">
        {/* 섹션 타이틀 */}
        <View className="mb-5 px-[18px]">
          <Skeleton width={140} height={22} borderRadius={4} />
        </View>

        {/* 가로 스크롤 카드 (gap-x-3.5 = 14px) */}
        <View className="flex-row px-[18px]" style={{ gap: 14 }}>
          <HotCardSkeleton />
          <HotCardSkeleton />
          <HotCardSkeleton />
        </View>
      </View>

      {/* 금주 콘텐츠 섹션 */}
      <View className="py-2.5">
        {/* 섹션 타이틀 */}
        <View className="mb-3 px-[18px]">
          <Skeleton width={160} height={22} borderRadius={4} />
        </View>

        {/* 날짜 버튼들 (h-[61px] w-[45px], gap-x-2 = 8px) */}
        <View className="mb-5 flex-row px-[18px]" style={{ gap: 8 }}>
          <Skeleton width={45} height={61} borderRadius={16} />
          <Skeleton width={45} height={61} borderRadius={16} />
          <Skeleton width={45} height={61} borderRadius={16} />
          <Skeleton width={45} height={61} borderRadius={16} />
          <Skeleton width={45} height={61} borderRadius={16} />
          <Skeleton width={45} height={61} borderRadius={16} />
          <Skeleton width={45} height={61} borderRadius={16} />
        </View>

        {/* 카드 2열 (가로 스크롤, 각 열에 3개 카드) */}
        <View className="flex-row px-[18px]" style={{ gap: 14 }}>
          {/* 1열 */}
          <View style={{ width: 285, gap: 15.5 }}>
            <WeeklyCardSkeleton />
            <WeeklyCardSkeleton />
            <WeeklyCardSkeleton />
          </View>
          {/* 2열 */}
          <View style={{ width: 285, gap: 15.5 }}>
            <WeeklyCardSkeleton />
            <WeeklyCardSkeleton />
            <WeeklyCardSkeleton />
          </View>
        </View>

        {/* 더보기 버튼 (h-14 = 56px, rounded-lg = 8px) */}
        <View className="mt-6 px-[18px]">
          <Skeleton width="100%" height={56} borderRadius={8} />
        </View>
      </View>

      {/* 이런 축제 어때요 섹션 */}
      <View className="py-2.5 pb-6">
        {/* 섹션 타이틀 + 더보기 */}
        <View className="mb-5 flex-row items-center justify-between px-[18px]">
          <Skeleton width={140} height={22} borderRadius={4} />
          <Skeleton width={50} height={16} borderRadius={4} />
        </View>

        {/* 가로 스크롤 카드 (gap-x-3.5 = 14px) */}
        <View className="flex-row px-[18px]" style={{ gap: 14 }}>
          <MoreCardSkeleton />
          <MoreCardSkeleton />
          <MoreCardSkeleton />
        </View>
      </View>
    </View>
  );
}
