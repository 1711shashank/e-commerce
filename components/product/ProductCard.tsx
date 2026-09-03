"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  formatPrice,
  getDiscountPercent,
  getEffectivePrice,
} from "@/lib/services";
import { useStore } from "@/lib/store";
import type { Product, ViewMode, CardLayoutStyle } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  view?: ViewMode;
  layoutStyle?: CardLayoutStyle;
}

export function ProductCard({
  product,
  view = "grid",
  layoutStyle = "atelier",
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const wished = isInWishlist(product.id);
  const discount = getDiscountPercent(product);
  const price = getEffectivePrice(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, product.sizes[0], product.colors[0], 1);
  };

  if (view === "list") {
    return (
      <article className="group flex gap-4 border-b border-border py-5 sm:gap-6">
        <Link
          href={`/products/${product.slug}`}
          className="relative aspect-[2/3] w-36 shrink-0 overflow-hidden rounded-xl bg-surface sm:w-44 border border-[#e6e2dc]/80"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex flex-wrap gap-2">
            {product.isNew && <Badge variant="new">New</Badge>}
            {product.isOnSale && <Badge variant="sale">Sale</Badge>}
            {!product.inStock && <Badge variant="soldout">Sold Out</Badge>}
          </div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display text-xl sm:text-2xl hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm text-muted">{product.description}</p>
          <div className="flex items-center gap-3">
            <span className="font-medium">{formatPrice(price)}</span>
            {product.discountPrice && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className="flex min-h-11 items-center gap-2 border border-border px-4 text-sm hover:border-foreground disabled:opacity-40"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{product.inStock ? "Add to cart" : "Sold out"}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="flex h-11 w-11 items-center justify-center border border-border hover:border-foreground"
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={cn("h-4 w-4", wished && "fill-sale text-sale")}
              />
            </button>
          </div>
        </div>
      </article>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     OPTION 2: THE MARIA.B MODERN RUNWAY
  ────────────────────────────────────────────────────────────── */
  if (layoutStyle === "runway") {
    return (
      <article className="group relative flex flex-col">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-[#f0ece6] border border-black/5 shadow-xs">
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </Link>

          {/* Minimalist Runway Badge */}
          <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1 pointer-events-none">
            <span className="bg-black text-white text-[8.5px] uppercase tracking-[0.2em] font-bold px-2 py-0.5">
              Runway Edit
            </span>
            {discount && (
              <span className="bg-[#e00075] text-white text-[8.5px] uppercase tracking-wider font-bold px-1.5 py-0.5">
                -{discount}%
              </span>
            )}
          </div>

          {/* Minimalist Top Wishlist */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-xs text-foreground hover:text-[#e00075] transition-transform hover:scale-110"
            aria-label="Wishlist"
          >
            <Heart className={cn("h-3.5 w-3.5", wished && "fill-[#e00075] text-[#e00075]")} />
          </button>

          {/* Maria.B Slide-Up Glass Quick-Add Bar */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-white/95 backdrop-blur-md p-3 border-t border-black/10 flex flex-col gap-2 z-20 shadow-lg">
            <div className="flex items-center justify-center gap-2 text-[9.5px] uppercase tracking-wider font-semibold text-muted">
              <span className="px-2 py-0.5 rounded bg-black/5">Unstitched</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded bg-black/5">Stitched</span>
            </div>
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className="w-full h-9 rounded-md bg-[#141414] text-white text-[10.5px] uppercase tracking-[0.16em] font-bold hover:bg-[#e00075] transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>{product.inStock ? `+ Quick Add · ${formatPrice(price)}` : "Sold Out"}</span>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-3 text-center flex flex-col gap-1">
          <p className="text-[9.5px] uppercase tracking-[0.2em] text-[#777]">
            {product.fabric ?? "Luxury Pret"}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-sans text-sm font-semibold tracking-wide text-foreground hover:text-[#e00075] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs font-bold text-foreground">
            {formatPrice(price)}
          </p>
        </div>
      </article>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     OPTION 3: THE HERITAGE TROUSSEAU SHOWCASE (Opulent Bridal)
  ────────────────────────────────────────────────────────────── */
  if (layoutStyle === "heritage") {
    return (
      <article className="group relative flex flex-col bg-[#faf7f2] p-3 rounded-2xl border border-[#e2dcce] shadow-sm hover:border-[#e00075]/40 hover:shadow-md transition-all duration-300">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white border border-[#e0d9cc]/60">
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </Link>

          {/* Gold Heritage Ribbon */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-[#141414] text-[#ffd6eb] text-[8.5px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-sm shadow-xs border border-[#e00075]/30">
              ✦ Handcrafted Zari
            </span>
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xs text-foreground hover:text-[#e00075]"
            aria-label="Wishlist"
          >
            <Heart className={cn("h-3.5 w-3.5", wished && "fill-[#e00075] text-[#e00075]")} />
          </button>

          {/* Dual Action Buttons on Hover */}
          <div className="absolute inset-x-2.5 bottom-2.5 z-20 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className="flex-1 h-9 rounded-lg bg-[#141414]/95 text-white text-[10px] uppercase tracking-wider font-bold hover:bg-[#e00075] transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Bag
            </button>
            <a
              href={`https://wa.me/971500000000?text=Hello%20Kusum%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 h-9 rounded-lg bg-[#25D366] text-white text-[10px] uppercase tracking-wider font-bold hover:bg-[#20b858] transition-colors flex items-center justify-center gap-1 shadow-md"
            >
              <span>WhatsApp 💬</span>
            </a>
          </div>
        </div>

        {/* Heritage Details */}
        <div className="mt-3.5 flex flex-col gap-1 px-1">
          <span className="text-[9px] uppercase tracking-[0.24em] text-[#e00075] font-bold">
            Royal Festive Trousseau
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold leading-snug text-foreground hover:text-[#e00075] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center justify-between pt-1 border-t border-[#e6e0d4]/80 mt-1">
            <span className="text-xs font-medium text-muted">{product.pieces ? `${product.pieces} Pieces Suit` : "Luxury Ensemble"}</span>
            <span className="text-sm font-bold text-foreground">{formatPrice(price)}</span>
          </div>
        </div>
      </article>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     OPTION 1: THE ROYAL ATELIER (Default & Recommended)
  ────────────────────────────────────────────────────────────── */
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[2/3] overflow-hidden bg-[#f3f0ec] rounded-xl border border-[#e6e2dc]/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {/* Base Image 1 with slow zoom */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700 ease-out group-hover:scale-106",
              product.images[1] ? "group-hover:opacity-0" : "",
            )}
          />

          {/* Secondary Model Pose Crossfade */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-106 group-hover:opacity-100"
            />
          )}

          {/* Luxury Diagonal Light Shine Sweep Effect on Hover */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
            <div className="shine-sweep pointer-events-none absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          </div>
        </Link>

        {/* Top Badges (New, Sale, Sold Out, Piece Count) */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.isNew && (
            <span className="bg-[#e00075] text-white text-[9px] uppercase tracking-[0.18em] font-semibold px-2 py-0.5 shadow-xs">
              New
            </span>
          )}
          {product.isOnSale && discount && (
            <span className="bg-[#141414] text-white text-[9px] uppercase tracking-[0.18em] font-semibold px-2 py-0.5 shadow-xs">
              -{discount}%
            </span>
          )}
          {product.pieces && (
            <span className="bg-white/90 backdrop-blur-xs text-[#141414] text-[9px] uppercase tracking-[0.14em] font-medium px-2 py-0.5 border border-black/10">
              {product.pieces}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-[#8b3a3a] text-white text-[9px] uppercase tracking-[0.18em] font-semibold px-2 py-0.5">
              Sold Out
            </span>
          )}
        </div>

        {/* Floating Top-Right Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 text-foreground hover:text-[#e00075]"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              wished ? "fill-[#e00075] text-[#e00075]" : "stroke-current",
            )}
          />
        </button>

        {/* User-Requested: Floating Bottom-Right Add to Cart Logo Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={!product.inStock}
          className={cn(
            "absolute bottom-3 right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[#141414] text-white shadow-lg transition-all duration-300 ease-out",
            "hover:bg-[#e00075] hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
            "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 max-sm:translate-y-0 max-sm:opacity-100",
          )}
          aria-label={product.inStock ? "Quick add to cart" : "Sold out"}
          title={product.inStock ? "Quick add to cart" : "Sold out"}
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>

      {/* Product Information */}
      <div className="mt-3 flex flex-col gap-1">
        {product.fabric && (
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#666666]">
            {product.fabric}
          </p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-base leading-snug tracking-wide text-foreground transition-colors group-hover:text-[#e00075] sm:text-lg font-medium">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-xs sm:text-sm pt-0.5">
          <span className="font-semibold text-foreground">
            {formatPrice(price)}
          </span>
          {product.discountPrice && (
            <span className="text-xs text-[#888888] line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
