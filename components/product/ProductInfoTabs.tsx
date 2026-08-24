"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "description",
    label: "Description",
    content: (description: string) => description,
  },
  {
    id: "size-guide",
    label: "Size Guide",
    content: () =>
      "Refer to our standard size chart. For unstitched pieces, fabric lengths are listed on the product card. When in doubt between sizes, size up for a relaxed fit.",
  },
  {
    id: "shipping",
    label: "Shipping & Returns",
    content: () =>
      "Standard shipping 3–7 business days. Free shipping on orders over ₹75. Returns accepted within 30 days of delivery for unused items with tags attached.",
  },
];

export function ProductInfoTabs({ description }: { description: string }) {
  const [open, setOpen] = useState("description");

  return (
    <div className="divide-y divide-border border-y border-border">
      {tabs.map((tab) => {
        const isOpen = open === tab.id;
        return (
          <div key={tab.id}>
            <button
              type="button"
              className="flex min-h-14 w-full items-center justify-between py-4 text-left"
              onClick={() => setOpen(isOpen ? "" : tab.id)}
              aria-expanded={isOpen}
            >
              <span className="text-sm uppercase tracking-[0.12em]">
                {tab.label}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <p className="pb-5 text-sm leading-relaxed text-muted animate-fade-in">
                {tab.content(description)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
