"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

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
              <div className="relative h-[360px] sm:h-[440px] lg:h-[560px]">
                <Image
                  src={banner.image}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
                <div className="absolute inset-0 flex items-end sm:items-center">
                  <div className="mx-auto w-full max-w-7xl px-5 pb-12 pt-20 sm:px-8 sm:pb-0 lg:px-10">
                    <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/70 animate-fade-up">
                      Aurelia Collection
                    </p>
                    <h1 className="max-w-xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl animate-fade-up [animation-delay:80ms]">
                      {banner.title}
                    </h1>
                    <p className="mt-4 max-w-md text-sm text-white/85 sm:text-base animate-fade-up [animation-delay:140ms]">
                      {banner.subtitle}
                    </p>
                    <div className="mt-7 animate-fade-up [animation-delay:200ms]">
                      <Button
                        variant="secondary"
                        className="bg-white text-foreground hover:bg-white/90"
                      >
                        <Link href={banner.ctaHref}>{banner.ctaLabel}</Link>
                      </Button>
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
