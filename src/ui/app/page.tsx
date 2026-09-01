import type { Metadata } from "next";
import { HomeHeroCarousel } from "@/components/home/HomeHeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoStrip } from "@/components/home/PromoStrip";
import {
  getBestSellers,
  getFeaturedProducts,
  getParentCategories,
  getPromoStrips,
  getSaleProducts,
} from "@/lib/services";

export const metadata: Metadata = {
  title: "Aurelia — Contemporary Clothing",
  description:
    "Discover new arrivals, lawn collections, ready-to-wear, and seasonal sale pieces at Aurelia.",
};

export default function HomePage() {
  const categories = getParentCategories();
  const featured = getFeaturedProducts(8);
  const bestsellers = getBestSellers(8);
  const sale = getSaleProducts(8);
  const promos = getPromoStrips();

  return (
    <>
      <HomeHeroCarousel />
      <CategoryGrid categories={categories} />
      <PromoStrip items={promos} />
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Just landed"
        products={featured}
        href="/products?new=1"
      />
      <div className="border-t border-border">
        <FeaturedProducts
          title="Best Sellers"
          subtitle="Most loved"
          products={bestsellers}
          href="/collections"
        />
      </div>
      <div className="bg-surface">
        <FeaturedProducts
          title="On Sale"
          subtitle="Limited time"
          products={sale}
          href="/collections/sale"
        />
      </div>
    </>
  );
}
