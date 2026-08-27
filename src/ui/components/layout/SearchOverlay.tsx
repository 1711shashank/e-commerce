"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { mergeCatalog } from "@/lib/catalog";
import { listPublicDbProducts } from "@/lib/catalog-api";
import { searchProducts, formatPrice, getProducts } from "@/lib/services";
import { useStore } from "@/lib/store";
import { useDebounce } from "@/lib/hooks";
import type { Product } from "@/lib/types";

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useStore();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const catalog = useMemo(
    () => mergeCatalog(getProducts(), dbProducts),
    [dbProducts],
  );
  const results = searchProducts(debounced, 8, catalog);

  useEffect(() => {
    listPublicDbProducts().then(setDbProducts);
  }, []);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery("");
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen, closeSearch]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 animate-fade-in">
      <div className="border-b border-border bg-surface px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Search className="h-5 w-5 shrink-0 text-muted" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for dresses, kurtas, lawn…"
            className="min-h-12 w-full bg-transparent text-base outline-none placeholder:text-muted"
            aria-label="Search"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="min-h-11 px-3 text-sm text-muted hover:text-foreground"
          >
            Esc
          </button>
        </div>
      </div>
      <div className="mx-auto max-h-[70vh] max-w-3xl overflow-y-auto bg-surface px-5 py-4 sm:px-8">
        {debounced && results.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">
            No matches for “{debounced}”
          </p>
        )}
        <ul className="divide-y divide-border">
          {results.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.slug}`}
                onClick={closeSearch}
                className="flex items-center gap-4 py-3 hover:bg-background"
              >
                <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-border/40">
                  <Image
                    src={product.images[0]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{product.name}</p>
                  <p className="text-xs text-muted">
                    {formatPrice(product.discountPrice ?? product.price)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className="absolute inset-0 -z-10"
        aria-label="Close search"
        onClick={closeSearch}
      />
    </div>
  );
}
