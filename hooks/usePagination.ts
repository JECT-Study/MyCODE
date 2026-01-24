import { useCallback, useState } from "react";

interface UsePaginationOptions<T> {
  fetchFn: (page: number) => Promise<{ data: T[]; hasMore: boolean }>;
  initialPage?: number;
}

interface UsePaginationResult<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMoreData: boolean;
  error: Error | null;
  loadMore: () => void;
  refresh: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
}

/**
 * 페이지네이션 로직을 처리하는 훅
 * @param options - 페이지네이션 옵션
 */
export const usePagination = <T>({
  fetchFn,
  initialPage = 0,
}: UsePaginationOptions<T>): UsePaginationResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setPage(initialPage);
      }

      try {
        const currentPage = isLoadMore ? page + 1 : initialPage;
        const { data: newData, hasMore } = await fetchFn(currentPage);

        setData((prev) => (isLoadMore ? [...prev, ...newData] : newData));
        setHasMoreData(hasMore);
        if (isLoadMore) setPage(currentPage);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [fetchFn, page, initialPage],
  );

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreData && !isLoading) {
      fetchData(true);
    }
  }, [isLoadingMore, hasMoreData, isLoading, fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(false);
  }, [fetchData]);

  return {
    data,
    isLoading,
    isLoadingMore,
    hasMoreData,
    error,
    loadMore,
    refresh,
    setData,
  };
};
