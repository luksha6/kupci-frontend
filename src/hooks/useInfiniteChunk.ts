import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_CHUNK = 36;

/**
 * IntersectionObserver grows how many items from `items` are exposed; pair with a virtual list for performance.
 */
export function useInfiniteChunk<T>(
  items: T[],
  chunkSize: number = DEFAULT_CHUNK,
) {
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(chunkSize, items.length),
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(Math.min(chunkSize, items.length));
  }, [items, chunkSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visibleCount >= items.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleCount((c) => Math.min(c + chunkSize, items.length));
        }
      },
      { root: null, rootMargin: "320px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [items.length, visibleCount, chunkSize]);

  const slice = items.slice(0, visibleCount);

  const resetWindow = useCallback(() => {
    setVisibleCount(Math.min(chunkSize, items.length));
  }, [chunkSize, items.length]);

  return {
    slice,
    sentinelRef,
    resetWindow,
    hasMore: visibleCount < items.length,
  };
}
