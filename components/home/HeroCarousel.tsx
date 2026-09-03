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
              <div className="relative h-[520px] sm:h-[660px] lg:h-[780px] xl:h-[840px]">
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
                  <div className="mx-auto w-full max-w-[1536px] px-4 pb-14 pt-20 sm:px-8 sm:pb-0 xl:px-12">
                    <p className="mb-4 text-xs sm:text-sm uppercase tracking-[0.35em] text-[#fdf0f6] font-semibold animate-fade-up">
                      Kusum Designer Wear · The Haute Couture Edit
                    </p>
                    <h1 className="max-w-2xl font-[family-name:var(--font-heading)] text-4xl leading-[1.08] text-white sm:text-6xl lg:text-7xl xl:text-8xl animate-fade-up [animation-delay:80ms] drop-shadow-md">
                      {banner.title}
                    </h1>
                    <p className="mt-5 max-w-lg text-sm text-white/90 sm:text-lg animate-fade-up [animation-delay:140ms] font-light">
                      {banner.subtitle}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-up [animation-delay:200ms]">
                      <Link
                        href={banner.ctaHref}
                        className="flex h-12 items-center justify-center rounded-full bg-[#e00075] px-8 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-300 hover:bg-[#c20065] hover:scale-105"
                      >
                        {banner.ctaLabel}
                      </Link>
                      <Link
                        href="/bridal"
                        className="flex h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:scale-105"
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

      <button
        type="button"
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/15 text-white backdrop-blur hover:bg-white/25 sm:left-6"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/15 text-white backdrop-blur hover:bg-white/25 sm:right-6"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {banners.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              selected === i ? "w-8 bg-white" : "w-2 bg-white/50",
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={selected === i}
          />
        ))}
      </div>
    </section>
  );
}
