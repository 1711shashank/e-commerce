"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-border/30 lg:flex-1"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <Image
          src={images[active]}
          alt={`${name} image ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-500",
            zoomed && "scale-125",
          )}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 lg:w-20 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative h-20 w-16 shrink-0 overflow-hidden border-2 lg:h-24 lg:w-full",
              active === i ? "border-foreground" : "border-transparent",
            )}
            aria-label={`View image ${i + 1}`}
            aria-pressed={active === i}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
