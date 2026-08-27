"use client";

import { X } from "lucide-react";
import { ProductDetail } from "@/components/product/ProductDetail";
import type { Product } from "@/lib/types";

export function ProductPreviewModal({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-fade-in">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/95 px-5 py-3 backdrop-blur sm:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            Preview
          </p>
          <p className="font-display text-xl">Product detail screen</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center border border-border hover:border-foreground"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-accent/20 bg-accent/5 px-5 py-3 text-center text-sm text-accent sm:px-8">
          This is how shoppers will see this product. Nothing has been saved yet.
        </div>
        <ProductDetail product={product} related={[]} />
      </div>
    </div>
  );
}
