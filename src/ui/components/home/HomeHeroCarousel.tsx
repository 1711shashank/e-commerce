"use client";

import { useEffect, useState } from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { fetchPublicBanners } from "@/lib/banner-api";
import type { Banner } from "@/lib/types";

export function HomeHeroCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPublicBanners();
        if (!cancelled) setBanners(data);
      } catch {
        if (!cancelled) setBanners([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section
        className="relative h-[360px] bg-foreground sm:h-[440px] lg:h-[560px]"
        aria-label="Loading carousel"
        aria-busy="true"
      />
    );
  }

  if (!banners.length) return null;

  return <HeroCarousel banners={banners} />;
}
