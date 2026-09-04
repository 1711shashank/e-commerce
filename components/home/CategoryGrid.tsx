import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryBadges: Record<string, string> = {
  unstitched: "✦ Flagship Lawn",
  "ready-to-wear": "✦ Daily & Festive Pret",
  "luxury-formals": "✦ Shehnai Wedding",
  "abayas-kaftans": "✦ Modest Silk Edit",
  bridal: "✦ Royal Atelier",
  "mommy-and-me": "✦ Junior Festive",
  sale: "✦ Special Offers",
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-[1536px] px-4 py-10 sm:px-8 lg:py-14 xl:px-12">
      <div className="mb-6 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
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

      <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, i) => {
          // On mobile (< sm), the first flagship category (Unstitched) spans 2 columns
          // creating a stunning hero banner followed by 3 perfectly balanced pairs (eliminates the awkward 7th lone card)
          const isHero = i === 0;
          const badge = categoryBadges[category.slug] ?? "✦ Kusum Couture";

          return (
            <Link
              key={category.id}
              href={`/collections/${category.slug}`}
              className={cn(
                "group relative overflow-hidden bg-[#161616] rounded-xl animate-fade-up shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-black/10",
                isHero
                  ? "col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-[2/3]"
                  : "aspect-[2/3]",
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Smooth Zoom Image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/95" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-[#e00075]/40 transition-colors duration-300" />

              {/* Floating Top Tag */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8.5px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] font-bold text-white/95 bg-black/60 backdrop-blur-md border border-white/20 rounded-xs">
                  {badge}
                </span>
              </div>

              {/* Content & Touch-Accessible Action Prompt */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 flex flex-col justify-end">
                <h3
                  className={cn(
                    "font-display text-white font-bold drop-shadow-sm group-hover:text-[#ffd6eb] transition-colors leading-tight",
                    isHero
                      ? "text-2xl sm:text-3xl"
                      : "text-base sm:text-2xl lg:text-3xl",
                  )}
                >
                  {category.name}
                </h3>

                {category.description && (
                  <p
                    className={cn(
                      "mt-1 text-white/85 font-normal leading-relaxed line-clamp-1",
                      isHero
                        ? "text-xs sm:text-sm"
                        : "text-[11px] sm:text-xs hidden xs:block",
                    )}
                  >
                    {category.description}
                  </p>
                )}

                {/* Explore Action Prompt (Visible on touch, animated on desktop) */}
                <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-white/20 pt-2 sm:pt-3 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-bold text-[#ffd6eb]">
                  <span>Explore Line</span>
                  <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#e00075] text-white text-[11px] sm:text-xs font-bold shadow-xs transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
