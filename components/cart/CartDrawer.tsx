"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { formatPrice } from "@/lib/services";
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

  return (
    <Drawer open={isCartOpen} onClose={closeCart} title="Your Bag" side="right">
      {cart.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <p className="font-display text-2xl">Your bag is empty</p>
          <p className="text-sm text-muted">
            Discover new arrivals and fill it with pieces you love.
          </p>
          <Button onClick={closeCart}>
            <Link href="/collections">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {cart.map((item) => (
              <li
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-4"
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
                      className="font-display text-lg leading-tight hover:text-accent"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.productId, item.size, item.color)
                      }
                      className="flex h-11 w-11 shrink-0 items-center justify-center text-muted hover:text-sale"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted">
                    {item.color} / {item.size}
                  </p>
                  <p className="text-sm">{formatPrice(item.price)}</p>
                  <div className="mt-auto inline-flex items-center border border-border">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity - 1,
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-8 text-center text-sm tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity + 1,
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-5 py-5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-muted">
              Shipping and taxes calculated at checkout.
            </p>
            <Button className="w-full" onClick={closeCart}>
              <Link href="/checkout" className="w-full text-center">
                Proceed to Checkout
              </Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={closeCart}>
              <Link href="/cart" className="w-full text-center">
                View Cart
              </Link>
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
