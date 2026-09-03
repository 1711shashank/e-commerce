import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "About Us · The House of Kusum",
  description: "Learn about Kusum — The Premium Designer Wear specializing in luxury ethnic and Islamic modest fashion.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-16">
      <Breadcrumb
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
          Our Heritage & Craft
        </span>
        <h1 className="font-display text-4xl sm:text-5xl mt-1">About Kusum</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-muted mt-1">
          The Premium Designer Wear
        </p>
      </div>

      <div className="space-y-5 text-sm leading-relaxed text-muted sm:text-base">
        <p>
          Founded on the values of modesty, luxury, and meticulous South Asian &amp; Middle Eastern textile craftsmanship, <strong>Kusum — The Premium Designer Wear</strong> is dedicated exclusively to women&apos;s ethnic apparel and Islamic modest fashion.
        </p>
        <p>
          Inspired by the timeless elegance of heritage fashion houses like Maria.B., Kusum brings together airy pure luxury lawn, delicate embroidered chiffons, royal wedding formals, and fluid modest abayas crafted with matching sheilas.
        </p>
        <p>
          Headquartered with an atelier presence in the UAE and serving clients globally across the GCC, UK, North America, and beyond, we offer both raw unstitched 3-piece designer fabrics and bespoke master tailoring with custom sleeve linings, modesty slips, and handcrafted finishes.
        </p>
      </div>
    </div>
  );
}
