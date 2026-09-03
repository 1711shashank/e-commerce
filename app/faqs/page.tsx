import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "FAQs · Kusum Designer Wear",
  description: "Frequently asked questions about shopping at Kusum — The Premium Designer Wear.",
};

const faqs = [
  {
    q: "What is the difference between Unstitched and Stitched?",
    a: "Unstitched includes 3-piece raw designer fabric (shirt, dupatta, trouser, and embroidered necklines/borders) ready for your local tailor. Stitched items are tailored in-house by Kusum master tailors with complete modest lining according to our size chart.",
  },
  {
    q: "How long does custom stitching take?",
    a: "Stitched orders require 10–14 business days for precision cutting, embroidery placement, and lining attachment before dispatch via express courier.",
  },
  {
    q: "Do you offer free delivery in the UAE?",
    a: "Yes! All UAE orders exceeding AED 350 qualify for complimentary delivery. For orders below AED 350, standard shipping is AED 25.",
  },
  {
    q: "How can I track my order status?",
    a: "You can track your package and stitching progress anytime on our Track Order page (/track-order) using your order number and email or phone number.",
  },
  {
    q: "How do I choose the correct abaya length?",
    a: "Abayas are sized by length from shoulder to floor (sizes 52 through 60). Please visit our comprehensive Size Guide (/size-guide) to match your height.",
  },
  {
    q: "Do your abayas come with matching head scarves (Sheilas)?",
    a: "Yes, all Kusum abayas and festive kaftans include a coordinated matching Sheila (Hijab) crafted from soft breathable chiffon or voile.",
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
