"use client";

import type { ProductVariant } from "@/lib/types";
import { sortSizes } from "@/lib/catalog";
import { variantKey } from "@/lib/variants";
import { cn } from "@/lib/utils";

interface ProductVariantStockGridProps {
  colors: string[];
  sizes: string[];
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  error?: string;
}

export function ProductVariantStockGrid({
  colors,
  sizes,
  variants,
  onChange,
  error,
}: ProductVariantStockGridProps) {
  const sortedSizes = sortSizes(sizes);

  if (!colors.length || !sortedSizes.length) {
    return (
      <p className="text-sm text-muted">
        Add at least one color and one size to enter quantity in stock.
      </p>
    );
  }

  const stockMap = new Map(
    variants.map((v) => [variantKey(v.color, v.size), v.stockQty]),
  );

  const setStock = (color: string, size: string, raw: string) => {
    const parsed = parseInt(raw, 10);
    const stockQty = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    const has = variants.some((v) => v.color === color && v.size === size);
    const next = has
      ? variants.map((v) =>
          v.color === color && v.size === size ? { ...v, stockQty } : v,
        )
      : [...variants, { color, size, stockQty }];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.15em] text-muted">
        Quantity in stock (all colors & sizes)
      </p>
      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[280px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/80">
              <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.12em] text-muted">
                Color
              </th>
              {sortedSizes.map((size) => (
                <th
                  key={size}
                  className="px-2 py-2 text-center text-xs uppercase tracking-[0.12em] text-muted"
                >
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <tr key={color} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium">{color}</td>
                {sortedSizes.map((size) => (
                  <td key={size} className="px-2 py-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={stockMap.get(variantKey(color, size)) ?? 0}
                      onChange={(e) => setStock(color, size, e.target.value)}
                      className={cn(
                        "min-h-10 w-full min-w-[4rem] border border-border bg-background px-2 text-center tabular-nums outline-none focus:border-accent",
                      )}
                      aria-label={`${color} ${size} stock`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="text-xs text-sale">{error}</p>}
    </div>
  );
}
