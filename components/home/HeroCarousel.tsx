"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-foreground">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative h-[540px] sm:h-[660px] lg:h-[780px] xl:h-[840px]">
                <Image
                  src={banner.image}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
                <div className="absolute inset-0 flex items-end sm:items-center">
                  <div className="mx-auto w-full max-w-[1536px] px-5 pb-16 pt-16 sm:px-8 sm:pb-0 sm:pt-20 xl:px-12">
                    <p className="mb-3 sm:mb-4 text-[11px] sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#fdf0f6] font-semibold animate-fade-up">
                      Kusum Designer Wear · The Haute Couture Edit
                    </p>
                    <h1 className="max-w-2xl font-[family-name:var(--font-heading)] text-3xl leading-[1.1] text-white sm:text-6xl lg:text-7xl xl:text-8xl animate-fade-up [animation-delay:80ms] drop-shadow-md">
                      {banner.title}
                    </h1>
                    <p className="mt-3 sm:mt-5 max-w-lg text-xs sm:text-lg text-white/90 animate-fade-up [animation-delay:140ms] font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {banner.subtitle}
                    </p>
                    {/* Aligned CTA Action Buttons: Symmetrically stacked on mobile, row on tablet/desktop */}
                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none animate-fade-up [animation-delay:200ms]">
                      <Link
                        href={banner.ctaHref}
                        className="flex h-11.5 sm:h-12 w-full sm:w-auto items-center justify-center rounded-full bg-[#e00075] px-6 sm:px-8 text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white shadow-xl transition-all duration-300 hover:bg-[#c20065] hover:scale-105 active:scale-95 text-center"
                      >
                        {banner.ctaLabel}
                      </Link>
                      <Link
                        href="/bridal"
                        className="flex h-11.5 sm:h-12 w-full sm:w-auto items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 sm:px-8 text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:scale-105 active:scale-95 text-center"
                      >
                        Bridal Bespoke
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next Navigation Controls: Circular Frosted Luxury Badges */}
      <button
        type="button"
        onClick={scrollPrev}
        className="absolute left-2.5 sm:left-6 top-1/2 z-10 flex h-9 w-9 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 sm:bg-white/15 text-white backdrop-blur-md border border-white/20 hover:bg-white/30 transition-all active:scale-90 shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-2.5 sm:right-6 top-1/2 z-10 flex h-9 w-9 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 sm:bg-white/15 text-white backdrop-blur-md border border-white/20 hover:bg-white/30 transition-all active:scale-90 shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
      </button>

      {/* Slide Position Indicator Dots */}
      <div className="absolute bottom-4 sm:bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {banners.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-1.5 sm:h-2 rounded-full transition-all",
              selected === i ? "w-7 sm:w-8 bg-white" : "w-2 bg-white/50",
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={selected === i}
          />
        ))}
      </div>
    </section>
  );
}
