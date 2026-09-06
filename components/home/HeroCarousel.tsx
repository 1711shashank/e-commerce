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
    <section className="relative overflow-hidden bg-[#121212]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner, index) => (
            <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
              <Link
                href={banner.ctaHref}
                className="group relative block w-full aspect-[16/9] sm:aspect-auto sm:h-[50vh] lg:h-[calc(100vh-130px)] lg:max-h-[560px] xl:max-h-[620px] min-h-[220px] sm:min-h-[380px] overflow-hidden cursor-pointer select-none bg-[#0d0d0d]"
                aria-label={`${banner.title} — ${banner.ctaLabel}`}
              >
                {/* Ambient Blurred Backdrop (Fills ultra-wide margins with slide's natural luxury tone) */}
                <Image
                  src={banner.image}
                  alt=""
                  fill
                  aria-hidden="true"
                  className="hidden sm:block object-cover blur-2xl scale-110 opacity-30 pointer-events-none"
                />

                {/* 100% Full-Fidelity Uncropped Banner (Sharp, centered, zero text or model cropped) */}
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                />

                {/* Subtle Luxury Vignette on Desktop Bottom for CTA Contrast */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 sm:opacity-40" />

                {/* Hidden Semantic Info for SEO and Screen Readers */}
                <div className="sr-only">
                  <h2>{banner.title}</h2>
                  <p>{banner.subtitle}</p>
                </div>

                {/* Desktop Floating Pill Action: Subtle, High-End & Unobtrusive */}
                <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-8 z-10 hidden sm:flex items-center gap-2 rounded-full bg-[#141414]/90 px-4.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-xl backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:bg-[#e00075] group-hover:border-[#e00075] group-hover:scale-105">
                  <span>{banner.ctaLabel}</span>
                  <span className="text-[#ffd6eb] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next Navigation Controls: Circular Frosted Glass */}
      <button
        type="button"
        onClick={scrollPrev}
        className="absolute left-2 sm:left-6 top-1/2 z-20 flex h-8 w-8 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 sm:bg-black/35 text-white backdrop-blur-md border border-white/20 hover:bg-[#e00075] hover:border-[#e00075] transition-all active:scale-90 shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-2 sm:right-6 top-1/2 z-20 flex h-8 w-8 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 sm:bg-black/35 text-white backdrop-blur-md border border-white/20 hover:bg-[#e00075] hover:border-[#e00075] transition-all active:scale-90 shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Slide Position Indicator Dots */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:gap-2">
        {banners.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-1.5 sm:h-2 rounded-full transition-all shadow-[0_1px_3px_rgba(0,0,0,0.8)]",
              selected === i
                ? "w-6 sm:w-8 bg-[#e00075]"
                : "w-2 sm:w-2.5 bg-white/70 hover:bg-white",
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={selected === i}
          />
        ))}
      </div>
    </section>
  );
}
