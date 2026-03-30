import type { ProductCategory, SortOption } from "../types/product";

export const ALL_CATEGORIES: ProductCategory[] = [
  "tech",
  "home",
  "fashion",
  "outdoor",
  "books",
];

export interface FacetFilters {
  q: string;
  categories: ProductCategory[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  sort: SortOption;
}

const DEFAULT_FILTERS: FacetFilters = {
  q: "",
  categories: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  sort: "newest",
};

function parseCategoryList(raw: string | null): ProductCategory[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((c): c is ProductCategory =>
      ALL_CATEGORIES.includes(c as ProductCategory),
    );
}

function parseNum(raw: string | null): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function parseSort(raw: string | null): SortOption {
  if (
    raw === "newest" ||
    raw === "price_asc" ||
    raw === "price_desc" ||
    raw === "rating"
  ) {
    return raw;
  }
  return "newest";
}

export function filtersFromSearchParams(
  searchParams: URLSearchParams,
): FacetFilters {
  return {
    q: searchParams.get("q")?.trim() ?? "",
    categories: parseCategoryList(searchParams.get("category")),
    minPrice: parseNum(searchParams.get("minPrice")),
    maxPrice: parseNum(searchParams.get("maxPrice")),
    minRating: parseNum(searchParams.get("minRating")),
    sort: parseSort(searchParams.get("sort")),
  };
}

/** Build a new URLSearchParams from facet state (omit defaults for cleaner URLs). */
export function searchParamsFromFilters(
  filters: FacetFilters,
  prev?: URLSearchParams,
): URLSearchParams {
  const next = new URLSearchParams(prev ?? undefined);

  const setOrDelete = (key: string, value: string | null | undefined) => {
    if (value == null || value === "") next.delete(key);
    else next.set(key, value);
  };

  setOrDelete("q", filters.q || undefined);

  if (filters.categories.length > 0) {
    next.set("category", filters.categories.join(","));
  } else {
    next.delete("category");
  }

  if (filters.minPrice != null) next.set("minPrice", String(filters.minPrice));
  else next.delete("minPrice");

  if (filters.maxPrice != null) next.set("maxPrice", String(filters.maxPrice));
  else next.delete("maxPrice");

  if (filters.minRating != null) {
    next.set("minRating", String(filters.minRating));
  } else {
    next.delete("minRating");
  }

  if (filters.sort !== DEFAULT_FILTERS.sort) {
    next.set("sort", filters.sort);
  } else {
    next.delete("sort");
  }

  return next;
}

export function defaultFacetFilters(): FacetFilters {
  return { ...DEFAULT_FILTERS };
}
