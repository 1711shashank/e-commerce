"use client";

import { X } from "lucide-react";
import type { ProductFilters, SortOption } from "@/lib/types";

interface ActiveFiltersProps {
  filters: ProductFilters;
  sort: SortOption;
  onChange: (filters: ProductFilters) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  filters,
  onChange,
  onClearAll,
}: ActiveFiltersProps) {
  const chips: { key: string; label: string; clear: () => void }[] = [];

  if (filters.search) {
    chips.push({
      key: "search",
      label: `“${filters.search}”`,
      clear: () => onChange({ ...filters, search: "" }),
    });
  }
  if (filters.subCategory) {
    chips.push({
      key: "sub",
      label: filters.subCategory,
      clear: () => onChange({ ...filters, subCategory: undefined }),
    });
  }
  filters.sizes?.forEach((size) => {
    chips.push({
      key: `size-${size}`,
      label: `Size ${size}`,
      clear: () =>
        onChange({
          ...filters,
          sizes: filters.sizes?.filter((s) => s !== size),
        }),
    });
  });
  filters.colors?.forEach((color) => {
    chips.push({
      key: `color-${color}`,
      label: color,
      clear: () =>
        onChange({
          ...filters,
          colors: filters.colors?.filter((c) => c !== color),
        }),
    });
  });
  filters.fabrics?.forEach((fabric) => {
    chips.push({
      key: `fabric-${fabric}`,
      label: fabric,
      clear: () =>
        onChange({
          ...filters,
          fabrics: filters.fabrics?.filter((f) => f !== fabric),
        }),
    });
  });
  if (filters.inStock === true) {
    chips.push({
      key: "stock",
      label: "In stock",
      clear: () => onChange({ ...filters, inStock: null }),
    });
  }
  if (filters.minPrice != null || filters.maxPrice != null) {
    chips.push({
      key: "price",
      label: `$${filters.minPrice ?? 0} – $${filters.maxPrice ?? "∞"}`,
      clear: () =>
        onChange({ ...filters, minPrice: undefined, maxPrice: undefined }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.clear}
          className="inline-flex min-h-9 items-center gap-1.5 border border-border bg-surface px-3 text-xs uppercase tracking-wide hover:border-foreground"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="min-h-9 px-2 text-xs uppercase tracking-wide text-muted underline-offset-2 hover:text-foreground hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
