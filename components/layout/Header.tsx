"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Women", href: "/collections/women", slug: "women" },
  { label: "Men", href: "/collections/men", slug: "men" },
  { label: "Kids", href: "/collections/kids", slug: "kids" },
  { label: "Unstitched", href: "/collections/unstitched", slug: "unstitched" },
  {
    label: "Ready to Wear",
    href: "/collections/ready-to-wear",
    slug: "ready-to-wear",
  },
  { label: "Sale", href: "/collections/sale", slug: "sale" },
  { label: "New Arrivals", href: "/products?new=1", slug: null },
];

export function Header({ categories }: { categories: Category[] }) {
  const {
    openCart,
    openMobileNav,
    openSearch,
    cartCount,
    wishlistCount,
  } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bags = mounted ? cartCount() : 0;
  const wishes = mounted ? wishlistCount() : 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors",
        scrolled
          ? "border-border bg-surface/95 backdrop-blur-md"
          : "border-transparent bg-surface/80 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8 lg:px-10">
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={openMobileNav}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <Link
          href="/"
          className="font-display text-2xl tracking-[0.18em] sm:text-3xl"
        >
          AURELIA
        </Link>

        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const parent = categories.find((c) => c.slug === item.slug);
              const subs = parent
                ? categories.filter((c) => c.parentId === parent.id)
                : [];
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
                      "flex min-h-11 items-center px-3 text-xs uppercase tracking-[0.14em] transition-colors hover:text-accent",
                      item.slug === "sale" && "text-sale",
                    )}
                  >
                    {item.label}
                  </Link>
                  {subs.length > 0 && hovered === item.label && (
                    <div className="absolute left-0 top-full min-w-[220px] border border-border bg-surface p-4 shadow-lg animate-fade-in">
                      <ul className="space-y-1">
                        {subs.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`/collections/${parent!.slug}?sub=${sub.slug}`}
                              className="block min-h-10 px-2 py-2 text-sm text-muted hover:text-foreground"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href={item.href}
                            className="block min-h-10 px-2 py-2 text-sm font-medium"
                          >
                            Shop all {item.label}
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

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={openSearch}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/wishlist"
            className="relative flex h-11 w-11 items-center justify-center"
            aria-label={`Wishlist, ${wishes} items`}
          >
            <Heart className="h-5 w-5" />
            {wishes > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[10px] text-white">
                {wishes}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-11 w-11 items-center justify-center"
            aria-label={`Cart, ${bags} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {bags > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[10px] text-white">
                {bags}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
