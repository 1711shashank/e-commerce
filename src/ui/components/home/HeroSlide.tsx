"use client";

import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/lib/types";

type HeroSlideProps = {
  banner: Banner;
  preview?: boolean;
};

export function HeroSlide({ banner, preview = false }: HeroSlideProps) {
  const unoptimized = preview || banner.image.startsWith("blob:");

  const media = banner.image ? (
    <Image
      src={banner.image}
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-contain object-center"
      unoptimized={unoptimized || preview}
    />
  ) : (
    <div className="absolute inset-0 bg-foreground/80" />
  );

  const frame = (
    <div className="relative h-full w-full bg-foreground">{media}</div>
  );

  if (!preview && banner.ctaHref) {
    return (
      <div className="relative h-full min-w-0 flex-[0_0_100%]">
        <Link href={banner.ctaHref} className="relative block h-full w-full">
          {frame}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative h-full min-w-0 flex-[0_0_100%]">{frame}</div>
  );
}
