import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mb-10 flex flex-col gap-2 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Shop by category
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl">
            Collections
          </h2>
        </div>
        <Link
          href="/collections"
          className="text-sm underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, i) => (
          <Link
            key={category.id}
            href={`/collections/${category.slug}`}
            className="group relative aspect-[3/4] overflow-hidden bg-border/40 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <h3 className="font-display text-xl text-white sm:text-2xl">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
