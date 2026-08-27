"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getCategories } from "@/lib/services";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const categories = getCategories();

  return (
    <>
      <Header categories={categories} />
      <MobileNav categories={categories} />
      <SearchOverlay />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
