"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { searchProducts, formatPrice } from "@/lib/services";
import { useStore } from "@/lib/store";
import { useDebounce } from "@/lib/hooks";

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useStore();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);
  const results = searchProducts(debounced, 8);

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
                <div className="relative h-16 w-12 overflow-hidden bg-border/40">
                  <Image
                    src={product.images[0]}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-display text-lg">{product.name}</p>
                  <p className="text-sm text-muted">
                    {formatPrice(product.discountPrice ?? product.price)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {debounced && results.length > 0 && (
          <Link
            href={`/products?search=${encodeURIComponent(debounced)}`}
            onClick={closeSearch}
            className="mt-4 block py-3 text-center text-sm underline-offset-4 hover:underline"
          >
            View all results
          </Link>
        )}
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
