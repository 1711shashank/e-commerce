import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Aurelia shipping timelines and return policy.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-16">
      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Shipping & Returns" },
        ]}
      />
      <h1 className="font-display text-4xl sm:text-5xl">
        Shipping & Returns
      </h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted sm:text-base">
        <section>
          <h2 className="font-display text-2xl text-foreground">Shipping</h2>
          <p className="mt-3">
            Standard delivery typically takes 3–7 business days. Orders over ₹7,199
            ship free. Express options may be offered at checkout in a future
            release.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-foreground">Returns</h2>
          <p className="mt-3">
            Unworn items with tags attached may be returned within 30 days of
            delivery. Sale items are final sale unless defective. Refunds are
            issued to the original payment method once the return is received.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-foreground">Exchanges</h2>
          <p className="mt-3">
            Prefer a different size or color? Start a return and place a new
            order, or contact support for exchange assistance.
          </p>
        </section>
      </div>
    </div>
  );
}
