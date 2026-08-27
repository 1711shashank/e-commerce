"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductInventoryFields } from "@/components/admin/ProductInventoryFields";
import type { ProductFormValues } from "@/lib/catalog";

interface ProductInventoryModalProps {
  open: boolean;
  onClose: () => void;
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

export function ProductInventoryModal({
  open,
  onClose,
  ...fieldsProps
}: ProductInventoryModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 sm:items-center sm:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-modal-title"
      onClick={onClose}
    >
      <div
        className="flex h-[min(92vh,900px)] w-full max-w-3xl flex-col border border-border bg-background shadow-lg sm:h-auto sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              Product inventory
            </p>
            <h2
              id="inventory-modal-title"
              className="font-display text-2xl sm:text-3xl"
            >
              Inventory & quantities
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center border border-border hover:border-foreground"
            aria-label="Close inventory"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          <ProductInventoryFields {...fieldsProps} />
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-border px-5 py-4 sm:px-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}
