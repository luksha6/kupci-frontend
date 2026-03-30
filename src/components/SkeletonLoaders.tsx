import { memo } from "react";

export const ProductCardSkeleton = memo(function ProductCardSkeleton() {
  return (
    <div className="product-card product-card--skeleton" aria-hidden>
      <div className="skeleton skeleton--thumb" />
      <div className="skeleton skeleton--line w-80" />
      <div className="skeleton skeleton--line w-50" />
      <div className="skeleton skeleton--line w-30" />
    </div>
  );
});

export const DiscoverySkeletonGrid = memo(function DiscoverySkeletonGrid({
  count = 12,
}: {
  count?: number;
}) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
});
