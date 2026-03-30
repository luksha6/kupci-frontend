import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { FacetFilters } from "../utils/urlParams";
import {
  filtersFromSearchParams,
  searchParamsFromFilters,
} from "../utils/urlParams";

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => filtersFromSearchParams(searchParams),
    [searchParams],
  );

  const setFilters = useCallback(
    (next: FacetFilters) => {
      setSearchParams(searchParamsFromFilters(next), { replace: false });
    },
    [setSearchParams],
  );

  const patchFilters = useCallback(
    (patch: Partial<FacetFilters>) => {
      setSearchParams(
        (prev) => {
          const current = filtersFromSearchParams(prev);
          return searchParamsFromFilters({ ...current, ...patch }, prev);
        },
        { replace: false },
      );
    },
    [setSearchParams],
  );

  return { filters, setFilters, patchFilters, searchParams };
}
