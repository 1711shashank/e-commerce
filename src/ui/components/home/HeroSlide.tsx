"use client";

import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/lib/types";

type HeroSlideProps = {
  banner: Banner;
  priority?: boolean;
  preview?: boolean;
};

export function HeroSlide({
  banner,
  priority = false,
  preview = false,
}: HeroSlideProps) {
  const unoptimized = preview || banner.image?.startsWith("blob:");
  const ctaLabel = banner.ctaLabel || "Shop Now";
  const title = banner.title || "Featured Collection";
  const ariaLabel =
    banner.title && banner.ctaLabel
      ? `${banner.title} — ${banner.ctaLabel}`
      : banner.title || ctaLabel;

  const isLink = !preview && Boolean(banner.ctaHref);
  const className = `group relative block w-full aspect-[16/9] sm:aspect-auto sm:h-[50vh] lg:h-[calc(100vh-130px)] lg:max-h-[560px] xl:max-h-[620px] min-h-[220px] sm:min-h-[380px] overflow-hidden select-none bg-[#0d0d0d] ${
    isLink ? "cursor-pointer" : "cursor-default"
  }`;

  const content = (
    <>
      {/* Ambient Blurred Backdrop (Fills ultra-wide margins with slide's natural luxury tone) */}
      {banner.image ? (
        <Image
          src={banner.image}
          alt=""
          fill
          aria-hidden="true"
          className="hidden sm:block object-cover blur-2xl scale-110 opacity-30 pointer-events-none"
          unoptimized={unoptimized}
        />
      ) : null}

      {/* 100% Full-Fidelity Uncropped Banner (Sharp, centered, zero text or model cropped) */}
      {banner.image ? (
        <Image
          src={banner.image}
          alt={banner.title || title}
          fill
          priority={priority}
          sizes="100vw"
          className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          unoptimized={unoptimized}
        />
      ) : (
        <div className="absolute inset-0 bg-[#0d0d0d]" />
      )}

      {/* Subtle Luxury Vignette on Desktop Bottom for CTA Contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 sm:opacity-40" />

      {/* Hidden Semantic Info for SEO and Screen Readers */}
      <div className="sr-only">
        <h2>{title}</h2>
        {banner.subtitle && <p>{banner.subtitle}</p>}
      </div>

      {/* Desktop Floating Pill Action: Subtle, High-End & Unobtrusive */}
      {banner.ctaHref ? (
        <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-8 z-10 hidden sm:flex items-center gap-2 rounded-full bg-[#141414]/90 px-4.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-xl backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:bg-[#e00075] group-hover:border-[#e00075] group-hover:scale-105">
          <span>{ctaLabel}</span>
          <span className="text-[#ffd6eb] transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      ) : null}
    </>
  );

  return (
    <div className="relative min-w-0 flex-[0_0_100%]">
      {isLink ? (
        <Link href={banner.ctaHref} className={className} aria-label={ariaLabel}>
          {content}
        </Link>
      ) : (
        <div className={className} aria-label={ariaLabel}>
          {content}
        </div>
      )}
    </div>
  );
}
