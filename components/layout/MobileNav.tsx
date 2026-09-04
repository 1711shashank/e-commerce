"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, Sparkles, MessageCircle, Truck, Ruler, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
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

export function MobileNav({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const { isMobileNavOpen, closeMobileNav } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const [drawerSearch, setDrawerSearch] = useState("");

  const parents = categories.filter((c) => !c.parentId);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = drawerSearch.trim();
    if (clean) {
      closeMobileNav();
      setDrawerSearch("");
      router.push(`/products?search=${encodeURIComponent(clean)}`);
    }
  };

  return (
    <Drawer
      open={isMobileNavOpen}
      onClose={closeMobileNav}
      title="Menu"
      side="left"
    >
      {/* Brand Identity Header in Drawer */}
      <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between bg-surface">
        <Link
          href="/"
          onClick={closeMobileNav}
          className="flex items-center group"
          aria-label="Kusum - The Premium Designer Wear"
        >
          <div className="relative h-9 sm:h-10 w-[145px] sm:w-[160px] shrink-0">
            <Image
              src="/logo-wordmark.png"
              alt="Kusum - The Premium Designer Wear"
              fill
              sizes="160px"
              className="object-contain object-left"
            />
          </div>
        </Link>
        <span className="text-[10px] font-bold text-muted bg-[#faf8f5] px-2 py-1 rounded-md border border-border">
          🇦🇪 AED
        </span>
      </div>

      {/* In-Drawer Fast Search Bar */}
      <div className="px-4 pt-3.5 pb-2 border-b border-border/60 bg-[#faf8f5]/50">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#e00075]" />
          <input
            type="search"
            value={drawerSearch}
            onChange={(e) => setDrawerSearch(e.target.value)}
            placeholder="Search lawn, abayas, bridal formals…"
            className="h-10 w-full rounded-full border border-border bg-white pl-10 pr-9 text-xs text-foreground placeholder:text-muted focus:border-[#e00075] focus:outline-none focus:ring-2 focus:ring-[#e00075]/20 shadow-2xs"
            aria-label="Search within navigation"
          />
          {drawerSearch ? (
            <button
              type="button"
              onClick={() => setDrawerSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs"
            >
              ✕
            </button>
          ) : null}
        </form>
      </div>

      {/* Navigation Links */}
      <nav className="px-3 py-3">
        {/* Quick Highlights Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-border/70">
          <Link
            href="/products?new=1"
            onClick={closeMobileNav}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface py-2 px-2 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-[#e00075] hover:text-[#e00075] transition-colors shadow-2xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#e00075]" />
            <span>New Drops</span>
          </Link>
          <Link
            href="/collections/sale"
            onClick={closeMobileNav}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#e00075]/30 bg-[#fdf0f6] py-2 px-2 text-[11px] font-black uppercase tracking-wider text-[#e00075] hover:bg-[#e00075] hover:text-white transition-all shadow-2xs"
          >
            <span>Sale Offers ✦</span>
          </Link>
        </div>

        {/* Primary Categories List */}
        <ul className="space-y-0.5">
          {parents.map((cat) => {
            const subs = categories.filter((c) => c.parentId === cat.id);
            const isOpen = openId === cat.id;
            const isSale = cat.slug === "sale";
            const isBridal = cat.slug === "bridal";
            const targetHref = isBridal ? "/bridal" : `/collections/${cat.slug}`;

            return (
              <li key={cat.id} className="border-b border-border/50 last:border-b-0">
                <div className="flex items-center justify-between">
                  <Link
                    href={targetHref}
                    onClick={closeMobileNav}
                    className={cn(
                      "flex min-h-12 flex-1 items-center px-3 text-xs uppercase tracking-[0.14em] font-bold transition-colors",
                      isSale
                        ? "text-[#e00075]"
                        : "text-foreground hover:text-[#e00075]",
                    )}
                  >
                    <span>{cat.name}</span>
                    {isSale && (
                      <span className="ml-2 rounded-full bg-[#e00075] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                        HOT
                      </span>
                    )}
                    {isBridal && (
                      <span className="ml-2 rounded-full bg-[#141414] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        ATELIER
                      </span>
                    )}
                  </Link>

                  {subs.length > 0 && (
                    <button
                      type="button"
                      className="flex h-12 w-12 items-center justify-center text-muted hover:text-foreground"
                      onClick={() => setOpenId(isOpen ? null : cat.id)}
                      aria-expanded={isOpen}
                      aria-label={`Toggle ${cat.name} subcategories`}
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isOpen && "rotate-180 text-[#e00075]",
                        )}
                      />
                    </button>
                  )}
                </div>

                {isOpen && subs.length > 0 && (
                  <ul className="bg-[#faf8f5]/80 py-2 pl-3 rounded-lg mb-2">
                    {subs.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/collections/${cat.slug}?sub=${sub.slug}`}
                          onClick={closeMobileNav}
                          className="flex min-h-9 items-center px-4 text-xs text-muted hover:text-[#e00075] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={targetHref}
                        onClick={closeMobileNav}
                        className="flex min-h-9 items-center px-4 text-xs font-bold text-[#e00075] hover:underline"
                      >
                        All {cat.name} →
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* WhatsApp Bespoke Concierge Banner */}
        <div className="mt-5 p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
          <a
            href="https://wa.me/971500000000?text=Hello%20Kusum%20Bespoke%20Stylist,%20I%20would%20like%20to%20inquire%20about%20your%20luxury%20couture"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobileNav}
            className="flex items-center justify-between text-xs font-bold text-emerald-900"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="h-4.5 w-4.5 text-emerald-600" />
              <span>WhatsApp Bespoke Stylist</span>
            </div>
            <ArrowRight className="h-4 w-4 text-emerald-600" />
          </a>
        </div>

        {/* Quick Utility Links */}
        <div className="mt-6 border-t border-border pt-4">
          <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-muted font-bold mb-2">
            Client Services
          </p>
          <ul className="space-y-1">
            <li>
              <Link
                href="/track-order"
                onClick={closeMobileNav}
                className="flex min-h-10 items-center gap-2.5 px-3 text-xs font-medium text-muted hover:text-foreground transition-colors"
              >
                <Truck className="h-4 w-4 text-[#e00075]" />
                <span>Track Your Order</span>
              </Link>
            </li>
            <li>
              <Link
                href="/size-guide"
                onClick={closeMobileNav}
                className="flex min-h-10 items-center gap-2.5 px-3 text-xs font-medium text-muted hover:text-foreground transition-colors"
              >
                <Ruler className="h-4 w-4 text-[#e00075]" />
                <span>Custom Stitching & Size Guide</span>
              </Link>
            </li>
            <li>
              <Link
                href="/bridal"
                onClick={closeMobileNav}
                className="flex min-h-10 items-center gap-2.5 px-3 text-xs font-medium text-muted hover:text-foreground transition-colors"
              >
                <Sparkles className="h-4 w-4 text-[#e00075]" />
                <span>Bridal Couture Consultation</span>
              </Link>
            </li>
            <li>
              <Link
                href="/shipping"
                onClick={closeMobileNav}
                className="flex min-h-10 items-center px-3 text-xs text-muted hover:text-foreground transition-colors"
              >
                Shipping & Customs Info
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={closeMobileNav}
                className="flex min-h-10 items-center px-3 text-xs text-muted hover:text-foreground transition-colors"
              >
                About Kusum
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={closeMobileNav}
                className="flex min-h-10 items-center px-3 text-xs text-muted hover:text-foreground transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Section in Drawer */}
        <div className="mt-6 border-t border-border pt-4 pb-6 px-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold mb-3">
            Connect With Us
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://www.instagram.com/kusumdesignerwear?igsi=MWExdXUwM2E5dWswaQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold uppercase tracking-wider text-foreground hover:border-[#e00075] hover:text-[#e00075] transition-colors shadow-2xs"
            >
              <InstagramIcon className="h-4.5 w-4.5 text-[#e00075]" />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/share/197xSpQNnJ/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold uppercase tracking-wider text-foreground hover:border-[#e00075] hover:text-[#e00075] transition-colors shadow-2xs"
            >
              <FacebookIcon className="h-4.5 w-4.5 text-[#e00075]" />
              <span>Facebook</span>
            </a>
            <a
              href="https://youtube.com/@kusumthepremiumdesignerwea-v5v?si=Hv1jcbiTJPztlOZd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold uppercase tracking-wider text-foreground hover:border-[#e00075] hover:text-[#e00075] transition-colors shadow-2xs"
            >
              <YoutubeIcon className="h-4.5 w-4.5 text-[#e00075]" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </nav>
    </Drawer>
  );
}
