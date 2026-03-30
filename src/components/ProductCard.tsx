import { memo, useCallback } from "react";
import type { Product } from "../types/product";
import { SearchHighlight } from "./SearchHighlight";

function primaryPrice(p: Product): number {
  return p.pricingTiers[0]?.price ?? 0;
}

export interface ProductCardProps {
  product: Product;
  searchQuery: string;
  onCompare: (id: string, title: string) => void;
  isComparing: boolean;
}

export const ProductCard = memo(function ProductCard({
  product,
  searchQuery,
  onCompare,
  isComparing,
}: ProductCardProps) {
  const price = primaryPrice(product);
  const onClick = useCallback(() => {
    onCompare(product.id, product.title);
  }, [onCompare, product.id, product.title]);

  return (
    <article className="product-card">
      <div className="product-card__media" aria-hidden>
        <span className="product-card__badge">{product.category}</span>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">
          <SearchHighlight text={product.title} query={searchQuery} />
        </h3>
        <p className="product-card__meta">
          {product.metadata.brand} · {product.rating.toFixed(1)}★ (
          {product.reviewCount})
        </p>
        <p className="product-card__tags">
          {product.tags.slice(0, 3).join(" · ")}
        </p>
        <div className="product-card__footer">
          <span className="product-card__price">
            {price.toFixed(0)} {product.pricingTiers[0]?.currency ?? "EUR"}
          </span>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClick}
            aria-pressed={isComparing}
          >
            {isComparing ? "Remove" : "Compare"}
          </button>
        </div>
      </div>
    </article>
  );
});
