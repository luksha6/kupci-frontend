import { AnimatePresence, motion } from "framer-motion";
import { memo, useCallback } from "react";
import type { ProductCategory, SortOption } from "../types/product";
import type { FacetFilters } from "../utils/urlParams";
import { ALL_CATEGORIES } from "../utils/urlParams";

export interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
  filters: FacetFilters;
  patchFilters: (patch: Partial<FacetFilters>) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Rating" },
];

const CATEGORY_LABEL: Record<ProductCategory, string> = {
  tech: "Tech",
  home: "Home",
  fashion: "Fashion",
  outdoor: "Outdoor",
  books: "Books",
};

export const FilterSidebar = memo(function FilterSidebar({
  open,
  onClose,
  filters,
  patchFilters,
}: FilterSidebarProps) {
  const toggleCategory = useCallback(
    (c: ProductCategory) => {
      const has = filters.categories.includes(c);
      const categories = has
        ? filters.categories.filter((x) => x !== c)
        : [...filters.categories, c];
      patchFilters({ categories });
    },
    [filters.categories, patchFilters],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="sidebar-backdrop"
            aria-label="Close filters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="filter-sidebar"
            initial={{ x: "-104%" }}
            animate={{ x: 0 }}
            exit={{ x: "-104%" }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-sidebar-title"
          >
            <div className="filter-sidebar__header">
              <h2 id="filter-sidebar-title">Filters</h2>
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                Close
              </button>
            </div>

            <div className="filter-block">
              <h3>Categories</h3>
              <ul className="filter-chips">
                {ALL_CATEGORIES.map((c) => {
                  const active = filters.categories.includes(c);
                  return (
                    <li key={c}>
                      <button
                        type="button"
                        className={
                          active ? "chip chip--active" : "chip"
                        }
                        onClick={() => toggleCategory(c)}
                        aria-pressed={active}
                      >
                        {CATEGORY_LABEL[c]}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="filter-block">
              <h3>Price (EUR)</h3>
              <div className="filter-range">
                <label>
                  Min
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={filters.minPrice ?? ""}
                    placeholder="Any"
                    onChange={(e) => {
                      const v = e.target.value;
                      patchFilters({
                        minPrice: v === "" ? null : Number(v),
                      });
                    }}
                  />
                </label>
                <label>
                  Max
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={filters.maxPrice ?? ""}
                    placeholder="Any"
                    onChange={(e) => {
                      const v = e.target.value;
                      patchFilters({
                        maxPrice: v === "" ? null : Number(v),
                      });
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="filter-block">
              <h3>Minimum rating</h3>
              <div className="filter-range">
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={filters.minRating ?? 0}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    patchFilters({ minRating: v === 0 ? null : v });
                  }}
                />
                <span className="muted">
                  {filters.minRating != null
                    ? `${filters.minRating}+ stars`
                    : "Any"}
                </span>
              </div>
            </div>

            <div className="filter-block">
              <h3>Sort</h3>
              <select
                className="select"
                value={filters.sort}
                onChange={(e) =>
                  patchFilters({ sort: e.target.value as SortOption })
                }
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
});
