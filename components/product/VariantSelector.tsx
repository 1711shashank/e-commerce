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
  maxQuantity = 10,
}: VariantSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
          Color — {selectedColor}
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              className={cn(
                "min-h-11 border px-4 text-sm transition-colors",
                selectedColor === color
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground/50",
              )}
              aria-pressed={selectedColor === color}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
          Size — {selectedSize}
        </p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSizeChange(size)}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center border px-3 text-sm transition-colors",
                selectedSize === size
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground/50",
              )}
              aria-pressed={selectedSize === size}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
          Quantity
        </p>
        <div className="inline-flex items-center border border-border">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center hover:bg-border/40"
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
            className="flex h-11 w-11 items-center justify-center hover:bg-border/40"
            onClick={() =>
              onQuantityChange(Math.min(maxQuantity, quantity + 1))
            }
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
