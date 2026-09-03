"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductInfoTabs({ product }: { product: Product }) {
  const [open, setOpen] = useState("description");

  const tabs = [
    {
      id: "description",
      label: "Description & Details",
      render: () => (
        <div className="space-y-3 text-xs leading-relaxed text-muted sm:text-sm">
          <p>{product.description}</p>
          {product.embellishments && product.embellishments.length > 0 && (
            <div className="pt-2">
              <span className="font-medium text-foreground block mb-1.5">
                Embellishments & Crafts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.embellishments.map((emb) => (
                  <span
                    key={emb}
                    className="inline-flex items-center gap-1 border border-border px-2 py-0.5 text-[11px] text-foreground"
                  >
                    <CheckCircle2 className="h-3 w-3 text-accent" />
                    {emb}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "fabric",
      label: "Fabric Breakdown & Inclusions",
      render: () => (
        <div className="space-y-2.5 text-xs sm:text-sm">
          {product.pieces && (
            <p className="font-medium text-foreground mb-2">
              {product.pieces === "abaya-set"
                ? "Full Modest Set (Abaya + Matching Sheila)"
                : `${product.pieces} Piece Complete Ensemble`}
            </p>
          )}
          {product.fabricBreakdown ? (
            <dl className="grid gap-2 text-muted">
              {product.fabricBreakdown.shirt && (
                <div className="border-b border-border/50 pb-1.5">
                  <dt className="font-medium text-foreground">Shirt / Kameez:</dt>
                  <dd className="mt-0.5">{product.fabricBreakdown.shirt}</dd>
                </div>
              )}
              {product.fabricBreakdown.dupatta && (
                <div className="border-b border-border/50 pb-1.5">
                  <dt className="font-medium text-foreground">Dupatta / Sheila:</dt>
                  <dd className="mt-0.5">{product.fabricBreakdown.dupatta}</dd>
                </div>
              )}
              {product.fabricBreakdown.trouser && (
                <div className="border-b border-border/50 pb-1.5">
                  <dt className="font-medium text-foreground">Trouser / Bottom:</dt>
                  <dd className="mt-0.5">{product.fabricBreakdown.trouser}</dd>
                </div>
              )}
              {product.fabricBreakdown.abaya && (
                <div className="border-b border-border/50 pb-1.5">
                  <dt className="font-medium text-foreground">Abaya Cut & Silhouette:</dt>
                  <dd className="mt-0.5">{product.fabricBreakdown.abaya}</dd>
                </div>
              )}
              {product.fabricBreakdown.slip && (
                <div className="border-b border-border/50 pb-1.5">
                  <dt className="font-medium text-foreground">Inner Slip:</dt>
                  <dd className="mt-0.5">{product.fabricBreakdown.slip}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-muted">
              Premium {product.fabric ?? "designer"} fabric with guaranteed color fastness and shrink resistance. Dry clean recommended for embroidered items.
            </p>
          )}
        </div>
      ),
    },
    {
      id: "sizing",
      label: "Sizing & Custom Stitching",
      render: () => (
        <div className="space-y-2 text-xs leading-relaxed text-muted sm:text-sm">
          <p>
            All stitched items are tailored in-house according to Kusum standard modest sizing specifications. For unstitched fabrics, sufficient yardage is provided for up to 2XL custom tailoring.
          </p>
          <div className="pt-1">
            <Link
              href="/size-guide"
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              View Full Size Chart & Measuring Instructions →
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: "delivery",
      label: "Delivery & Returns",
      render: () => (
        <div className="space-y-2 text-xs leading-relaxed text-muted sm:text-sm">
          <p>
            <strong>UAE Delivery:</strong> 1–3 business days. Complimentary on orders over AED 350 (standard fee AED 25 for smaller orders).
          </p>
          <p>
            <strong>GCC & Worldwide:</strong> 4–7 business days via DHL Express.
          </p>
          <p>
            <strong>Stitching Timeline:</strong> Stitched orders require 10–14 business days for master tailoring and quality inspection before dispatch.
          </p>
          <p className="text-muted/80 text-[11px] pt-1">
            *Unstitched items may be exchanged within 7 days. Stitched or altered pieces are final sale.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="divide-y divide-border border-y border-border">
      {tabs.map((tab) => {
        const isOpen = open === tab.id;
        return (
          <div key={tab.id}>
            <button
              type="button"
              className="flex min-h-12 w-full items-center justify-between py-3.5 text-left transition-colors hover:text-accent"
              onClick={() => setOpen(isOpen ? "" : tab.id)}
              aria-expanded={isOpen}
            >
              <span className="text-xs uppercase tracking-[0.14em] font-medium">
                {tab.label}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform text-muted",
                  isOpen && "rotate-180 text-foreground",
                )}
              />
            </button>
            {isOpen && (
              <div className="pb-5 pt-1 animate-fade-in">
                {tab.render()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

