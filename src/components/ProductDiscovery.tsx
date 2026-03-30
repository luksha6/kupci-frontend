import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useComparison } from "../context/ComparisonContext";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import { useInfiniteChunk } from "../hooks/useInfiniteChunk";
import { useUrlFilters } from "../hooks/useUrlFilters";
import { MOCK_PRODUCTS } from "../utils/mockData";
import { filterAndSortProducts } from "../utils/filterProducts";
import { DiscoverySkeletonGrid } from "./SkeletonLoaders";
import { FilterSidebar } from "./FilterSidebar";
import { ToastStack } from "./ToastStack";
import { VirtualProductGrid } from "./VirtualProductGrid";

export const ProductDiscovery = memo(function ProductDiscovery() {
  const { filters, patchFilters, searchParams } = useUrlFilters();
  const {
    addToComparison,
    removeFromComparison,
    isComparing,
    toasts,
    dismissToast,
  } = useComparison();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [qInput, setQInput] = useState(filters.q);

  useEffect(() => {
    setQInput(filters.q);
  }, [filters.q]);

  const debouncedPatchQ = useDebouncedCallback((q: string) => {
    patchFilters({ q });
  }, 280);

  const onSearchChange = useCallback(
    (v: string) => {
      setQInput(v);
      debouncedPatchQ(v);
    },
    [debouncedPatchQ],
  );

  const filtered = useMemo(
    () => filterAndSortProducts(MOCK_PRODUCTS, filters),
    [filters],
  );

  const { slice, sentinelRef } = useInfiniteChunk(filtered);

  const urlSignature = searchParams.toString();

  const [listBusy, setListBusy] = useState(false);
  useEffect(() => {
    setListBusy(true);
    const t = window.setTimeout(() => setListBusy(false), 220);
    return () => clearTimeout(t);
  }, [urlSignature]);

  const onCompare = useCallback(
    (id: string, title: string) => {
      if (isComparing(id)) removeFromComparison(id);
      else addToComparison(id, title);
    },
    [addToComparison, isComparing, removeFromComparison],
  );

  return (
    <div className="discovery">
      <header className="discovery__header">
        <div className="brand">
          <span className="brand__mark" aria-hidden>
            K
          </span>
          <div>
            <p className="brand__name">Kupci</p>
            <p className="brand__tag">Marketplace discovery</p>
          </div>
        </div>
        <div className="discovery__search">
          <label className="sr-only" htmlFor="global-search">
            Search products
          </label>
          <input
            id="global-search"
            className="input"
            placeholder="Search title, brand, tags…"
            value={qInput}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="discovery__actions">
          <button
            type="button"
            className="btn"
            onClick={() => setSidebarOpen(true)}
          >
            Filters
          </button>
        </div>
      </header>

      <div className="discovery__toolbar">
        <p className="muted">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
          {filters.categories.length > 0 && (
            <span className="toolbar-pill">
              {" "}
              · {filters.categories.join(", ")}
            </span>
          )}
        </p>
        <button
          type="button"
          className="linkish"
          onClick={() =>
            patchFilters({
              q: "",
              categories: [],
              minPrice: null,
              maxPrice: null,
              minRating: null,
              sort: "newest",
            })
          }
        >
          Clear all
        </button>
      </div>

      <main className="discovery__main">
        {listBusy ? (
          <DiscoverySkeletonGrid count={12} />
        ) : (
          <VirtualProductGrid
            items={slice}
            searchQuery={filters.q}
            onCompare={onCompare}
            isComparing={isComparing}
            sentinelRef={sentinelRef}
          />
        )}
      </main>

      <FilterSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        filters={filters}
        patchFilters={(p) => {
          patchFilters(p);
        }}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
});
