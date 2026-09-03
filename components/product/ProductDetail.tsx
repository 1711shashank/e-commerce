"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
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

  const defaultStitching = product.stitchingOptions?.[0] ?? "stitched";
  const [stitching, setStitching] = useState<"unstitched" | "stitched">(defaultStitching);

  const initialSize =
    defaultStitching === "unstitched"
      ? "Unstitched"
      : product.sizes.find((s) => s !== "Unstitched") ?? product.sizes[0];

  const [size, setSize] = useState(initialSize);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const wished = isInWishlist(product.id);
  const discount = getDiscountPercent(product);
  const price = getEffectivePrice(product);

  const handleStitchingChange = (type: "unstitched" | "stitched") => {
    setStitching(type);
    if (type === "unstitched") {
      setSize("Unstitched");
    } else {
      const standardSize = product.sizes.find((s) => s !== "Unstitched") ?? "M";
      setSize(standardSize);
    }
  };

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
            <div className="flex flex-wrap items-center gap-2">
              {product.isNew && <Badge variant="new">New Season</Badge>}
              {product.isOnSale && <Badge variant="sale">Sale</Badge>}
              {!product.inStock && <Badge variant="soldout">Sold Out</Badge>}
              {product.pieces && (
                <span className="border border-border bg-surface px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-muted">
                  {product.pieces === "abaya-set" ? "Abaya + Sheila Set" : `${product.pieces}-Piece`}
                </span>
              )}
            </div>

            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {product.name}
              </h1>
              {product.subCategory && (
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                  {product.subCategory.replace(/-/g, " ")}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-medium tracking-tight text-foreground">
                {formatPrice(price)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-muted line-through text-base">
                    {formatPrice(product.price)}
                  </span>
                  {discount && (
                    <span className="text-xs font-semibold text-sale bg-sale/10 px-2 py-0.5">
                      Save {discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            <p className="max-w-lg text-xs leading-relaxed text-muted sm:text-sm">
              {product.description}
            </p>

            {product.fabric && (
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted border-t border-b border-border py-2.5">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Fabric Composition: <strong className="text-foreground">{product.fabric}</strong></span>
              </div>
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
              stitchingOptions={product.stitchingOptions}
              selectedStitching={stitching}
              onStitchingChange={handleStitchingChange}
            />

            <div className="flex flex-col gap-3 sm:flex-row pt-2">
              <Button
                className="flex-1 min-h-12 text-xs uppercase tracking-[0.16em]"
                disabled={!product.inStock}
                onClick={() =>
                  addToCart(product, size, color, qty, {
                    stitchingType: stitching,
                  })
                }
              >
                Add to Cart · {formatPrice(price * qty)}
              </Button>
              <Button
                variant="secondary"
                className="flex-1 min-h-12 text-xs uppercase tracking-[0.16em]"
                disabled={!product.inStock}
                onClick={() => {
                  addToCart(product, size, color, qty, {
                    openCart: false,
                    stitchingType: stitching,
                  });
                  router.push("/checkout");
                }}
              >
                Instant Checkout
              </Button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="flex h-12 w-12 items-center justify-center border border-border hover:border-foreground transition-colors sm:h-auto sm:min-h-12"
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={cn("h-5 w-5", wished && "fill-sale text-sale")}
                />
              </button>
            </div>

            <ProductInfoTabs product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <FeaturedProducts
          title="Complete The Look"
          subtitle="Matching & related ensembles"
          products={related}
          href={`/collections/${product.category}`}
        />
      )}
    </>
  );
}

