"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { useSyncExternalStore, useState } from "react";
import { useStore } from "@/lib/store";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

const emptySubscribe = () => () => {};

const navItems = [
  { label: "Unstitched", href: "/collections/unstitched", slug: "unstitched" },
  {
    label: "Ready to Wear",
    href: "/collections/ready-to-wear",
    slug: "ready-to-wear",
  },
  {
    label: "Luxury Formals",
    href: "/collections/luxury-formals",
    slug: "luxury-formals",
  },
  {
    label: "Abayas & Kaftans",
    href: "/collections/abayas-kaftans",
    slug: "abayas-kaftans",
  },
  { label: "Bridal", href: "/bridal", slug: "bridal" },
  {
    label: "Mommy & Me",
    href: "/collections/mommy-and-me",
    slug: "mommy-and-me",
  },
  { label: "Sale", href: "/collections/sale", slug: "sale" },
];

export function Header({ categories }: { categories: Category[] }) {
  const {
    openCart,
    openMobileNav,
    openSearch,
    cartCount,
    wishlistCount,
  } = useStore();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [isInlineSearchOpen, setIsInlineSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Safe client-only mounting using useSyncExternalStore (prevents cascading render lint error)
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const bags = mounted ? cartCount() : 0;
  const wishes = mounted ? wishlistCount() : 0;

  return (
    <header className="sticky top-0 z-40 bg-surface shadow-xs">
      {/* Tier 1: Top Utility & Announcement Bar */}
      <div className="border-b border-white/10 bg-[#141414] text-white">
        <div className="mx-auto flex min-h-10 max-w-[1536px] items-center justify-between gap-4 px-4 sm:px-8 xl:px-12 py-2 sm:py-0">
          {/* Social Icons & Names */}
          <div className="flex items-center gap-3 sm:gap-4.5 font-[family-name:var(--font-brand)] text-xs font-bold uppercase tracking-[0.14em] shrink-0">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-white/85 transition-colors hover:text-[#e00075]"
              aria-label="Follow Kusum on Instagram"
            >
              <InstagramIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
              <span>Instagram</span>
            </a>
            <span className="text-white/25 hidden sm:inline">·</span>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-white/85 transition-colors hover:text-[#e00075]"
              aria-label="Follow Kusum on Facebook"
            >
              <FacebookIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
              <span>Facebook</span>
            </a>
            <span className="text-white/25 hidden sm:inline">·</span>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-white/85 transition-colors hover:text-[#e00075]"
              aria-label="Subscribe to Kusum on YouTube"
            >
              <YoutubeIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
              <span>YouTube</span>
            </a>
          </div>

          {/* Central Promotion */}
          <p className="hidden text-xs tracking-[0.08em] text-white/95 lg:block font-medium">
            Complimentary UAE Delivery on orders over AED 350 · Worldwide Express Delivery
          </p>

          {/* Right Utilities (Track Order, Size Guide, Currency) */}
          <div className="flex items-center gap-3.5 sm:gap-4.5 font-[family-name:var(--font-brand)] text-xs font-bold uppercase tracking-[0.14em] text-white/85 shrink-0">
            <Link
              href="/track-order"
              className="transition-colors hover:text-[#e00075]"
            >
              Track Order
            </Link>
            <span className="text-white/25">·</span>
            <Link
              href="/size-guide"
              className="transition-colors hover:text-[#e00075]"
            >
              Size Guide
            </Link>
            <span className="hidden text-white/25 sm:inline">·</span>
            <span className="hidden font-black text-white sm:inline tracking-wider">
              🇦🇪 AED
            </span>
          </div>
        </div>
      </div>

      {/* Single Main Header Bar: Logo (Left) + Center Glass Nav / Sliding Search in SAME space + Actions (Right) */}
      <div className="border-b border-border/80 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 sm:h-24 max-w-[1536px] items-center justify-between gap-4 px-4 sm:px-8 xl:px-12">
          {/* LEFT: Mobile Menu Trigger + Brand Ring Logo + Hard Geometric Font */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={openMobileNav}
              className="flex h-11 w-11 items-center justify-center lg:hidden text-foreground hover:text-[#e00075] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Official Brand Identity (Left-aligned) */}
            <Link
              href="/"
              className="flex items-center gap-3.5 sm:gap-4 group py-1 shrink-0"
              aria-label="Kusum - The Premium Designer Wear"
            >
              {/* Circular Ring Logo Asset */}
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/LOGO WITH RING_page-0001.jpg"
                  alt="Kusum Ring Logo"
                  fill
                  priority
                  sizes="(max-width: 640px) 56px, 64px"
                  className="object-contain rounded-full shadow-xs"
                />
              </div>

              {/* Hard Geometric Brand Wordmark in Magenta Pink (Centered on top of Tagline, perfect alignment) */}
              <div className="flex flex-col items-center justify-center text-center select-none">
                <span className="font-[family-name:var(--font-brand)] font-black text-2xl sm:text-3xl lg:text-[32px] tracking-[0.16em] text-[#e00075] leading-none transition-transform duration-200">
                  KUSUM
                </span>
                <span className="font-[family-name:var(--font-heading)] text-[8px] sm:text-[9px] uppercase tracking-[0.24em] text-[#222222] font-semibold mt-1.5 whitespace-nowrap leading-none">
                  THE PREMIUM DESIGNER WEAR
                </span>
              </div>
            </Link>
          </div>

          {/* MIDDLE: Glass Capsule Navigation OR Sliding Search in the EXACT SAME PLACE with safe margins */}
          <div className="hidden lg:flex flex-1 items-center justify-center mx-4 xl:mx-8 px-2 min-w-0">
            {isInlineSearchOpen ? (
              /* Sliding Search Input in the SAME middle space */
              <div className="flex w-full max-w-2xl items-center gap-3 px-3 py-1 animate-fade-in">
                <Search className="h-4 w-4 text-[#e00075] shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsInlineSearchOpen(false);
                    }
                    if (e.key === "Enter" && searchQuery.trim()) {
                      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                  placeholder="Search luxury lawn, abayas, bridal, festive formals…"
                  className="w-full h-11 px-5 rounded-full border border-border/90 bg-[#faf8f5] text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-[#e00075] focus:bg-white focus:ring-2 focus:ring-[#e00075]/20 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                  className="h-10 px-5 rounded-full bg-[#e00075] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c20065] transition-colors shrink-0 shadow-xs"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsInlineSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-black/5 text-muted hover:text-foreground shrink-0 text-sm font-bold transition-colors"
                  aria-label="Close search"
                  title="Close search (Esc)"
                >
                  ✕
                </button>
              </div>
            ) : (
              /* Glossy Translucent Glass Capsule Buttons with Left/Right Glass Border & Padding */
              <nav aria-label="Main">
                <ul className="flex items-center justify-center gap-2 xl:gap-2.5">
                  {navItems.map((item) => {
                    const parent = categories.find((c) => c.slug === item.slug);
                    const subs = parent
                      ? categories.filter((c) => c.parentId === parent.id)
                      : [];
                    const isSale = item.slug === "sale";
                    return (
                      <li
                        key={item.label}
                        className="relative"
                        onMouseEnter={() => setHovered(item.label)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex h-10 xl:h-10.5 items-center px-4 xl:px-5 rounded-full text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-300",
                            "bg-white/50 backdrop-blur-md border border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)]",
                            "hover:bg-white hover:text-[#e00075] hover:border-[#e00075]/35 hover:shadow-[0_4px_16px_rgba(224,0,117,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:scale-102",
                            isSale ? "text-[#e00075] font-black" : "text-[#1c1c1c]",
                          )}
                        >
                          {item.label}
                        </Link>

                        {subs.length > 0 && hovered === item.label && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[260px] rounded-xl border border-border bg-surface p-4 shadow-xl animate-fade-in z-50">
                            <ul className="space-y-1">
                              {subs.map((sub) => (
                                <li key={sub.id}>
                                  <Link
                                    href={`/collections/${parent!.slug}?sub=${sub.slug}`}
                                    className="block min-h-9 px-3 py-2 rounded-lg text-xs font-medium text-[#555555] hover:bg-[#faf8f5] hover:text-[#e00075] transition-colors whitespace-nowrap"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                              <li className="pt-2 border-t border-border mt-2">
                                <Link
                                  href={item.href}
                                  className="block min-h-9 px-3 py-1.5 text-xs uppercase tracking-wider font-bold text-[#e00075] hover:underline whitespace-nowrap"
                                >
                                  Explore All {item.label} →
                                </Link>
                              </li>
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </div>

          {/* RIGHT: Actions (Search Trigger + Wishlist + Cart) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  openSearch();
                } else {
                  setIsInlineSearchOpen((prev) => !prev);
                }
              }}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full transition-all",
                isInlineSearchOpen
                  ? "bg-[#e00075] text-white shadow-xs"
                  : "hover:bg-black/5 text-foreground hover:text-[#e00075]",
              )}
              aria-label="Toggle search"
              title="Search collection"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 hover:text-[#e00075] transition-all"
              aria-label={`Wishlist, ${wishes} items`}
            >
              <Heart className="h-5 w-5" />
              {wishes > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e00075] px-1 text-[10px] font-bold text-white shadow-xs">
                  {wishes}
                </span>
              )}
            </Link>

            {/* Shopping Cart Bag */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 hover:text-[#e00075] transition-all"
              aria-label={`Cart, ${bags} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {bags > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e00075] px-1 text-[10px] font-bold text-white shadow-xs">
                  {bags}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


