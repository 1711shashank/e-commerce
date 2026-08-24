"use client";

import { useEffect, useState } from "react";
import { getAllColors, getAllFabrics, getAllSizes } from "@/lib/services";
import type { Category, ProductFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  categories: Category[];
  priceRange: { min: number; max: number };
  className?: string;
}

function toggleInArray(list: string[] | undefined, value: string) {
  const current = list ?? [];
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}

function parsePrice(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function FilterSidebar({
  filters,
  onChange,
  categories,
  priceRange,
  className,
}: FilterSidebarProps) {
  const sizes = getAllSizes();
  const colors = getAllColors();
  const fabrics = getAllFabrics();
  const subs = categories.filter((c) => c.parentId);

  const [minInput, setMinInput] = useState(
    String(filters.minPrice ?? priceRange.min),
  );
  const [maxInput, setMaxInput] = useState(
    String(filters.maxPrice ?? priceRange.max),
  );

  useEffect(() => {
    setMinInput(String(filters.minPrice ?? priceRange.min));
    setMaxInput(String(filters.maxPrice ?? priceRange.max));
  }, [filters.minPrice, filters.maxPrice, priceRange.min, priceRange.max]);

  const minEmpty = minInput.trim() === "";
  const maxEmpty = maxInput.trim() === "";

  const applyMin = (raw: string) => {
    setMinInput(raw);
    const n = parsePrice(raw);
    if (n == null) return;
    const maxBound = filters.maxPrice ?? priceRange.max;
    if (n >= priceRange.min && n <= maxBound) {
      onChange({ ...filters, minPrice: n });
    }
  };

  const applyMax = (raw: string) => {
    setMaxInput(raw);
    const n = parsePrice(raw);
    if (n == null) return;
    const minBound = filters.minPrice ?? priceRange.min;
    if (n >= minBound && n <= priceRange.max) {
      onChange({ ...filters, maxPrice: n });
    }
  };

  const commitMin = () => {
    if (minEmpty) return;
    const n = parsePrice(minInput);
    if (n == null) return;
    const maxBound = filters.maxPrice ?? priceRange.max;
    const next = Math.min(Math.max(Math.round(n), priceRange.min), maxBound);
    setMinInput(String(next));
    onChange({ ...filters, minPrice: next });
  };

  const commitMax = () => {
    if (maxEmpty) return;
    const n = parsePrice(maxInput);
    if (n == null) return;
    const minBound = filters.minPrice ?? priceRange.min;
    const next = Math.max(Math.min(Math.round(n), priceRange.max), minBound);
    setMaxInput(String(next));
    onChange({ ...filters, maxPrice: next });
  };

  return (
    <aside className={cn("space-y-8", className)}>
      {subs.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs uppercase tracking-[0.15em]">
            Sub-category
          </h3>
          <ul className="space-y-1">
            {subs.map((sub) => (
              <li key={sub.id}>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      subCategory:
                        filters.subCategory === sub.slug
                          ? undefined
                          : sub.slug,
                    })
                  }
                  className={cn(
                    "min-h-10 w-full px-1 text-left text-sm capitalize transition-colors",
                    filters.subCategory === sub.slug
                      ? "text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {sub.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="mb-3 text-xs uppercase tracking-[0.15em]">
          Price range
        </h3>
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <input
              type="number"
              min={priceRange.min}
              max={priceRange.max}
              value={minInput}
              onChange={(e) => applyMin(e.target.value)}
              onBlur={commitMin}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className={cn(
                "min-h-11 w-full border bg-surface px-3 text-sm",
                minEmpty ? "border-sale" : "border-border",
              )}
              aria-label="Minimum price"
              aria-invalid={minEmpty}
              aria-describedby={minEmpty ? "min-price-error" : undefined}
              required
            />
            {minEmpty && (
              <p id="min-price-error" className="mt-1.5 text-xs text-sale">
                Minimum price is required
              </p>
            )}
          </div>
          <span className="mt-3 text-muted">–</span>
          <div className="min-w-0 flex-1">
            <input
              type="number"
              min={priceRange.min}
              max={priceRange.max}
              value={maxInput}
              onChange={(e) => applyMax(e.target.value)}
              onBlur={commitMax}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className={cn(
                "min-h-11 w-full border bg-surface px-3 text-sm",
                maxEmpty ? "border-sale" : "border-border",
              )}
              aria-label="Maximum price"
              aria-invalid={maxEmpty}
              aria-describedby={maxEmpty ? "max-price-error" : undefined}
              required
            />
            {maxEmpty && (
              <p id="max-price-error" className="mt-1.5 text-xs text-sale">
                Maximum price is required
              </p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs uppercase tracking-[0.15em]">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const active = filters.sizes?.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    sizes: toggleInArray(filters.sizes, size),
                  })
                }
                className={cn(
                  "flex h-11 min-w-11 items-center justify-center border px-2 text-sm",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/50",
                )}
                aria-pressed={!!active}
              >
                {size}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs uppercase tracking-[0.15em]">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const active = filters.colors?.includes(color);
            return (
              <button
                key={color}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    colors: toggleInArray(filters.colors, color),
                  })
                }
                className={cn(
                  "min-h-11 border px-3 text-sm",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/50",
                )}
                aria-pressed={!!active}
              >
                {color}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs uppercase tracking-[0.15em]">Fabric</h3>
        <ul className="space-y-1">
          {fabrics.map((fabric) => {
            const active = filters.fabrics?.includes(fabric);
            return (
              <li key={fabric}>
                <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={!!active}
                    onChange={() =>
                      onChange({
                        ...filters,
                        fabrics: toggleInArray(filters.fabrics, fabric),
                      })
                    }
                    className="h-4 w-4 accent-accent"
                  />
                  {fabric}
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h3 className="mb-3 text-xs uppercase tracking-[0.15em]">
          Availability
        </h3>
        <div className="space-y-1">
          {[
            { label: "All", value: null },
            { label: "In stock", value: true },
            { label: "Sold out", value: false },
          ].map((opt) => (
            <label
              key={String(opt.value)}
              className="flex min-h-10 cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="radio"
                name="availability"
                checked={filters.inStock === opt.value}
                onChange={() =>
                  onChange({
                    ...filters,
                    inStock: opt.value as boolean | null,
                  })
                }
                className="accent-accent"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </section>
    </aside>
  );
}
