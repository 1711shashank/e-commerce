"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfoTabs } from "@/components/product/ProductInfoTabs";
import { VariantSelector } from "@/components/product/VariantSelector";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getMaxAddQuantity } from "@/lib/cart-stock";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import {
  formatPrice,
  getDiscountPercent,
  getEffectivePrice,
} from "@/lib/services";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import {
  colorsWithStock,
  getImagesForColor,
  getSizeStockMap,
  getVariantStock,
  productHasStock,
  sizesWithStockForColor,
} from "@/lib/variants";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";
import { cn } from "@/lib/utils";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist);
  const authHydrated = usePersistHydrated(useCustomerAuthStore.persist);
  const customerAccess = useCustomerAuthStore((s) => s.access);
  const customerUser = useCustomerAuthStore((s) => s.user);

  const stockedColors = useMemo(() => colorsWithStock(product), [product]);
  const initialColor = stockedColors[0] ?? product.colors[0] ?? "";
  const [color, setColor] = useState(initialColor);

  const stockedSizes = useMemo(
    () => sizesWithStockForColor(product, color),
    [product, color],
  );
  const initialSize = stockedSizes[0] ?? product.sizes[0] ?? "";
  const [size, setSize] = useState(initialSize);
  const [qty, setQty] = useState(1);
  const [cartError, setCartError] = useState<string | null>(null);

  const variantStock = getVariantStock(product, color, size);
  const maxAddQty = getMaxAddQuantity(product, color, size, cart);
  const canPurchase = productHasStock(product) && maxAddQty > 0;
  const wished = isInWishlist(product.id);
  const discount = getDiscountPercent(product);
  const price = getEffectivePrice(product);

  const disabledColors = product.colors.filter((c) => !stockedColors.includes(c));
  const disabledSizes = product.sizes.filter((s) => !stockedSizes.includes(s));
  const sizeStock = useMemo(
    () => getSizeStockMap(product, color),
    [product, color],
  );

  const displayImages = useMemo(
    () => getImagesForColor(product, color),
    [product, color],
  );

  useEffect(() => {
    const sizes = sizesWithStockForColor(product, color);
    if (!sizes.includes(size)) {
      setSize(sizes[0] ?? product.sizes[0] ?? "");
      setQty(1);
    }
  }, [color, product, size]);

  useEffect(() => {
    setQty((current) => {
      if (maxAddQty <= 0) return 1;
      return Math.min(current, maxAddQty);
    });
  }, [maxAddQty, color, size]);

  const handleAddToCart = (openCart = true): boolean => {
    setCartError(null);
    const ok = addToCart(product, size, color, qty, { openCart });
    if (!ok) {
      setCartError("Not enough stock for this color and size.");
      return false;
    }
    setQty(1);
    return true;
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
          <ProductGallery
            key={color}
            images={displayImages}
            name={product.name}
          />

          <div className="space-y-6 lg:pt-2">
            <div className="flex flex-wrap gap-2">
              {product.isNew && <Badge variant="new">New</Badge>}
              {product.isOnSale && <Badge variant="sale">Sale</Badge>}
              {!productHasStock(product) && (
                <Badge variant="soldout">Sold Out</Badge>
              )}
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
              onSizeChange={(next) => {
                setSize(next);
                setQty(1);
                setCartError(null);
              }}
              onColorChange={(next) => {
                setColor(next);
                setQty(1);
                setCartError(null);
              }}
              onQuantityChange={setQty}
              maxQuantity={maxAddQty}
              disabledColors={disabledColors}
              disabledSizes={disabledSizes}
              sizeStock={sizeStock}
            />

            {cartError && (
              <p className="text-sm text-sale" role="alert">
                {cartError}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                disabled={!canPurchase}
                onClick={() => handleAddToCart(true)}
              >
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                disabled={!canPurchase}
                onClick={() => {
                  if (!handleAddToCart(false)) return;
                  const isCustomer = Boolean(
                    authHydrated &&
                      customerAccess &&
                      customerUser?.role === "customer",
                  );
                  if (!isCustomer) {
                    router.push(
                      `/login?next=${encodeURIComponent("/checkout")}`,
                    );
                    return;
                  }
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
