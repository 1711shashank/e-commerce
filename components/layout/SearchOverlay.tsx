"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Search, X, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { searchProducts, formatPrice, getDiscountPercent } from "@/lib/services";
import { useStore } from "@/lib/store";
import { useDebounce } from "@/lib/hooks";

const POPULAR_SEARCHES = [
  "3-Piece Lawn",
  "Chiffon Formals",
  "Modest Abayas",
  "Bridal Lehengas",
  "Shehnai Formals",
  "Velvet Shawls",
  "Casual Pret",
  "Sale",
];

function SearchOverlayModal() {
  const { closeSearch } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounced = useDebounce(query, 200);
  const results = searchProducts(debounced, 8);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSearch]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.trim();
    if (clean) {
      closeSearch();
      router.push(`/products?search=${encodeURIComponent(clean)}`);
    }
  };

  const handleSelectTrending = (term: string) => {
    setQuery(term);
    closeSearch();
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-foreground/50 backdrop-blur-xs animate-fade-in">
      {/* Search Header Container */}
      <div className="w-full border-b border-border bg-surface shadow-md">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6 sm:py-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 sm:gap-3"
          >
            {/* Search Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#e00075]">
              <Search className="h-5 w-5" />
            </div>

            {/* Input Box */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search luxury lawn, abayas, bridal, formals…"
                className="h-11 w-full rounded-full border border-border bg-[#faf8f5] pl-4 pr-10 text-sm text-foreground placeholder:text-muted focus:border-[#e00075] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e00075]/20"
                aria-label="Search Kusum collection"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-black/5 hover:text-foreground"
                  aria-label="Clear search query"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Search CTA Button */}
            <button
              type="submit"
              className="hidden sm:inline-flex h-10 px-5 items-center justify-center rounded-full bg-[#e00075] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#c20065] transition-colors shrink-0 shadow-xs"
            >
              Search
            </button>

            {/* Close / Dismiss Button */}
            <button
              type="button"
              onClick={closeSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 text-muted hover:text-foreground transition-colors shrink-0"
              aria-label="Close search overlay"
            >
              <X className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Results & Recommendations Sheet */}
      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto bg-surface px-4 py-4 sm:px-6 sm:py-6 shadow-xl sm:my-auto sm:max-h-[75vh] sm:rounded-b-2xl sm:flex-initial">
        {/* Empty State: Trending Suggestions */}
        {!debounced.trim() && (
          <div className="py-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-bold text-[#e00075] mb-3">
              <TrendingUp className="h-4 w-4" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSelectTrending(term)}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-[#faf8f5] px-3.5 py-2 text-xs font-medium text-foreground hover:border-[#e00075] hover:bg-white hover:text-[#e00075] transition-colors shadow-2xs"
                >
                  <Sparkles className="h-3 w-3 text-[#e00075]" />
                  <span>{term}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted font-semibold mb-2">
                Need Bespoke Assistance?
              </p>
              <Link
                href="/bridal"
                onClick={closeSearch}
                className="flex items-center justify-between rounded-xl border border-border/80 bg-[#fdf0f6] p-3.5 text-xs text-[#e00075] hover:border-[#e00075] transition-colors"
              >
                <div>
                  <span className="font-bold block">Bridal & Couture Consultation</span>
                  <span className="text-[11px] text-[#555] font-normal">
                    Book a private bespoke session with our bridal stylist
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </div>
        )}

        {/* Live Search Matching State */}
        {debounced.trim() && results.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-base font-medium text-foreground">
              No matches found for “{debounced}”
            </p>
            <p className="mt-1 text-xs text-muted">
              Try checking for spelling errors or searching for broader terms like “lawn”, “abaya”, or “embroidered”.
            </p>
            <button
              type="button"
              onClick={() => handleSearchSubmit()}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[#141414] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition-colors shadow-xs"
            >
              Browse All Catalog
            </button>
          </div>
        )}

        {debounced.trim() && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between border-b border-border pb-2.5 mb-2">
              <span className="text-[11px] uppercase tracking-[0.14em] font-bold text-muted">
                Matching Products ({results.length})
              </span>
              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="text-xs font-bold text-[#e00075] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <ul className="divide-y divide-border/60">
              {results.map((product) => {
                const discount = getDiscountPercent(product);
                return (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={closeSearch}
                      className="group flex items-center gap-3.5 py-3 hover:bg-[#faf8f5] px-2 rounded-xl transition-colors"
                    >
                      <div className="relative h-16 w-13 shrink-0 overflow-hidden rounded-lg bg-border/30 border border-border/40">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="52px"
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-[#e00075] bg-[#fdf0f6] px-1.5 py-0.5 rounded">
                            {product.category.replace("-", " ")}
                          </span>
                          {product.fabric && (
                            <span className="text-[10px] text-muted truncate">
                              · {product.fabric}
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-[#e00075] transition-colors">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <span className="font-bold text-foreground">
                            {formatPrice(product.discountPrice ?? product.price)}
                          </span>
                          {product.discountPrice && (
                            <>
                              <span className="text-muted line-through text-[11px]">
                                {formatPrice(product.price)}
                              </span>
                              {discount && (
                                <span className="text-[10px] font-bold text-[#e00075]">
                                  ({discount}% OFF)
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted/50 group-hover:text-[#e00075] group-hover:translate-x-1 transition-all shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Bottom Full Search Link */}
            <button
              type="button"
              onClick={() => handleSearchSubmit()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e00075] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#c20065] transition-colors"
            >
              <span>Explore All Results for “{debounced}”</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Backdrop tap to dismiss */}
      <button
        type="button"
        className="hidden sm:block flex-1 w-full -z-10"
        aria-label="Close search"
        onClick={closeSearch}
      />
    </div>
  );
}

export function SearchOverlay() {
  const { isSearchOpen } = useStore();
  if (!isSearchOpen) return null;
  return <SearchOverlayModal />;
}
