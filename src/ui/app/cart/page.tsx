"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import {
  findProductInCatalog,
  getMaxLineQuantity,
} from "@/lib/cart-stock";
import { formatPrice } from "@/lib/services";
import { useStore } from "@/lib/store";
import { useProductCatalog } from "@/lib/use-product-catalog";
import { productHasStock } from "@/lib/variants";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartSubtotal, reconcileCart } =
    useStore();
  const { catalog, loaded } = useProductCatalog();
  const subtotal = cartSubtotal();

  useEffect(() => {
    if (loaded) reconcileCart(catalog);
  }, [catalog, loaded, reconcileCart]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <Breadcrumb
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "Cart" }]}
      />
      <h1 className="font-display text-3xl sm:text-4xl">Shopping Bag</h1>

      {cart.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted">Your bag is empty.</p>
          <Button className="mt-6">
            <Link href="/collections">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-border border-y border-border">
            {cart.map((item) => {
              const product = findProductInCatalog(catalog, item);
              const maxQty =
                product != null
                  ? getMaxLineQuantity(product, item.color, item.size)
                  : item.quantity;
              const unavailable = !product || !productHasStock(product) || maxQty <= 0;

              return (
                <li
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-4 py-6 sm:gap-6"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative h-32 w-24 shrink-0 overflow-hidden bg-border/40 sm:h-40 sm:w-28"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-display text-xl hover:text-accent"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted">
                          {item.color} / {item.size}
                        </p>
                        {unavailable ? (
                          <p className="mt-1 text-xs text-sale">
                            No longer available
                          </p>
                        ) : maxQty <= 10 ? (
                          <p className="mt-1 text-xs text-muted">
                            {maxQty} left in stock
                          </p>
                        ) : null}
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="inline-flex items-center border border-border">
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center disabled:opacity-40"
                          disabled={unavailable}
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity - 1,
                              product,
                            )
                          }
                          aria-label="Decrease"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center disabled:opacity-40"
                          disabled={
                            unavailable || item.quantity >= maxQty
                          }
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity + 1,
                              product,
                            )
                          }
                          aria-label="Increase"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.productId, item.size, item.color)
                        }
                        className="flex h-11 items-center gap-2 px-2 text-sm text-muted hover:text-sale"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit border border-border bg-surface p-6">
            <h2 className="font-display text-2xl">Order summary</h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
                <span>Estimated total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
            <Button className="mt-6 w-full">
              <Link href="/checkout" className="w-full text-center">
                Checkout
              </Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
