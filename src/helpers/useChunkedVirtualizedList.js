import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_BATCH_SIZE = 20;
const DEFAULT_ROOT_MARGIN = '320px 0px';

const useChunkedVirtualizedList = (
  items,
  { batchSize = DEFAULT_BATCH_SIZE, root = null, rootMargin = DEFAULT_ROOT_MARGIN } = {}
) => {
  const safeItems = Array.isArray(items) ? items : [];
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const loaderRef = useRef(null);

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [safeItems, batchSize]);

  useEffect(() => {
    const loaderNode = loaderRef.current;
    if (!loaderNode || visibleCount >= safeItems.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((currentCount) =>
            Math.min(currentCount + batchSize, safeItems.length)
          );
        }
      },
      {
        root,
        rootMargin,
        threshold: 0.1,
      }
    );

    observer.observe(loaderNode);

    return () => {
      observer.disconnect();
    };
  }, [batchSize, root, rootMargin, safeItems.length, visibleCount]);

  const visibleItems = useMemo(
    () => safeItems.slice(0, visibleCount),
    [safeItems, visibleCount]
  );

  return {
    visibleItems,
    visibleCount,
    totalCount: safeItems.length,
    hasMore: visibleCount < safeItems.length,
    loaderRef,
  };
};

export default useChunkedVirtualizedList;