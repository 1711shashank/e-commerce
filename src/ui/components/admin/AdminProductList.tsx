"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { formatPrice } from "@/lib/services";
import { deleteProduct, listPortalProducts } from "@/lib/catalog-api";
import { useAuthStore } from "@/lib/auth-store";
import { storeProductUrl } from "@/lib/urls";
import type { Product } from "@/lib/types";
import { getDefaultProductImage } from "@/lib/variants";

function PortalContent() {
  const access = useAuthStore((s) => s.access);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!access) return;
    setLoading(true);
    setError(null);
    try {
      const list = await listPortalProducts(access);
      setProducts(list);
    } catch {
      setError("Could not load products from the catalog database.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [access]);

  useEffect(() => {
    void load();
  }, [load]);

  const onRemove = async (id: string) => {
    if (!access) return;
    if (!window.confirm("Remove this product from the catalog?")) return;
    try {
      await deleteProduct(id, access);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Could not delete product.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <h1 className="font-display text-4xl sm:text-5xl">Products</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
        Add and manage catalog items. Changes save to the database and appear on
        the public store.
      </p>

      {error && (
        <p className="mt-6 border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Loading products…</p>
      ) : !products.length ? (
        <div className="mt-12 border border-dashed border-border bg-surface px-6 py-14 text-center">
          <p className="font-display text-2xl">No products yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Add a product on a page that looks like the store detail screen —
            images, sizes, colors, and price in place.
          </p>
          <Link
            href="/admin/products/new"
            className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-5 text-sm font-medium tracking-wide text-white hover:bg-accent-hover"
          >
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {products.length} product{products.length === 1 ? "" : "s"} in
              database
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-5 text-sm font-medium tracking-wide text-white hover:bg-accent-hover"
            >
              <Plus className="h-4 w-4" />
              Add product
            </Link>
          </div>
          <ul className="divide-y divide-border border border-border bg-surface">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-border/40 sm:h-28 sm:w-24">
                  {getDefaultProductImage(product) ? (
                    <Image
                      src={getDefaultProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl">{product.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatPrice(product.discountPrice ?? product.price)}
                    {product.discountPrice != null && (
                      <span className="ml-2 line-through opacity-60">
                        {formatPrice(product.price)}
                      </span>
                    )}
                    <span className="mx-2 text-border">·</span>
                    {product.sizes.join(", ")}
                    <span className="mx-2 text-border">·</span>
                    {product.inStock ? "In stock" : "Out of stock"}
                  </p>
                  <Link
                    href={storeProductUrl(product.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-accent hover:underline"
                  >
                    View on store ↗
                  </Link>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="inline-flex min-h-11 items-center gap-2 border border-border px-4 text-sm hover:border-foreground/40"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => void onRemove(product.id)}
                    className="inline-flex min-h-11 items-center gap-2 border border-border px-4 text-sm text-sale hover:border-sale"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function AdminProductList() {
  return (
    <RequireAuth>
      <PortalContent />
    </RequireAuth>
  );
}
