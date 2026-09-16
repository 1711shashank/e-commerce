"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";
import { HeroSlide } from "@/components/home/HeroSlide";

type HeroCarouselProps = {
  banners: Banner[];
  selectedIndex?: number;
  onSelectSlide?: (index: number) => void;
  preview?: boolean;
};

export function HeroCarousel({
  banners,
  selectedIndex = 0,
  onSelectSlide,
  preview = false,
}: HeroCarouselProps) {
  const showControls = !preview && banners.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: showControls, startIndex: selectedIndex, watchDrag: !preview },
    preview ? [] : [Autoplay({ delay: 5000, stopOnInteraction: false })],
  );
  const [selected, setSelected] = useState(selectedIndex);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelected(index);
      onSelectSlide?.(index);
    };
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelectSlide]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(selectedIndex, true);
  }, [emblaApi, selectedIndex]);

  if (!banners.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#121212]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner, index) => (
            <HeroSlide
              key={banner.id}
              banner={banner}
              priority={index === 0}
              preview={preview}
            />
          ))}
        </div>
      </div>

      {showControls && (
        <>
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
        </>
      )}
    </section>
  );
}
