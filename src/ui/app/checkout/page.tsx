"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RequireCustomerAuth } from "@/components/auth/RequireCustomerAuth";
import {
  CheckoutShipping,
  validateShippingFields,
  type ShippingFields,
} from "@/components/checkout/CheckoutShipping";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { validateCartAgainstCatalog } from "@/lib/cart-stock";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { formatPrice } from "@/lib/services";
import { useStore } from "@/lib/store";
import { useProductCatalog } from "@/lib/use-product-catalog";

function CheckoutContent() {
  const { cart, cartSubtotal, clearCart, reconcileCart } = useStore();
  const user = useCustomerAuthStore((s) => s.user);
  const { catalog, loaded } = useProductCatalog();
  const [placed, setPlaced] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingFields>({
    fullName: "",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const subtotal = cartSubtotal();
  const shippingCost = subtotal >= 7199 || subtotal === 0 ? 0 : 799;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (loaded) reconcileCart(catalog);
  }, [catalog, loaded, reconcileCart]);

  const issues = loaded ? validateCartAgainstCatalog(cart, catalog) : [];
  const hasIssues = issues.length > 0;

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center sm:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Order confirmed
        </p>
        <h1 className="mt-3 font-display text-4xl">Thank you</h1>
        <p className="mt-4 text-sm text-muted">
          This is a demo checkout — no payment was processed. Your bag has been
          cleared.
        </p>
        <Button className="mt-8">
          <Link href="/collections">Continue shopping</Link>
        </Button>
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
              setCheckoutError(null);

              if (!loaded) {
                setCheckoutError("Still loading product availability. Try again.");
                return;
              }

              reconcileCart(catalog);
              const nextIssues = validateCartAgainstCatalog(
                useStore.getState().cart,
                catalog,
              );
              if (nextIssues.length > 0) {
                setCheckoutError(
                  "Some items in your bag are unavailable or exceed stock. Update your bag and try again.",
                );
                return;
              }

              const shippingError = validateShippingFields(shippingAddress);
              if (shippingError) {
                setCheckoutError(shippingError);
                return;
              }

              clearCart();
              setPlaced(true);
            }}
          >
            {hasIssues && (
              <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
                Some items are unavailable or exceed stock. Your bag was updated
                — review quantities before placing the order.
              </p>
            )}
            {checkoutError && (
              <p className="text-sm text-sale" role="alert">
                {checkoutError}
              </p>
            )}
            <fieldset className="space-y-4">
              <legend className="font-display text-2xl">Contact</legend>
              <input
                required
                type="email"
                placeholder="Email"
                defaultValue={user?.email ?? ""}
                className="min-h-12 w-full border border-border bg-surface px-4 text-sm"
              />
            </fieldset>
            <CheckoutShipping value={shippingAddress} onChange={setShippingAddress} />
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
            <Button
              type="submit"
              className="w-full"
              disabled={!loaded || hasIssues}
            >
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
                <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
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

export default function CheckoutPage() {
  return (
    <RequireCustomerAuth>
      <CheckoutContent />
    </RequireCustomerAuth>
  );
}
