"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { useStore } from "@/lib/store";
import type { Category } from "@/lib/types";

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

const utilityLinks = [
  { href: "/track-order", label: "Track Your Order" },
  { href: "/size-guide", label: "Custom Stitching & Size Guide" },
  { href: "/bridal", label: "Bridal Couture Consultation" },
  { href: "/shipping", label: "Shipping & Customs" },
  { href: "/about", label: "About Kusum" },
  { href: "/contact", label: "Contact Us" },
];

export function MobileNav({
  categories,
}: {
  categories: Category[];
}) {
  const { isMobileNavOpen, closeMobileNav } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const parents = categories.filter((c) => !c.parentId);

  return (
    <Drawer
      open={isMobileNavOpen}
      onClose={closeMobileNav}
      title="Menu"
      side="left"
    >
      <div className="px-5 py-4 border-b border-border/80 flex items-center gap-3 bg-surface">
        <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 border border-border/60 shadow-xs">
          <Image
            src="/LOGO WITH RING_page-0001.jpg"
            alt="Kusum Logo"
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>
        <div>
          <span className="font-display text-lg tracking-[0.22em] text-foreground font-medium block">
            KUSUM
          </span>
          <span className="text-[7.5px] uppercase tracking-[0.26em] text-[#e00075] font-semibold block">
            THE PREMIUM DESIGNER WEAR
          </span>
        </div>
      </div>

      <nav className="px-3 py-4">
        <ul>
          {parents.map((cat) => {
            const subs = categories.filter((c) => c.parentId === cat.id);
            const isOpen = openId === cat.id;
            return (
              <li key={cat.id} className="border-b border-border">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/collections/${cat.slug}`}
                    onClick={closeMobileNav}
                    className="flex min-h-12 flex-1 items-center px-3 text-xs uppercase tracking-[0.14em] font-medium"
                  >
                    {cat.name}
                  </Link>
                  {subs.length > 0 && (
                    <button
                      type="button"
                      className="flex h-12 w-12 items-center justify-center text-muted"
                      onClick={() => setOpenId(isOpen ? null : cat.id)}
                      aria-expanded={isOpen}
                      aria-label={`Toggle ${cat.name} subcategories`}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
                {isOpen && subs.length > 0 && (
                  <ul className="bg-surface pb-3 pl-2">
                    {subs.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/collections/${cat.slug}?sub=${sub.slug}`}
                          onClick={closeMobileNav}
                          className="flex min-h-10 items-center px-5 text-xs text-muted hover:text-foreground"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={`/collections/${cat.slug}`}
                        onClick={closeMobileNav}
                        className="flex min-h-10 items-center px-5 text-xs font-medium text-accent underline-offset-4 hover:underline"
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

        {/* Quick Utility Links */}
        <div className="mt-8 border-t border-border pt-4">
          <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
            Customer Care & Services
          </p>
          <ul className="space-y-1">
            {utilityLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileNav}
                  className="flex min-h-10 items-center px-3 text-xs text-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media Section in Drawer */}
        <div className="mt-8 border-t border-border pt-5 pb-6 px-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
            Connect With Us
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold uppercase tracking-wider text-foreground hover:border-[#e00075] hover:text-[#e00075] transition-colors shadow-2xs"
            >
              <InstagramIcon className="h-5 w-5 text-[#e00075]" />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold uppercase tracking-wider text-foreground hover:border-[#e00075] hover:text-[#e00075] transition-colors shadow-2xs"
            >
              <FacebookIcon className="h-5 w-5 text-[#e00075]" />
              <span>Facebook</span>
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold uppercase tracking-wider text-foreground hover:border-[#e00075] hover:text-[#e00075] transition-colors shadow-2xs"
            >
              <YoutubeIcon className="h-5 w-5 text-[#e00075]" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </nav>
    </Drawer>
  );
}

