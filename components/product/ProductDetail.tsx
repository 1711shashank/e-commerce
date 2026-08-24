"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfoTabs } from "@/components/product/ProductInfoTabs";
import { VariantSelector } from "@/components/product/VariantSelector";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  formatPrice,
  getDiscountPercent,
  getEffectivePrice,
} from "@/lib/services";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const wished = isInWishlist(product.id);
  const discount = getDiscountPercent(product);
  const price = getEffectivePrice(product);

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <Breadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            {
              label: product.category.replace(/-/g, " "),
              href: `/collections/${product.category}`,
            },
            { label: product.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} name={product.name} />

          <div className="space-y-6 lg:pt-2">
            <div className="flex flex-wrap gap-2">
              {product.isNew && <Badge variant="new">New</Badge>}
              {product.isOnSale && <Badge variant="sale">Sale</Badge>}
              {!product.inStock && <Badge variant="soldout">Sold Out</Badge>}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-xl">{formatPrice(price)}</span>
              {product.discountPrice && (
                <>
                  <span className="text-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                  {discount && (
                    <span className="text-sm text-sale">-{discount}%</span>
                  )}
                </>
              )}
            </div>

            <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">
              {product.description}
            </p>

            {product.fabric && (
              <p className="text-xs uppercase tracking-[0.15em] text-muted">
                Fabric — {product.fabric}
              </p>
            )}

            <VariantSelector
              sizes={product.sizes}
              colors={product.colors}
              selectedSize={size}
              selectedColor={color}
              quantity={qty}
              onSizeChange={setSize}
              onColorChange={setColor}
              onQuantityChange={setQty}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                disabled={!product.inStock}
                onClick={() => addToCart(product, size, color, qty)}
              >
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                disabled={!product.inStock}
                onClick={() => {
                  addToCart(product, size, color, qty, { openCart: false });
                  router.push("/checkout");
                }}
              >
                Buy Now
              </Button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="flex h-11 w-11 items-center justify-center border border-border hover:border-foreground sm:h-auto sm:min-h-11"
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={cn("h-5 w-5", wished && "fill-sale text-sale")}
                />
              </button>
            </div>

            <ProductInfoTabs description={product.description} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <FeaturedProducts
          title="You may also like"
          subtitle="Related"
          products={related}
          href={`/collections/${product.category}`}
        />
      )}
    </>
  );
}
