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
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-10 sm:px-8 lg:grid-cols-4 lg:px-10 lg:py-12">
        {items.map((item) => {
          const Icon = icons[item.id as keyof typeof icons] ?? Sparkles;
          return (
            <div key={item.id} className="flex flex-col items-start gap-2">
              <Icon className="h-5 w-5 text-accent" aria-hidden />
              <h3 className="text-sm font-medium tracking-wide">{item.title}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
