import type { Banner } from "@/lib/types";

export const banners: Banner[] = [
  {
    id: "banner-1",
    title: "Spring Lawn Collection",
    subtitle: "Light fabrics, bold prints — new season arrivals",
    ctaLabel: "Shop New Arrivals",
    ctaHref: "/collections/women",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80",
  },
  {
    id: "banner-2",
    title: "Mid-Season Sale",
    subtitle: "Up to 40% off selected ready-to-wear",
    ctaLabel: "Shop Sale",
    ctaHref: "/collections/sale",
    image:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1600&q=80",
  },
  {
    id: "banner-3",
    title: "Menswear Essentials",
    subtitle: "Tailored shirts and everyday kurtas",
    ctaLabel: "Explore Men",
    ctaHref: "/collections/men",
    image:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1600&q=80",
  },
];

export const promoStrips = [
  {
    id: "promo-1",
    title: "Free Shipping",
    description: "On orders over ₹7,199",
  },
  {
    id: "promo-2",
    title: "Easy Returns",
    description: "30-day hassle-free returns",
  },
  {
    id: "promo-3",
    title: "Secure Checkout",
    description: "Encrypted payment processing",
  },
  {
    id: "promo-4",
    title: "New Drops Weekly",
    description: "Fresh styles every Friday",
  },
];
