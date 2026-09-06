import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "cat-unstitched",
    name: "Luxury Designer Lawn",
    slug: "unstitched",
    image: "/kusum-velvet-areej.jpg",
    description: "Original 3-piece embroidered lawn, pure silk dupattas & Areej International luxury suits",
    parentId: null,
  },
  {
    id: "cat-ready-to-wear",
    name: "Festive Pret & Anarkalis",
    slug: "ready-to-wear",
    image: "/kusum-ivory-peshwas.jpg",
    description: "Tailored festive kurtas, readymade luxury suits & celebratory anarkalis",
    parentId: null,
  },
  {
    id: "cat-luxury-formals",
    name: "Farshi Shararas & Ghararas",
    slug: "luxury-formals",
    image: "/kusum-bridal-purple.jpg",
    description: "Royal Nizami ghararas, heavy zardozi peplum shararas and celebratory wedding wear",
    parentId: null,
  },
  {
    id: "cat-abayas",
    name: "Modest Abayas & Kaftans",
    slug: "abayas-kaftans",
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
    description: "Flowing royal crepe abayas, kimono cuts and festive kaftans with matching sheilas",
    parentId: null,
  },
  {
    id: "cat-bridal",
    name: "Bridal Lehengas & Khada Dupatta",
    slug: "bridal",
    image: "/kusum-bridal-maroon.jpg",
    description: "Heirloom Hyderabadi khada dupattas, zardozi bridal lehengas & bespoke wedding couture",
    parentId: null,
  },
  {
    id: "cat-mommy-and-me",
    name: "Junior Festive & Shararas",
    slug: "mommy-and-me",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
    description: "Festive girls lehengas, frocks and shararas for weddings, festive Eid & family celebrations",
    parentId: null,
  },
  {
    id: "cat-sale",
    name: "Festive Sale (Flat 60% Off)",
    slug: "sale",
    image: "/kusum-festive-rust.jpg",
    description: "Limited-time offers on designer bridal, festive pret & clearance suits",
    parentId: null,
  },
  // Subcategories
  {
    id: "sub-lawn",
    name: "Luxury Lawn",
    slug: "luxury-lawn",
    image: "/kusum-festive-rust.jpg",
    parentId: "cat-unstitched",
  },
  {
    id: "sub-chiffon",
    name: "Embroidered Chiffon",
    slug: "embroidered-chiffon",
    image: "/kusum-ivory-peshwas.jpg",
    parentId: "cat-unstitched",
  },
  {
    id: "sub-mbroidered",
    name: "Mbroidered Wedding",
    slug: "mbroidered-wedding",
    image: "/kusum-velvet-areej.jpg",
    parentId: "cat-unstitched",
  },
  {
    id: "sub-casual-pret",
    name: "Casual Pret",
    slug: "casual-pret",
    image: "/kusum-silver-shehnai.jpg",
    parentId: "cat-ready-to-wear",
  },
  {
    id: "sub-festive-pret",
    name: "Festive Pret",
    slug: "festive-pret",
    image: "/kusum-festive-black.jpg",
    parentId: "cat-ready-to-wear",
  },
  {
    id: "sub-wedding-formals",
    name: "Shehnai Wedding Formals",
    slug: "wedding-formals",
    image: "/kusum-bridal-purple.jpg",
    parentId: "cat-luxury-formals",
  },
  {
    id: "sub-eid-collection",
    name: "Festive Eid Drops",
    slug: "eid-drops",
    image: "/kusum-bridal-maroon.jpg",
    parentId: "cat-luxury-formals",
  },
  {
    id: "sub-classic-abayas",
    name: "Classic Modest Abayas",
    slug: "classic-abayas",
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
    parentId: "cat-abayas",
  },
  {
    id: "sub-kaftans",
    name: "Festive Kaftans",
    slug: "festive-kaftans",
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
    parentId: "cat-abayas",
  },
  {
    id: "sub-girls-festive",
    name: "Girls Festive Wear",
    slug: "girls-festive",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
    parentId: "cat-mommy-and-me",
  },
];

