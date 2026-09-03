"use client";

import Link from "next/link";
import Image from "next/image";

const marqueeItems = [
  { label: "LUXURY LAWN '26", href: "/collections/unstitched" },
  { label: "SIGNATURE MODEST ABAYAS & SHEILAS", href: "/collections/abayas-kaftans" },
  { label: "SHEHNAI WEDDING FORMALS", href: "/collections/luxury-formals" },
  { label: "EXPERT IN-HOUSE STITCHING", href: "/size-guide" },
  { label: "COMPLIMENTARY UAE DELIVERY OVER AED 350", href: "/shipping" },
  { label: "HAUTE BRIDAL COUTURE", href: "/bridal" },
  { label: "FESTIVE READY TO WEAR", href: "/collections/ready-to-wear" },
  { label: "WORLDWIDE EXPRESS DHL SHIPPING", href: "/track-order" },
  { label: "MOMMY & ME GIRLS ETHNIC EDIT", href: "/collections/mommy-and-me" },
];

export function InfiniteMarquee() {
  // Duplicate array for continuous seamless infinite loop
  const list = [...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full overflow-hidden border-y border-[#e00075]/30 bg-[#121212] py-4 sm:py-5 text-white shadow-md">
      <div className="animate-marquee flex items-center">
        {list.map((item, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            {/* Embedded Official Ring Logo */}
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden shrink-0 border border-white/30 shadow-xs mx-4 bg-white">
              <Image
                src="/LOGO WITH RING_page-0001.jpg"
                alt="Kusum"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <Link
              href={item.href}
              className="text-[12.5px] sm:text-[14px] uppercase tracking-[0.24em] font-bold text-white/95 hover:text-[#e00075] transition-colors pr-6 whitespace-nowrap"
            >
              {item.label}
            </Link>
            <span className="text-[#e00075] text-xs select-none pr-3">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
