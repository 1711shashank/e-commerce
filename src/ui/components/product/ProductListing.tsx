"use client";

import { useMemo, useState, useEffect } from "react";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { ActiveFilters } from "@/components/filters/ActiveFilters";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { SearchBar } from "@/components/filters/SearchBar";
import { SortDropdown } from "@/components/filters/SortDropdown";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { mergeCatalog } from "@/lib/catalog";
import { listPublicDbProducts } from "@/lib/catalog-api";
import { useDebounce } from "@/lib/hooks";
import {
  filterProducts,
  getPriceRange,
  sortProducts,
} from "@/lib/services";
import type {
  Category,
  Product,
  ProductFilters,
  SortOption,
  ViewMode,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

interface ProductListingProps {
  products: Product[];
  categories: Category[];
  initialFilters?: ProductFilters;
  title?: string;
}

export function ProductListing({
  products,
  categories,
  initialFilters = {},
  title,
}: ProductListingProps) {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const catalog = useMemo(
    () => mergeCatalog(products, dbProducts),
    [products, dbProducts],
  );

  useEffect(() => {
    let cancelled = false;
    listPublicDbProducts().then((list) => {
      if (!cancelled) setDbProducts(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const priceRange = useMemo(() => getPriceRange(catalog), [catalog]);
  const [filters, setFilters] = useState<ProductFilters>({
    inStock: null,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    ...initialFilters,
  });
  const [searchInput, setSearchInput] = useState(initialFilters.search ?? "");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFilters((f) => ({ ...f, search: debouncedSearch }));
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      minPrice:
        f.minPrice == null || f.minPrice < priceRange.min
          ? priceRange.min
          : f.minPrice,
      maxPrice:
        f.maxPrice == null || f.maxPrice > priceRange.max
          ? priceRange.max
          : f.maxPrice,
    }));
  }, [priceRange.min, priceRange.max]);

  const filtered = useMemo(
    () => sortProducts(filterProducts(filters, catalog), sort),
    [filters, catalog, sort],
  );

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, [filters, sort, catalog]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const clearAll = () => {
    setSearchInput("");
    setFilters({
      category: initialFilters.category,
      inStock: null,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      {title && (
        <h1 className="mb-6 font-display text-3xl sm:text-4xl lg:text-5xl">
          {title}
        </h1>
      )}

      <div className="sticky top-16 z-30 -mx-5 mb-6 border-y border-border bg-background/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:top-[4.5rem] lg:static lg:mx-0 lg:mb-8 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <div className="min-w-[180px] flex-1 sm:min-w-[240px]">
            <SearchBar value={searchInput} onChange={setSearchInput} />
          </div>
          <SortDropdown value={sort} onChange={setSort} />
          <div className="hidden items-center border border-border sm:flex">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn(
                "flex h-11 w-11 items-center justify-center",
                view === "grid" && "bg-foreground text-background",
              )}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "flex h-11 w-11 items-center justify-center",
                view === "list" && "bg-foreground text-background",
              )}
              aria-label="List view"
              aria-pressed={view === "list"}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-3">
          <ActiveFilters
            filters={filters}
            sort={sort}
            priceRange={priceRange}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
            onClearAll={clearAll}
          />
        </div>
        <p className="mt-3 text-xs text-muted">
          Showing {visible.length} of {filtered.length} products
        </p>
      </div>

      <div className="flex gap-10">
        <div className="hidden w-56 shrink-0 lg:block xl:w-64">
          <FilterSidebar
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
            categories={categories}
            priceRange={priceRange}
          />
        </div>

        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductGrid products={visible} view={view} />
          )}

          {hasMore && !loading && (
            <div className="mt-10 flex justify-center">
              <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                Load more
              </Button>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        side="bottom"
        className="lg:hidden"
      >
        <div className="px-5 py-6">
          <FilterSidebar
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
            categories={categories}
            priceRange={priceRange}
          />
          <Button className="mt-8 w-full" onClick={() => setFiltersOpen(false)}>
            Show {filtered.length} results
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
