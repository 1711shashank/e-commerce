import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "cat-women",
    name: "Women",
    slug: "women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    description: "Contemporary silhouettes for every occasion",
    parentId: null,
  },
  {
    id: "cat-men",
    name: "Men",
    slug: "men",
    image:
      "https://images.unsplash.com/photo-1490570471622-f13da808d8f4?w=800&q=80",
    description: "Refined essentials and seasonal menswear",
    parentId: null,
  },
  {
    id: "cat-kids",
    name: "Kids",
    slug: "kids",
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad1?w=800&q=80",
    description: "Soft, playful pieces for little ones",
    parentId: null,
  },
  {
    id: "cat-unstitched",
    name: "Unstitched",
    slug: "unstitched",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    description: "Premium fabrics ready for your tailor",
    parentId: null,
  },
  {
    id: "cat-ready-to-wear",
    name: "Ready to Wear",
    slug: "ready-to-wear",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    description: "Finished looks, ready to wear now",
    parentId: null,
  },
  {
    id: "cat-sale",
    name: "Sale",
    slug: "sale",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b14ba4d3d1?w=800&q=80",
    description: "Limited-time offers on seasonal favourites",
    parentId: null,
  },
  {
    id: "sub-lawn",
    name: "Lawn",
    slug: "lawn",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    parentId: "cat-women",
  },
  {
    id: "sub-formals",
    name: "Formals",
    slug: "formals",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    parentId: "cat-women",
  },
  {
    id: "sub-casual",
    name: "Casual",
    slug: "casual",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    parentId: "cat-women",
  },
  {
    id: "sub-shirts",
    name: "Shirts",
    slug: "shirts",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    parentId: "cat-men",
  },
  {
    id: "sub-kurtas",
    name: "Kurtas",
    slug: "kurtas",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    parentId: "cat-men",
  },
];
