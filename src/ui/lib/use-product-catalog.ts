"use client";

import { useEffect, useMemo, useState } from "react";
import { mergeCatalog } from "@/lib/catalog";
import { listPublicDbProducts } from "@/lib/catalog-api";
import { getProducts } from "@/lib/services";
import type { Product } from "@/lib/types";

export function useProductCatalog() {
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

  return { catalog, loaded };
}
