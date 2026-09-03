import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-[1536px] px-4 py-10 sm:px-8 lg:py-14 xl:px-12">
      <div className="mb-8 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#e00075]" />
            <p className="text-xs uppercase tracking-[0.25em] text-[#e00075] font-bold">
              Signature Ensembles · Festive & Pret
            </p>
          </div>
          <h2 className="mt-1.5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141414]">
            Shop By Collection
          </h2>
        </div>
        <Link
          href="/collections"
          className="text-xs uppercase tracking-[0.18em] font-semibold text-foreground hover:text-[#e00075] transition-colors underline-offset-4 hover:underline"
        >
          View All Collections →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, i) => (
          <Link
            key={category.id}
            href={`/collections/${category.slug}`}
            className="group relative aspect-[2/3] overflow-hidden bg-[#161616] rounded-xl animate-fade-up shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-black/10"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Smooth Zoom Image */}
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-[#e00075]/40 transition-colors duration-300" />

            {/* Floating Top Tag */}
            <div className="absolute top-3 left-3">
              <span className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-white/95 bg-black/50 backdrop-blur-md border border-white/20">
                Kusum Couture
              </span>
            </div>

            {/* Content & Hover Slide-Up CTA */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end">
              <h3 className="font-display text-2xl text-white sm:text-3xl font-bold tracking-normal drop-shadow-sm group-hover:text-[#ffd6eb] transition-colors">
                {category.name}
              </h3>

              {category.description && (
                <p className="mt-1.5 line-clamp-1 text-xs sm:text-sm text-white/85 font-normal">
                  {category.description}
                </p>
              )}

              {/* Animated Slide-Up Button */}
              <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#ffd6eb]">
                  Explore Line
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e00075] text-white text-xs font-bold shadow-xs">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
