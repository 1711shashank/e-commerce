import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "cat-unstitched",
    name: "Unstitched",
    slug: "unstitched",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    description: "Signature 3-piece embroidered lawn, chiffon & luxury fabrics",
    parentId: null,
  },
  {
    id: "cat-ready-to-wear",
    name: "Ready to Wear",
    slug: "ready-to-wear",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
    description: "Impeccably tailored modest kurtas, 2-piece & 3-piece suits",
    parentId: null,
  },
  {
    id: "cat-luxury-formals",
    name: "Luxury Formals",
    slug: "luxury-formals",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    description: "Opulent festive ensembles, ghararas and celebratory wedding wear",
    parentId: null,
  },
  {
    id: "cat-abayas",
    name: "Abayas & Kaftans",
    slug: "abayas-kaftans",
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
    description: "Graceful everyday abayas, kimono cuts and festive kaftans with matching sheilas",
    parentId: null,
  },
  {
    id: "cat-bridal",
    name: "Bridal Couture",
    slug: "bridal",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    description: "Handcrafted heirloom bridal lehengas, peshwas and bespoke couture",
    parentId: null,
  },
  {
    id: "cat-mommy-and-me",
    name: "Mommy & Me",
    slug: "mommy-and-me",
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80",
    description: "Adorable festive ethnic dresses, frocks and shararas for young girls",
    parentId: null,
  },
  {
    id: "cat-sale",
    name: "Sale",
    slug: "sale",
    image:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80",
    description: "Limited-time offers on seasonal festive and pret favourites",
    parentId: null,
  },
  // Subcategories
  {
    id: "sub-lawn",
    name: "Luxury Lawn",
    slug: "luxury-lawn",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    parentId: "cat-unstitched",
  },
  {
    id: "sub-chiffon",
    name: "Embroidered Chiffon",
    slug: "embroidered-chiffon",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    parentId: "cat-unstitched",
  },
  {
    id: "sub-mbroidered",
    name: "Mbroidered Wedding",
    slug: "mbroidered-wedding",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
    parentId: "cat-unstitched",
  },
  {
    id: "sub-casual-pret",
    name: "Casual Pret",
    slug: "casual-pret",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    parentId: "cat-ready-to-wear",
  },
  {
    id: "sub-festive-pret",
    name: "Festive Pret",
    slug: "festive-pret",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    parentId: "cat-ready-to-wear",
  },
  {
    id: "sub-wedding-formals",
    name: "Shehnai Wedding Formals",
    slug: "wedding-formals",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
    parentId: "cat-luxury-formals",
  },
  {
    id: "sub-eid-collection",
    name: "Festive Eid Drops",
    slug: "eid-drops",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
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
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    parentId: "cat-abayas",
  },
  {
    id: "sub-girls-festive",
    name: "Girls Festive Wear",
    slug: "girls-festive",
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80",
    parentId: "cat-mommy-and-me",
  },
];

