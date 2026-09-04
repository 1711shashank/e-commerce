"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
}

export function FeaturedProducts({
  title,
  subtitle,
  products,
  href = "/collections",
}: FeaturedProductsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="mx-auto max-w-[1536px] px-4 py-10 sm:px-8 lg:py-14 xl:px-12">
      <div className="mb-6 flex flex-col gap-2.5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {subtitle && (
            <p className="text-xs uppercase tracking-[0.22em] text-[#e00075] font-bold">
              {subtitle}
            </p>
          )}
          <h2 className="mt-1.5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141414]">
            {title}
          </h2>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <Link
            href={href}
            className="text-xs uppercase tracking-[0.18em] font-semibold text-foreground hover:text-[#e00075] transition-colors underline-offset-4 hover:underline"
          >
            Explore Collection →
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={scrollPrev}
              className="flex h-8.5 w-8.5 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-[#e00075] hover:text-[#e00075]"
              aria-label="Previous products"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="flex h-8.5 w-8.5 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-[#e00075] hover:text-[#e00075]"
              aria-label="Next products"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_68%] xs:flex-[0_0_58%] sm:flex-[0_0_42%] md:flex-[0_0_31%] lg:flex-[0_0_24%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
