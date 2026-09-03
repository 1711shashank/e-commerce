import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Shipping & Returns · Kusum Concierge",
  description: "Kusum shipping timelines, UAE delivery rates, and exchange policy.",
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
        Delivery, Customs & Exchanges
      </h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted sm:text-base">
        <section>
          <h2 className="font-display text-2xl text-foreground">UAE Delivery</h2>
          <p className="mt-3">
            We offer <strong>Complimentary Standard Delivery</strong> across all Emirates in the UAE for orders exceeding <strong>AED 350</strong>. Orders below AED 350 incur a flat shipping fee of <strong>AED 25</strong>. Delivery is completed in 1–3 business days.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-foreground">Stitching & Tailoring Timelines</h2>
          <p className="mt-3">
            If you select <strong>Stitched / Ready to Wear</strong> on an unstitched design, please allow <strong>10–14 business days</strong> for expert master tailoring, lining attachment, and quality assurance before dispatch.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-foreground">GCC & International Express Shipping</h2>
          <p className="mt-3">
            We ship worldwide via DHL Express. Deliveries to Saudi Arabia, Qatar, Kuwait, Oman, Bahrain, UK, USA, and Canada typically arrive in 4–7 business days. Real-time international tracking is provided upon dispatch.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-foreground">Returns & Exchanges</h2>
          <p className="mt-3">
            Unstitched pieces in original sealed condition with all fabric pieces and embellishment packs intact may be exchanged within 7 days of receipt. Custom-stitched garments and made-to-measure bridal couture are non-returnable.
          </p>
        </section>
      </div>
    </div>
  );
}
