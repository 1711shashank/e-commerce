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
        <div className="mx-auto flex h-9 sm:h-9 max-w-[1536px] items-center justify-between px-3 sm:px-8 xl:px-12">
          {/* Mobile Tier 1: Prominent Social Media Icons (Left) + Delivery & Currency (Right) */}
          <div className="flex lg:hidden w-full items-center justify-between font-[family-name:var(--font-brand)] text-[10px] sm:text-xs">
            {/* Left: Large Prominent Social Icons (Without text labels, clear & touch-friendly) */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <a
                href="https://www.instagram.com/kusumdesignerwear?igsi=MWExdXUwM2E5dWswaQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center text-white/90 hover:text-[#e00075] active:scale-90 transition-all"
                aria-label="Follow Kusum on Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/share/197xSpQNnJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center text-white/90 hover:text-[#e00075] active:scale-90 transition-all"
                aria-label="Follow Kusum on Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@kusumthepremiumdesignerwea-v5v?si=Hv1jcbiTJPztlOZd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center text-white/90 hover:text-[#e00075] active:scale-90 transition-all"
                aria-label="Subscribe to Kusum on YouTube"
              >
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>

            {/* Right: UAE Delivery & Currency Indicator */}
            <div className="flex items-center gap-1.5 min-w-0 pl-2 text-white/95 font-medium tracking-[0.05em]">
              <span className="text-[#e00075] font-bold shrink-0">✦</span>
              <span className="truncate hidden sm:inline">Complimentary UAE Delivery &gt; AED 350</span>
              <span className="truncate sm:hidden text-[10px]">Free UAE Delivery &gt; 350</span>
              <span className="text-white/30 shrink-0">·</span>
              <span className="font-bold text-white shrink-0 text-[10.5px]">🇦🇪 AED</span>
            </div>
          </div>

          {/* Desktop Tier 1: Socials (Left), Center Banner, Utilities (Right) */}
          <div className="hidden lg:flex w-full items-center justify-between gap-4">
            {/* Social Icons & Names */}
            <div className="flex items-center gap-3 sm:gap-4 font-[family-name:var(--font-brand)] text-xs font-bold uppercase tracking-[0.14em] shrink-0">
              <a
                href="https://www.instagram.com/kusumdesignerwear?igsi=MWExdXUwM2E5dWswaQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-white/85 transition-colors hover:text-[#e00075]"
                aria-label="Follow Kusum on Instagram"
              >
                <InstagramIcon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                <span>Instagram</span>
              </a>
              <span className="text-white/25">·</span>
              <a
                href="https://www.facebook.com/share/197xSpQNnJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-white/85 transition-colors hover:text-[#e00075]"
                aria-label="Follow Kusum on Facebook"
              >
                <FacebookIcon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                <span>Facebook</span>
              </a>
              <span className="text-white/25">·</span>
              <a
                href="https://youtube.com/@kusumthepremiumdesignerwea-v5v?si=Hv1jcbiTJPztlOZd"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-white/85 transition-colors hover:text-[#e00075]"
                aria-label="Subscribe to Kusum on YouTube"
              >
                <YoutubeIcon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                <span>YouTube</span>
              </a>
            </div>

            {/* Central Promotion */}
            <p className="text-xs tracking-[0.08em] text-white/95 font-medium">
              Complimentary UAE Delivery on orders over AED 350 · Worldwide Express Delivery
            </p>

            {/* Right Utilities (Track Order, Size Guide, Currency) */}
            <div className="flex items-center gap-3 sm:gap-4 font-[family-name:var(--font-brand)] text-xs font-bold uppercase tracking-[0.14em] text-white/85 shrink-0">
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
              <span className="text-white/25">·</span>
              <span className="font-black text-white tracking-wider">
                🇦🇪 AED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 2: Main Header Bar */}
      <div className="border-b border-border/80 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 sm:h-18 lg:h-19 xl:h-20 max-w-[1536px] items-center justify-between gap-2 sm:gap-4 px-3 sm:px-8 xl:px-12">
          
          {/* ========================================================= */}
          {/* MOBILE HEADER LAYOUT (< lg): Symmetrical 3-Section Layout */}
          {/* ========================================================= */}
          <div className="flex lg:hidden w-full items-center justify-between">
            {/* Left: Hamburger Menu + Search */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={openMobileNav}
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-black/5 hover:text-[#e00075] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5.5 w-5.5" />
              </button>
              <button
                type="button"
                onClick={openSearch}
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-black/5 hover:text-[#e00075] transition-colors"
                aria-label="Search collection"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Center: Official Brand Wordmark Logo (Pixel-perfect on 360px Galaxy S8+ to 4K) */}
            <Link
              href="/"
              className="flex items-center justify-center group py-1 outline-none select-none min-w-0"
              aria-label="Kusum - The Premium Designer Wear"
            >
              <div className="relative h-8.5 sm:h-9.5 w-[125px] sm:w-[145px] shrink-0 transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/logo-wordmark.png"
                  alt="Kusum - The Premium Designer Wear"
                  fill
                  priority
                  sizes="(max-width: 640px) 130px, 150px"
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Right: Wishlist + Cart */}
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/wishlist"
                className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 text-foreground hover:text-[#e00075] transition-colors"
                aria-label={`Wishlist, ${wishes} items`}
              >
                <Heart className="h-5 w-5" />
                {wishes > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e00075] px-1 text-[10px] font-bold text-white shadow-xs">
                    {wishes}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 text-foreground hover:text-[#e00075] transition-colors"
                aria-label={`Cart, ${bags} items`}
              >
                <ShoppingBag className="h-5 w-5" />
                {bags > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e00075] px-1 text-[10px] font-bold text-white shadow-xs">
                    {bags}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DESKTOP HEADER LAYOUT (>= lg): Symmetrical Luxury Flanks  */}
          {/* ========================================================= */}
          {/* LEFT FLANK: Brand Identity (Balanced Symmetrical Width) */}
          <div className="hidden lg:flex items-center shrink-0 w-[240px] 2xl:w-[270px] justify-start">
            <Link
              href="/"
              className="flex items-center group py-1 shrink-0 outline-none select-none"
              aria-label="Kusum - The Premium Designer Wear"
            >
              <div className="relative h-11.5 xl:h-12.5 2xl:h-13 w-[170px] xl:w-[190px] 2xl:w-[205px] shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo-wordmark.png"
                  alt="Kusum - The Premium Designer Wear"
                  fill
                  priority
                  sizes="(max-width: 1280px) 175px, 205px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
          </div>

          {/* MIDDLE: Symmetrical Glass Capsule Navigation OR Sliding Search - EXACT DEAD CENTER */}
          <div className="hidden lg:flex flex-1 items-center justify-center min-w-0 px-2">
            {isInlineSearchOpen ? (
              /* Sliding Search Input in the SAME middle space */
              <div className="flex w-full max-w-xl items-center gap-3 px-3 py-1 animate-fade-in">
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
                      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  placeholder="Search luxury lawn, abayas, bridal, festive formals…"
                  className="w-full h-10.5 px-4 rounded-full border border-border/90 bg-[#faf8f5] text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-[#e00075] focus:bg-white focus:ring-2 focus:ring-[#e00075]/20 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  className="h-9.5 px-4 rounded-full bg-[#e00075] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c20065] transition-colors shrink-0 shadow-xs"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsInlineSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="h-9.5 w-9.5 flex items-center justify-center rounded-full hover:bg-black/5 text-muted hover:text-foreground shrink-0 text-sm font-bold transition-colors"
                  aria-label="Close search"
                  title="Close search (Esc)"
                >
                  ✕
                </button>
              </div>
            ) : (
              /* Glossy Translucent Glass Capsule Buttons - Symmetrically Aligned */
              <nav aria-label="Main" className="max-w-full">
                <ul className="flex items-center justify-center gap-1 xl:gap-1.5 2xl:gap-2">
                  {navItems.map((item) => {
                    const parent = categories.find((c) => c.slug === item.slug);
                    const subs = parent
                      ? categories.filter((c) => c.parentId === parent.id)
                      : [];
                    const isSale = item.slug === "sale";
                    return (
                      <li
                        key={item.label}
                        className="relative shrink-0"
                        onMouseEnter={() => setHovered(item.label)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex h-9 xl:h-9.5 2xl:h-10 items-center px-2.5 xl:px-3.5 2xl:px-4.5 rounded-full text-[10px] xl:text-[11px] 2xl:text-[11.5px] font-bold uppercase tracking-[0.08em] xl:tracking-[0.11em] whitespace-nowrap transition-colors duration-200 outline-none focus:outline-none",
                            "bg-white/55 backdrop-blur-md border border-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)]",
                            "hover:bg-white hover:text-[#e00075] hover:border-[#e00075]/35 hover:shadow-[0_2px_12px_rgba(224,0,117,0.12)]",
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

          {/* RIGHT FLANK: Actions (Search Trigger + Wishlist + Cart) (Balanced Symmetrical Width) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 w-[240px] 2xl:w-[270px] justify-end relative z-20">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsInlineSearchOpen((prev) => !prev)}
              className={cn(
                "flex h-10 w-10 sm:h-10.5 sm:w-10.5 items-center justify-center rounded-full transition-all outline-none focus:outline-none",
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
              className="relative flex h-10 w-10 sm:h-10.5 sm:w-10.5 items-center justify-center rounded-full hover:bg-black/5 hover:text-[#e00075] transition-all outline-none"
              aria-label={`Wishlist, ${wishes} items`}
            >
              <Heart className="h-5 w-5" />
              {wishes > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e00075] px-1 text-[10px] font-bold text-white shadow-xs">
                  {wishes}
                </span>
              )}
            </Link>

            {/* Shopping Cart Bag */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex h-10 w-10 sm:h-10.5 sm:w-10.5 items-center justify-center rounded-full hover:bg-black/5 hover:text-[#e00075] transition-all outline-none"
              aria-label={`Cart, ${bags} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {bags > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e00075] px-1 text-[10px] font-bold text-white shadow-xs">
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
