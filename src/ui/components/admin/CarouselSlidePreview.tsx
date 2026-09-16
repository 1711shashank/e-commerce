"use client";

import { useEffect, useRef, useState } from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import type { Banner } from "@/lib/types";

export function CarouselSlidePreview({ banner }: { banner: Banner }) {
  const paneRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [live, setLive] = useState({ w: 1280, h: 560 });

  useEffect(() => {
    const paneEl = paneRef.current;
    if (!paneEl) return;

    const update = () => {
      const w = window.innerWidth;
      const h = Math.min(560, Math.max(380, window.innerHeight - 130));
      setLive({ w, h });
      const pw = paneEl.clientWidth;
      setScale(pw > 0 && w > 0 ? pw / w : 0);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(paneEl);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={paneRef}
      className="h-full min-h-0 min-w-0 overflow-y-auto overflow-x-hidden bg-[var(--background)]"
    >
      {scale > 0 ? (
        <div
          className="relative overflow-hidden bg-[#121212]"
          style={{ width: "100%", height: live.h * scale }}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              width: live.w,
              height: live.h,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <HeroCarousel banners={[banner]} preview />
          </div>
        </div>
      ) : null}
    </div>
  );
}
