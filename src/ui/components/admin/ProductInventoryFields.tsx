"use client";

import { useMemo } from "react";
import { ProductVariantStockGrid } from "@/components/admin/ProductVariantStockGrid";
import { SIZE_OPTIONS, sortSizes, type ProductFormValues } from "@/lib/catalog";
import { cn } from "@/lib/utils";

interface ProductColorFieldsProps {
  values: ProductFormValues;
  selectedColor: string;
  fieldErrors: Record<string, string>;
  fieldHint: string;
  onSelectColor: (color: string) => void;
}

export function ProductColorFields({
  values,
  selectedColor,
  fieldErrors,
  fieldHint,
  onSelectColor,
}: ProductColorFieldsProps) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
        Colors
        {selectedColor ? ` — ${selectedColor}` : ""}
      </p>
      {values.colors.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onSelectColor(color)}
              className={cn(
                "min-h-11 border px-4 text-sm transition-colors",
                selectedColor === color
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground/50",
              )}
            >
              {color}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          Add colors in the images modal, then set stock quantities here.
        </p>
      )}
      {fieldErrors.colors && <p className={fieldHint}>{fieldErrors.colors}</p>}
    </div>
  );
}

interface ProductSizeFieldsProps {
  values: ProductFormValues;
  selectedSize: string;
  fieldErrors: Record<string, string>;
  fieldHint: string;
  onToggleSize: (size: string) => void;
}

export function ProductSizeFields({
  values,
  selectedSize,
  fieldErrors,
  fieldHint,
  onToggleSize,
}: ProductSizeFieldsProps) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
        Sizes
        {selectedSize ? ` — ${selectedSize}` : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {SIZE_OPTIONS.map((size) => {
          const active = values.sizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => onToggleSize(size)}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center border px-3 text-sm transition-colors",
                active
                  ? selectedSize === size
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/60 bg-foreground/10"
                  : "border-border text-muted hover:border-foreground/40",
              )}
              aria-pressed={active}
            >
              {size}
            </button>
          );
        })}
      </div>
      {fieldErrors.sizes && <p className={fieldHint}>{fieldErrors.sizes}</p>}
    </div>
  );
}

interface ProductInventoryFieldsProps {
  values: ProductFormValues;
  selectedColor: string;
  selectedSize: string;
  fieldErrors: Record<string, string>;
  fieldHint: string;
  onSelectColor: (color: string) => void;
  onSelectSize: (size: string) => void;
  onToggleSize: (size: string) => void;
  onVariantsChange: (variants: ProductFormValues["variants"]) => void;
}

export function ProductInventoryFields({
  values,
  selectedColor,
  selectedSize,
  fieldErrors,
  fieldHint,
  onSelectColor,
  onSelectSize,
  onToggleSize,
  onVariantsChange,
}: ProductInventoryFieldsProps) {
  const sortedSizes = useMemo(
    () => sortSizes(values.sizes),
    [values.sizes],
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        Set how many units are in stock for each color and size combination.
      </p>

      <ProductColorFields
        values={values}
        selectedColor={selectedColor}
        fieldErrors={fieldErrors}
        fieldHint={fieldHint}
        onSelectColor={onSelectColor}
      />

      <ProductSizeFields
        values={values}
        selectedSize={selectedSize}
        fieldErrors={fieldErrors}
        fieldHint={fieldHint}
        onToggleSize={onToggleSize}
      />

      {values.colors.length > 0 && sortedSizes.length > 0 ? (
        <ProductVariantStockGrid
          colors={values.colors}
          sizes={sortedSizes}
          variants={values.variants}
          onChange={onVariantsChange}
          error={fieldErrors.variants}
        />
      ) : (
        <p className="text-sm text-muted">
          Add at least one color and one size to enter quantities.
        </p>
      )}
    </div>
  );
}
