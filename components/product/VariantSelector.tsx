"use client";

import Link from "next/link";
import { Minus, Plus, Ruler } from "lucide-react";
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
  stitchingOptions?: Array<"unstitched" | "stitched">;
  selectedStitching?: "unstitched" | "stitched";
  onStitchingChange?: (type: "unstitched" | "stitched") => void;
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
  stitchingOptions = ["stitched"],
  selectedStitching = "stitched",
  onStitchingChange,
  maxQuantity = 10,
}: VariantSelectorProps) {
  const hasMultipleStitching = stitchingOptions.length > 1;
  const isUnstitched = selectedStitching === "unstitched";

  return (
    <div className="space-y-6">
      {/* Stitching Option Selector matching Maria.B. */}
      {hasMultipleStitching && onStitchingChange && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.16em] font-medium text-foreground">
              Select Stitching
            </span>
            <span className="text-xs text-muted">
              {isUnstitched ? "Fabric Only" : "Expertly Tailored Ready to Wear"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onStitchingChange("unstitched")}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center border px-3 py-2 text-center transition-all",
                isUnstitched
                  ? "border-foreground bg-foreground text-background font-medium"
                  : "border-border bg-surface text-muted hover:border-foreground/40",
              )}
            >
              <span className="text-xs uppercase tracking-wider font-semibold">
                Unstitched
              </span>
              <span className="text-[10px] opacity-80 mt-0.5">
                3-Piece Raw Fabric Pack
              </span>
            </button>
            <button
              type="button"
              onClick={() => onStitchingChange("stitched")}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center border px-3 py-2 text-center transition-all",
                !isUnstitched
                  ? "border-foreground bg-foreground text-background font-medium"
                  : "border-border bg-surface text-muted hover:border-foreground/40",
              )}
            >
              <span className="text-xs uppercase tracking-wider font-semibold">
                Stitched
              </span>
              <span className="text-[10px] opacity-80 mt-0.5">
                Tailored with Premium Slip
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Colors */}
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
          Color — <span className="text-foreground font-medium">{selectedColor}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              className={cn(
                "min-h-11 border px-4 text-xs tracking-wide transition-colors",
                selectedColor === color
                  ? "border-foreground bg-foreground text-background font-medium"
                  : "border-border hover:border-foreground/50",
              )}
              aria-pressed={selectedColor === color}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes (Hidden or disabled if Unstitched is selected) */}
      {!isUnstitched ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              Size — <span className="text-foreground font-medium">{selectedSize}</span>
            </p>
            <Link
              href="/size-guide"
              className="inline-flex items-center gap-1 text-xs text-accent underline-offset-4 hover:underline"
            >
              <Ruler className="h-3.5 w-3.5" />
              Size Guide
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes
              .filter((s) => s !== "Unstitched")
              .map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(size)}
                  className={cn(
                    "flex h-11 min-w-11 items-center justify-center border px-3 text-xs tracking-wider transition-colors",
                    selectedSize === size
                      ? "border-foreground bg-foreground text-background font-medium"
                      : "border-border hover:border-foreground/50",
                  )}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              ))}
          </div>
        </div>
      ) : (
        <div className="border border-border/70 bg-surface/60 p-3.5 text-xs text-muted">
          <p className="font-medium text-foreground">Unstitched Fabric Pack Selected</p>
          <p className="mt-1 leading-relaxed">
            Includes full unstitched shirt, dupatta, trouser fabrics, embroidered necklines, and hem patches ready for custom tailoring.
          </p>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
          Quantity
        </p>
        <div className="inline-flex items-center border border-border">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center hover:bg-border/40 transition-colors"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-10 text-center text-sm tabular-nums font-medium">
            {quantity}
          </span>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center hover:bg-border/40 transition-colors"
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

