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
    <section className="relative h-[70dvh] max-h-[70dvh] overflow-hidden bg-foreground">
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {banners.map((banner) => (
            <HeroSlide key={banner.id} banner={banner} preview={preview} />
          ))}
        </div>
      </div>

      {showControls && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/15 text-white backdrop-blur hover:bg-white/25 sm:left-6"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/15 text-white backdrop-blur hover:bg-white/25 sm:right-6"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
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
        </>
      )}
    </section>
  );
}
