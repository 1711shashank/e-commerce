"use client";

import Link from "next/link";
import { useState } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { formatPrice, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/services";
import { useStore } from "@/lib/store";

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useStore();
  const [placed, setPlaced] = useState(false);
  const subtotal = cartSubtotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shipping;

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center sm:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">
          Order confirmed · KB-84192
        </p>
        <h1 className="mt-3 font-display text-4xl">Thank you for your order</h1>
        <p className="mt-4 text-sm text-muted">
          Your order has been received at the Kusum atelier. We will prepare your garments with exquisite care.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button>
            <Link href="/track-order">Track Your Order</Link>
          </Button>
          <Button variant="outline">
            <Link href="/collections">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      <h1 className="font-display text-3xl sm:text-4xl">Checkout</h1>

      {cart.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted">Nothing to checkout.</p>
          <Button className="mt-6">
            <Link href="/collections">Shop now</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              clearCart();
              setPlaced(true);
            }}
          >
            <fieldset className="space-y-4">
              <legend className="font-display text-2xl">Contact</legend>
              <input
                required
                type="email"
                placeholder="Email"
                className="min-h-12 w-full border border-border bg-surface px-4 text-sm"
              />
            </fieldset>
            <fieldset className="space-y-4">
              <legend className="font-display text-2xl">Shipping</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="First name"
                  className="min-h-12 border border-border bg-surface px-4 text-sm"
                />
                <input
                  required
                  placeholder="Last name"
                  className="min-h-12 border border-border bg-surface px-4 text-sm"
                />
              </div>
              <input
                required
                placeholder="Address"
                className="min-h-12 w-full border border-border bg-surface px-4 text-sm"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  required
                  placeholder="City"
                  className="min-h-12 border border-border bg-surface px-4 text-sm"
                />
                <input
                  required
                  placeholder="State"
                  className="min-h-12 border border-border bg-surface px-4 text-sm"
                />
                <input
                  required
                  placeholder="ZIP"
                  className="min-h-12 border border-border bg-surface px-4 text-sm"
                />
              </div>
            </fieldset>
            <fieldset className="space-y-4">
              <legend className="font-display text-2xl">Payment</legend>
              <p className="text-sm text-muted">
                Demo only — enter any details to place a mock order.
              </p>
              <input
                required
                placeholder="Card number"
                className="min-h-12 w-full border border-border bg-surface px-4 text-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="MM / YY"
                  className="min-h-12 border border-border bg-surface px-4 text-sm"
                />
                <input
                  required
                  placeholder="CVC"
                  className="min-h-12 border border-border bg-surface px-4 text-sm"
                />
              </div>
            </fieldset>
            <Button type="submit" className="w-full">
              Place order · {formatPrice(total)}
            </Button>
          </form>

          <aside className="h-fit border border-border bg-surface p-6">
            <h2 className="font-display text-2xl">Order summary</h2>
            <ul className="mt-6 space-y-4">
              {cart.map((item) => (
                <li
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                    <span className="block text-xs text-muted">
                      {item.color} / {item.size}
                    </span>
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
