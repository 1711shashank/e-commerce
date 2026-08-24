import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about shopping at Aurelia.",
};

const faqs = [
  {
    q: "How do I choose the right size?",
    a: "Each product lists available sizes. When between sizes, we recommend sizing up for a relaxed fit. Unstitched pieces include fabric lengths for your tailor.",
  },
  {
    q: "Do you ship internationally?",
    a: "This demo storefront focuses on the shopping experience. International shipping can be enabled when a real fulfillment backend is connected.",
  },
  {
    q: "How does the wishlist work?",
    a: "Saved items are stored in your browser via localStorage so they persist between visits on the same device.",
  },
  {
    q: "Is checkout real?",
    a: "No — checkout is a static UI for this phase. No payments are processed.",
  },
];

export default function FaqsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-16">
      <Breadcrumb
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
      />
      <h1 className="font-display text-4xl sm:text-5xl">FAQs</h1>
      <dl className="mt-10 divide-y divide-border border-y border-border">
        {faqs.map((item) => (
          <div key={item.q} className="py-6">
            <dt className="font-display text-xl text-foreground sm:text-2xl">
              {item.q}
            </dt>
            <dd className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
