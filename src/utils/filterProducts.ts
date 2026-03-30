import type { Product, SortOption } from "../types/product";
import type { FacetFilters } from "./urlParams";

function primaryPrice(p: Product): number {
  const t = p.pricingTiers[0];
  return t ? t.price : 0;
}

function matchesQuery(p: Product, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const hay = [
    p.title,
    p.description,
    p.metadata.brand,
    p.category,
    ...p.tags,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(s);
}

export function filterAndSortProducts(
  products: Product[],
  f: FacetFilters,
): Product[] {
  let list = products.filter((p) => {
    if (f.categories.length > 0 && !f.categories.includes(p.category)) {
      return false;
    }
    const price = primaryPrice(p);
    if (f.minPrice != null && price < f.minPrice) return false;
    if (f.maxPrice != null && price > f.maxPrice) return false;
    if (f.minRating != null && p.rating < f.minRating) return false;
    if (!matchesQuery(p, f.q)) return false;
    return true;
  });

  const sort = f.sort;
  list = [...list].sort((a, b) => {
    switch (sort as SortOption) {
      case "price_asc":
        return primaryPrice(a) - primaryPrice(b);
      case "price_desc":
        return primaryPrice(b) - primaryPrice(a);
      case "rating":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case "newest":
      default:
        return b.createdAt - a.createdAt;
    }
  });

  return list;
}
