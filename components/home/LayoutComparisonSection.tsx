import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";

export function LayoutComparisonSection() {
  // Select 3 signature products to showcase each layout option
  const p1 = products[0]; // Chintz Rose Luxury Lawn
  const p2 = products[1]; // Zaffran Embroidered Chiffon
  const p3 = products[2]; // Mbroidered Velvet Festive

  return (
    <section className="border-t border-border/80 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] py-14 lg:py-20">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e00075]/10 border border-[#e00075]/20 text-[#e00075] text-[10.5px] uppercase tracking-[0.24em] font-bold mb-3 shadow-2xs">
            <span>Client Design Studio · Live Showcase</span>
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
            Compare All 3 Luxury Card Layouts
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted max-w-xl mx-auto">
            Review and interact with the 3 distinct luxury layout concepts live to finalize the definitive visual signature for Kusum.
          </p>
        </div>

        {/* 3 Layouts Side-by-Side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-10">
          {/* Card Concept 1 */}
          <div className="flex flex-col bg-white p-5 rounded-2xl border border-[#e6e2dc]/80 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
              <span className="px-3 py-1 rounded-full bg-[#141414] text-white text-[11px] font-bold tracking-wider uppercase">
                👑 Option 1: Royal Atelier
              </span>
              <span className="text-[10px] text-[#e00075] font-semibold">Recommended</span>
            </div>
            <p className="text-xs text-muted mb-5 leading-relaxed">
              Soft 12px rounded frame, pearl border, hover silk shine sweep, and bottom-right quick-add bag button.
            </p>
            <div className="flex-1">
              <ProductCard product={p1} layoutStyle="atelier" />
            </div>
          </div>

          {/* Card Concept 2 */}
          <div className="flex flex-col bg-white p-5 rounded-2xl border border-[#e6e2dc]/80 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
              <span className="px-3 py-1 rounded-full bg-[#141414] text-white text-[11px] font-bold tracking-wider uppercase">
                ⚡ Option 2: Maria.B Runway
              </span>
              <span className="text-[10px] text-muted font-medium">Modern Luxury</span>
            </div>
            <p className="text-xs text-muted mb-5 leading-relaxed">
              Minimalist edge-to-edge frame, deep slow zoom, and slide-up frosted glass bar with unstitched/stitched quick-add.
            </p>
            <div className="flex-1">
              <ProductCard product={p2} layoutStyle="runway" />
            </div>
          </div>

          {/* Card Concept 3 */}
          <div className="flex flex-col bg-white p-5 rounded-2xl border border-[#e6e2dc]/80 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
              <span className="px-3 py-1 rounded-full bg-[#141414] text-white text-[11px] font-bold tracking-wider uppercase">
                🏰 Option 3: Heritage Trousseau
              </span>
              <span className="text-[10px] text-muted font-medium">Bridal Opulence</span>
            </div>
            <p className="text-xs text-muted mb-5 leading-relaxed">
              Padded champagne canvas, gold handcrafted ribbon, and dual hover actions (Bag + WhatsApp Bespoke Stylist).
            </p>
            <div className="flex-1">
              <ProductCard product={p3} layoutStyle="heritage" />
            </div>
          </div>
        </div>

        {/* Quick Collection Link */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted mb-3">
            Want to test these styles across the entire 40+ piece catalog?
          </p>
          <Link
            href="/collections/ready-to-wear"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141414] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#e00075] transition-colors shadow-sm"
          >
            <span>Open Interactive Collection Grid Switcher →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
