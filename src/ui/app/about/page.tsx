import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Aurelia — contemporary clothing with timeless ease.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-16">
      <Breadcrumb
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <h1 className="font-display text-4xl sm:text-5xl">About Aurelia</h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted sm:text-base">
        <p>
          Aurelia is a contemporary clothing house inspired by the ease of
          everyday dressing and the craft of seasonal collections — lawn,
          ready-to-wear, menswear, and pieces made for celebration.
        </p>
        <p>
          We design with soft neutrals, thoughtful silhouettes, and fabrics that
          feel good to wear. Our collections blend modern cuts with familiar
          wardrobe staples so you can build looks that last beyond a single
          season.
        </p>
        <p>
          This storefront is powered by static sample data for now, structured
          so a real catalog and checkout can plug in later without rewriting the
          shopping experience.
        </p>
      </div>
    </div>
  );
}
