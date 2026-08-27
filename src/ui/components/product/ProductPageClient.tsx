"use client";

import { use, useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { mergeCatalog } from "@/lib/catalog";
import { listPublicDbProducts } from "@/lib/catalog-api";
import {
  getProductBySlug,
  getRelatedProducts,
  getProducts,
} from "@/lib/services";
import type { Product } from "@/lib/types";

export function ProductPageClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const seed = getProductBySlug(slug);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listPublicDbProducts().then((list) => {
      if (!cancelled) {
        setDbProducts(list);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const catalog = useMemo(
    () => mergeCatalog(getProducts(), dbProducts),
    [dbProducts],
  );

  const product = seed ?? catalog.find((p) => p.slug === slug);

  if (seed) {
    const related = getRelatedProducts(seed, 8, catalog);
    return <ProductDetail product={seed} related={related} />;
  }

  if (!loaded) {
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
