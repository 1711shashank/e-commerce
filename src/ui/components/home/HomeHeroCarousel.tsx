"use client";

import { useEffect, useState } from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { fetchPublicBanners } from "@/lib/banner-api";
import type { Banner } from "@/lib/types";

export function HomeHeroCarousel({
  initialBanners = [],
}: {
  initialBanners?: Banner[];
}) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPublicBanners();
        if (!cancelled) setBanners(data);
      } catch {
        if (!cancelled) setBanners(initialBanners);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!banners.length) return null;

  return <HeroCarousel banners={banners} />;
}
