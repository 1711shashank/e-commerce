import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getParentCategories } from "@/lib/services";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse all Aurelia clothing collections.",
};

export default function CollectionsPage() {
  const categories = getParentCategories();

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <Breadcrumb
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "Collections" }]}
      />
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl">
        Collections
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
        Explore our full catalog — from lawn and unstitched to ready-to-wear and
        menswear.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/collections/${category.slug}`}
            className="group relative aspect-[3/4] overflow-hidden bg-border/40"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
              <h2 className="font-display text-2xl text-white sm:text-3xl">
                {category.name}
              </h2>
              {category.description && (
                <p className="mt-1 text-sm text-white/80">
                  {category.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
