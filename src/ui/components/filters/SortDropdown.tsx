"use client";

import type { SortOption } from "@/lib/types";

const options: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
  { value: "a-z", label: "A–Z" },
];

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <label className="flex min-h-11 items-center gap-2 text-sm">
      <span className="sr-only">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="min-h-11 border border-border bg-surface px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        aria-label="Sort products"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
