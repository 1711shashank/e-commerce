"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/services";
import { useStore } from "@/lib/store";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
  } = useStore();

  const subtotal = cartSubtotal();
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Drawer open={isCartOpen} onClose={closeCart} title="Your Shopping Bag" side="right">
      {cart.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <p className="font-display text-2xl">Your bag is empty</p>
          <p className="text-xs text-muted max-w-xs">
            Discover our luxury unstitched lawn, modest abayas, and festive pret collections.
          </p>
          <Button onClick={closeCart} className="mt-2 text-xs uppercase tracking-wider">
            <Link href="/collections/unstitched">Explore Collections</Link>
          </Button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          {/* Free Shipping Progress Indicator */}
          <div className="border-b border-border bg-surface/70 px-5 py-3 text-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <Truck className="h-3.5 w-3.5 text-accent shrink-0" />
              {remainingForFreeShipping === 0 ? (
                <span className="font-medium text-foreground">
                  🎉 You have qualified for <strong>Complimentary UAE Delivery</strong>!
                </span>
              ) : (
                <span>
                  Add <strong>{formatPrice(remainingForFreeShipping)}</strong> more for Complimentary UAE Delivery
                </span>
              )}
            </div>
            <div className="h-1.5 w-full overflow-hidden bg-border rounded-full">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          <ul className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {cart.map((item) => (
              <li
                key={`${item.productId}-${item.size}-${item.color}-${item.stitchingType ?? "std"}`}
                className="flex gap-4 border-b border-border/40 pb-4"
              >
                <Link
                  href={`/products/${item.slug}`}
                  onClick={closeCart}
                  className="relative h-28 w-20 shrink-0 overflow-hidden bg-border/40"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="font-display text-base leading-tight hover:text-accent line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.productId, item.size, item.color, item.stitchingType)
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center text-muted hover:text-sale transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                    <span>{item.color}</span>
                    <span>·</span>
                    <span>{item.size}</span>
                    {item.stitchingType && (
                      <span className="border border-border bg-surface px-1.5 py-0.2 text-[10px] uppercase tracking-wider text-foreground font-medium">
                        {item.stitchingType}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {formatPrice(item.price)}
                  </p>
                  <div className="mt-auto inline-flex items-center border border-border w-fit">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center hover:bg-border/40"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity - 1,
                          item.stitchingType,
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-7 text-center text-xs tabular-nums font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center hover:bg-border/40"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity + 1,
                          item.stitchingType,
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-5 py-5 space-y-3 bg-surface">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold text-foreground text-base">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-[11px] text-muted leading-tight">
              Duties, customs and express shipping calculated at checkout.
            </p>
            <Button className="w-full text-xs uppercase tracking-wider min-h-11" onClick={closeCart}>
              <Link href="/checkout" className="w-full text-center">
                Proceed to Checkout
              </Link>
            </Button>
            <Button variant="outline" className="w-full text-xs uppercase tracking-wider min-h-11" onClick={closeCart}>
              <Link href="/cart" className="w-full text-center">
                View Bag & Edit
              </Link>
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}

