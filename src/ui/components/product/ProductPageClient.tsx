"use client";

import { use, useEffect, useMemo } from "react";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getRelatedProducts } from "@/lib/services";
import { useStore } from "@/lib/store";
import { useProductCatalog } from "@/lib/use-product-catalog";

export function ProductPageClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { catalog, loaded } = useProductCatalog();
  const reconcileCart = useStore((state) => state.reconcileCart);

  const product = useMemo(
    () => catalog.find((p) => p.slug === slug),
    [catalog, slug],
  );

  useEffect(() => {
    if (loaded) reconcileCart(catalog);
  }, [catalog, loaded, reconcileCart]);

  if (!product && !loaded) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-16 text-sm text-muted">
        Loading product…
      </div>
    );
  }

  if (!product) notFound();

  const related = getRelatedProducts(product, 8, catalog);
  return <ProductDetail product={product} related={related} />;
}
