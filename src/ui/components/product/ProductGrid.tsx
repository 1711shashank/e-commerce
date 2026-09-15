import { ProductCard } from "@/components/product/ProductCard";
import type { Product, ViewMode, CardLayoutStyle } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  view?: ViewMode;
  layoutStyle?: CardLayoutStyle;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  view = "grid",
  layoutStyle = "atelier",
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
          <ProductCard key={product.id} product={product} view="list" layoutStyle={layoutStyle} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 xl:gap-y-12",
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} layoutStyle={layoutStyle} />
      ))}
    </div>
  );
}
