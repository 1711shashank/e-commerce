import { Truck, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

const icons = {
  "promo-1": Truck,
  "promo-2": RotateCcw,
  "promo-3": ShieldCheck,
  "promo-4": Sparkles,
};

export function PromoStrip({
  items,
}: {
  items: { id: string; title: string; description: string }[];
}) {
  return (
    <section className="border-y border-border/80 bg-surface">
      <div className="mx-auto grid max-w-[1536px] grid-cols-2 gap-6 px-4 py-8 sm:px-8 lg:grid-cols-4 xl:px-12 lg:py-10">
        {items.map((item) => {
          const Icon = icons[item.id as keyof typeof icons] ?? Sparkles;
          return (
            <div key={item.id} className="flex flex-col items-start gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fdf0f6]">
                <Icon className="h-5 w-5 text-[#e00075]" aria-hidden />
              </div>
              <h3 className="text-sm uppercase tracking-[0.14em] font-bold text-foreground mt-1.5">
                {item.title}
              </h3>
              <p className="text-[13px] sm:text-sm text-[#555] leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
