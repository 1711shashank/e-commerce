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
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
      <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
        <div>
          {subtitle && (
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {subtitle}
            </p>
          )}
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            className="hidden h-11 w-11 items-center justify-center border border-border hover:border-foreground sm:flex"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="hidden h-11 w-11 items-center justify-center border border-border hover:border-foreground sm:flex"
            aria-label="Next products"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <Link
            href={href}
            className="text-sm underline-offset-4 hover:underline"
          >
            Shop all
          </Link>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_70%] sm:flex-[0_0_40%] md:flex-[0_0_30%] lg:flex-[0_0_23%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
