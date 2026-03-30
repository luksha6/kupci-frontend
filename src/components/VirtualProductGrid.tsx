import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, useMemo, useRef, type RefObject } from "react";
import type { Product } from "../types/product";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { ProductCard } from "./ProductCard";

export interface VirtualProductGridProps {
  items: Product[];
  searchQuery: string;
  onCompare: (id: string, title: string) => void;
  isComparing: (id: string) => boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export const VirtualProductGrid = memo(function VirtualProductGrid({
  items,
  searchQuery,
  onCompare,
  isComparing,
  sentinelRef,
}: VirtualProductGridProps) {
  const narrow = useMediaQuery("(max-width: 720px)");
  const cols = narrow ? 1 : 3;

  const parentRef = useRef<HTMLDivElement>(null);
  const rowCount = useMemo(
    () => Math.max(Math.ceil(items.length / cols), 0),
    [items.length, cols],
  );

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (narrow ? 148 : 168),
    overscan: 6,
  });

  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div ref={parentRef} className="virtual-grid-scroll">
      <div
        className="virtual-grid-inner"
        style={{ height: totalSize, position: "relative" }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * cols;
          const rowItems = items.slice(start, start + cols);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              className={
                narrow ? "virtual-grid-row virtual-grid-row--1" : "virtual-grid-row"
              }
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {rowItems.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  searchQuery={searchQuery}
                  onCompare={onCompare}
                  isComparing={isComparing(p.id)}
                />
              ))}
            </div>
          );
        })}
      </div>
      <div ref={sentinelRef} className="infinite-sentinel" aria-hidden />
    </div>
  );
});
