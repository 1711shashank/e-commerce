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
import type { Product, ViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  view?: ViewMode;
}

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
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
          className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden bg-border/40 sm:w-40"
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
              Add to Cart
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

  return (
    <article className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-border/30">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isNew && <Badge variant="new">New</Badge>}
            {product.isOnSale && discount && (
              <Badge variant="sale">-{discount}%</Badge>
            )}
            {!product.inStock && <Badge variant="soldout">Sold Out</Badge>}
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-display text-lg leading-snug tracking-wide sm:text-xl">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span>{formatPrice(price)}</span>
            {product.discountPrice && (
              <span className="text-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="flex h-11 w-11 items-center justify-center bg-surface/95 shadow-sm backdrop-blur hover:bg-surface"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-sale text-sale")} />
        </button>
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={!product.inStock}
          className="flex h-11 w-11 items-center justify-center bg-surface/95 shadow-sm backdrop-blur hover:bg-surface disabled:opacity-40"
          aria-label="Quick add to cart"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
