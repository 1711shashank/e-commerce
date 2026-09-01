"use client";

import { Plus, X } from "lucide-react";
import { ProductImageField } from "@/components/admin/ProductImageField";
import { Button } from "@/components/ui/Button";
import type { ProductFormValues } from "@/lib/catalog";
import { cn } from "@/lib/utils";

interface ProductImagesFieldsProps {
  values: ProductFormValues;
  selectedColor: string;
  activeIndex: number;
  name: string;
  newImageUrl: string;
  newColor: string;
  uploading: boolean;
  error?: string;
  colorError?: string;
  fieldHint: string;
  onSelectColor: (color: string) => void;
  onActiveChange: (index: number) => void;
  onNewUrlChange: (value: string) => void;
  onNewColorChange: (value: string) => void;
  onAddColor: () => void;
  onRemoveColor: (color: string) => void;
  onAddUrl: () => void;
  onRemove: (index: number) => void;
  onMove: (index: number, dir: -1 | 1) => void;
  onUploadFiles: (files: File[]) => void;
}

export function ProductImagesFields({
  values,
  selectedColor,
  activeIndex,
  name,
  newImageUrl,
  newColor,
  uploading,
  error,
  colorError,
  fieldHint,
  onSelectColor,
  onActiveChange,
  onNewUrlChange,
  onNewColorChange,
  onAddColor,
  onRemoveColor,
  onAddUrl,
  onRemove,
  onMove,
  onUploadFiles,
}: ProductImagesFieldsProps) {
  const imagesForSelectedColor = selectedColor
    ? (values.imagesByColor[selectedColor] ?? []).filter(Boolean)
    : [];
  const safeActive = imagesForSelectedColor.length
    ? Math.min(activeIndex, imagesForSelectedColor.length - 1)
    : 0;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        Add colors, then upload or paste image URLs for each. Shoppers see these
        photos when they choose that color on the product page.
      </p>

      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">
          Color
          {selectedColor ? ` — ${selectedColor}` : ""}
        </p>
        {values.colors.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {values.colors.map((color) => {
              const count = (values.imagesByColor[color] ?? []).filter(Boolean)
                .length;
              return (
                <div key={color} className="relative">
                  <button
                    type="button"
                    onClick={() => onSelectColor(color)}
                    className={cn(
                      "min-h-11 border px-4 pr-9 text-sm transition-colors",
                      selectedColor === color
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/50",
                    )}
                    aria-pressed={selectedColor === color}
                  >
                    {color}
                    <span className="ml-2 text-xs opacity-70">
                      ({count} image{count === 1 ? "" : "s"})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveColor(color)}
                    className={cn(
                      "absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center",
                      selectedColor === color
                        ? "text-background/80 hover:text-background"
                        : "text-muted hover:text-foreground",
                    )}
                    aria-label={`Remove ${color}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <input
            value={newColor}
            onChange={(e) => onNewColorChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddColor();
              }
            }}
            className="min-h-11 flex-1 border border-border bg-background px-3 text-sm outline-none focus:border-accent"
            placeholder="Color name…"
          />
          <Button type="button" variant="outline" onClick={onAddColor}>
            <Plus className="h-4 w-4" />
            Add color
          </Button>
        </div>
        {colorError && <p className={cn(fieldHint, "mt-2")}>{colorError}</p>}
      </div>

      {selectedColor ? (
        <ProductImageField
          images={imagesForSelectedColor}
          activeIndex={safeActive}
          name={name}
          newImageUrl={newImageUrl}
          uploading={uploading}
          error={error}
          colorLabel={selectedColor}
          onActiveChange={onActiveChange}
          onNewUrlChange={onNewUrlChange}
          onAddUrl={onAddUrl}
          onRemove={onRemove}
          onMove={onMove}
          onUploadFiles={onUploadFiles}
        />
      ) : (
        <p className="rounded-none border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          Select a color to manage its images.
        </p>
      )}

      {error && !selectedColor && (
        <p className={fieldHint}>{error}</p>
      )}
    </div>
  );
}
