"use client";

import { RequireAuth } from "@/components/admin/RequireAuth";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Category } from "@/lib/types";

export function NewProductClient({ categories }: { categories: Category[] }) {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <ProductForm categories={categories} />
      </div>
    </RequireAuth>
  );
}
