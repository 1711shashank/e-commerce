"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  sizes: string[];
  colors: string[];
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onQuantityChange: (qty: number) => void;
  maxQuantity?: number;
  disabledColors?: string[];
  disabledSizes?: string[];
  sizeStock?: Record<string, number>;
  lowStockThreshold?: number;
}

function stockLabel(stock: number, threshold: number): string | null {
  if (stock <= 0) return "Out of stock";
  if (stock <= threshold) return `${stock} left`;
  return null;
}

export function VariantSelector({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  quantity,
  onSizeChange,
  onColorChange,
  onQuantityChange,
  maxQuantity = 0,
  disabledColors = [],
  disabledSizes = [],
  sizeStock = {},
  lowStockThreshold = 10,
}: VariantSelectorProps) {
  const canSelectQty = maxQuantity > 0;
  const effectiveMax = canSelectQty ? maxQuantity : 1;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
          Color — {selectedColor}
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const disabled = disabledColors.includes(color);
            return (
              <button
                key={color}
                type="button"
                disabled={disabled}
                onClick={() => onColorChange(color)}
                className={cn(
                  "min-h-11 border px-4 text-sm transition-colors",
                  disabled &&
                    "cursor-not-allowed border-border/60 text-muted opacity-50 line-through",
                  !disabled &&
                    selectedColor === color
                    ? "border-foreground bg-foreground text-background"
                    : !disabled && "border-border hover:border-foreground/50",
                )}
                aria-pressed={selectedColor === color}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
          Size — {selectedSize}
        </p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const disabled = disabledSizes.includes(size);
            const stock = sizeStock[size] ?? 0;
            const label = stockLabel(stock, lowStockThreshold);
            return (
              <button
                key={size}
                type="button"
                disabled={disabled}
                onClick={() => onSizeChange(size)}
                className={cn(
                  "flex min-h-11 min-w-11 flex-col items-center justify-center border px-3 text-sm transition-colors",
                  disabled &&
                    "cursor-not-allowed border-border/60 text-muted opacity-50",
                  !disabled &&
                    selectedSize === size
                    ? "border-foreground bg-foreground text-background"
                    : !disabled && "border-border hover:border-foreground/50",
                )}
                aria-pressed={selectedSize === size}
              >
                <span className={cn(disabled && "line-through")}>{size}</span>
                {label && (
                  <span
                    className={cn(
                      "text-[10px] leading-tight",
                      disabled ? "text-muted" : "opacity-80",
                    )}
                  >
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
          Quantity
        </p>
        <div className="inline-flex items-center border border-border">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center hover:bg-border/40 disabled:opacity-40"
            disabled={!canSelectQty || quantity <= 1}
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-10 text-center text-sm tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center hover:bg-border/40 disabled:opacity-40"
            disabled={!canSelectQty || quantity >= effectiveMax}
            onClick={() =>
              onQuantityChange(Math.min(effectiveMax, quantity + 1))
            }
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {canSelectQty ? (
          <p className="mt-2 text-xs text-muted">
            {maxQuantity <= lowStockThreshold
              ? `${maxQuantity} left in stock`
              : `${maxQuantity} available for this color and size`}
          </p>
        ) : (
          <p className="mt-2 text-xs text-sale">Out of stock for this variant</p>
        )}
      </div>
    </div>
  );
}
