import { ProductCard } from "@/components/product/ProductCard";
import type { Product, ViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  view?: ViewMode;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  view = "grid",
  emptyMessage = "No products found. Try adjusting your filters.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center border border-dashed border-border px-6 py-16 text-center">
        <p className="font-display text-2xl">No results found</p>
        <p className="mt-2 max-w-md text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="divide-y divide-border">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} view="list" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10",
        "md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
