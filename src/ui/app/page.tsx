import type { Metadata } from "next";
import { HomeHeroCarousel } from "@/components/home/HomeHeroCarousel";
import { InfiniteMarquee } from "@/components/home/InfiniteMarquee";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { LayoutComparisonSection } from "@/components/home/LayoutComparisonSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoStrip } from "@/components/home/PromoStrip";
import { fetchPublicBanners } from "@/lib/banner-api";
import {
  getBestSellers,
  getFeaturedProducts,
  getParentCategories,
  getPromoStrips,
  getSaleProducts,
} from "@/lib/services";

export const metadata: Metadata = {
  title: "Kusum — The Premium Designer Wear | Luxury Ethnic & Modest Fashion",
  description:
    "Discover luxury women's ethnic and Islamic modest wear by Kusum. Shop 3-piece unstitched lawn, festive pret, wedding formals, and modest abayas with express delivery across UAE and worldwide.",
};

export default async function HomePage() {
  const categories = getParentCategories();
  const featured = getFeaturedProducts(8);
  const bestsellers = getBestSellers(8);
  const sale = getSaleProducts(8);
  const promos = getPromoStrips();
  let banners = [] as Awaited<ReturnType<typeof fetchPublicBanners>>;
  try {
    banners = await fetchPublicBanners();
  } catch {
    banners = [];
  }

  return (
    <>
      <HomeHeroCarousel initialBanners={banners} />
      <InfiniteMarquee />
      <CategoryGrid categories={categories} />
      <LayoutComparisonSection />
      <PromoStrip items={promos} />
      <FeaturedProducts
        title="New Drops"
        subtitle="Fresh from the atelier"
        products={featured}
        href="/products?new=1"
      />
      <div className="border-t border-border">
        <FeaturedProducts
          title="Most Coveted"
          subtitle="Customer favourites"
          products={bestsellers}
          href="/collections/unstitched"
        />
      </div>
      <div className="bg-surface">
        <FeaturedProducts
          title="Seasonal Offers"
          subtitle="Limited-time reductions"
          products={sale}
          href="/collections/sale"
        />
      </div>
    </>
  );
}
