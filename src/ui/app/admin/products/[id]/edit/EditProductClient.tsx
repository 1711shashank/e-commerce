"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { ProductForm } from "@/components/admin/ProductForm";
import { getPortalProduct } from "@/lib/catalog-api";
import { useAuthStore } from "@/lib/auth-store";
import type { Category, Product } from "@/lib/types";

function EditBody({
  id,
  categories,
}: {
  id: string;
  categories: Category[];
}) {
  const access = useAuthStore((s) => s.access);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!access) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getPortalProduct(id, access);
        if (!cancelled) setProduct(data);
      } catch {
        if (!cancelled) setMissing(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [access, id]);

  if (loading) {
    return <p className="text-sm text-muted">Loading product…</p>;
  }
  if (missing || !product) notFound();

  return <ProductForm categories={categories} product={product} />;
}

export default function EditProductClient({
  params,
  categories,
}: {
  params: Promise<{ id: string }>;
  categories: Category[];
}) {
  const { id } = use(params);

  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <EditBody id={id} categories={categories} />
      </div>
    </RequireAuth>
  );
}
