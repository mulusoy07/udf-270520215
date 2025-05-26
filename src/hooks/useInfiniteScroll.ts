
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

export const useInfiniteScroll = (
  callback: () => void,
  options: UseInfiniteScrollOptions
) => {
  const { hasMore, isLoading, threshold = 100 } = options;
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    if (isNearBottom && hasMore && !isLoading && !isFetching) {
      setIsFetching(true);
      callback();
    }
  }, [callback, hasMore, isLoading, isFetching, threshold]);

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false);
    }
  }, [isLoading]);

  return { handleScroll, isFetching };
};
