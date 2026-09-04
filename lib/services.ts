import { banners, promoStrips } from "@/data/banners";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type {
  Banner,
  Category,
  Product,
  ProductFilters,
  SortOption,
} from "@/lib/types";

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategories(): Category[] {
  return categories;
}

export function getParentCategories(): Category[] {
  return categories.filter((c) => !c.parentId);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSubCategories(parentId: string): Category[] {
  return categories.filter((c) => c.parentId === parentId);
}

export function getBanners(): Banner[] {
  return banners;
}

export function getPromoStrips() {
  return promoStrips;
}

export function getFeaturedProducts(limit = 8): Product[] {
  return [...products]
    .filter((p) => p.isNew)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

export function getBestSellers(limit = 8): Product[] {
  return [...products]
    .filter((p) => p.inStock)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}

export function getSaleProducts(limit = 8): Product[] {
  return products.filter((p) => p.isOnSale).slice(0, limit);
}

export function getRelatedProducts(
  product: Product,
  limit = 4,
): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.subCategory === product.subCategory),
    )
    .slice(0, limit);
}

export function getEffectivePrice(product: Product): number {
  return product.discountPrice ?? product.price;
}

export function filterProducts(
  filters: ProductFilters,
  list: Product[] = products,
): Product[] {
  return list.filter((product) => {
    if (filters.category === "sale") {
      if (!product.isOnSale) return false;
    } else if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (
      filters.subCategory &&
      product.subCategory !== filters.subCategory
    ) {
      return false;
    }

    const price = getEffectivePrice(product);
    if (filters.minPrice != null && price < filters.minPrice) return false;
    if (filters.maxPrice != null && price > filters.maxPrice) return false;

    if (filters.sizes?.length) {
      if (!filters.sizes.some((s) => product.sizes.includes(s))) return false;
    }

    if (filters.colors?.length) {
      if (!filters.colors.some((c) => product.colors.includes(c))) return false;
    }

    if (filters.fabrics?.length) {
      if (!product.fabric || !filters.fabrics.includes(product.fabric)) {
        return false;
      }
    }

    if (filters.stitchingType) {
      if (
        !product.stitchingOptions ||
        !product.stitchingOptions.includes(filters.stitchingType)
      ) {
        return false;
      }
    }

    if (filters.pieces?.length) {
      if (!product.pieces || !filters.pieces.includes(product.pieces)) {
        return false;
      }
    }

    if (filters.inStock === true && !product.inStock) return false;
    if (filters.inStock === false && product.inStock) return false;

    if (filters.isNew && !product.isNew) return false;
    if (filters.isOnSale && !product.isOnSale) return false;

    if (filters.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      const searchTerms = q.split(/\s+/).filter(Boolean);

      const fabricParts = product.fabricBreakdown
        ? Object.values(product.fabricBreakdown).join(" ")
        : "";

      const pieceKeywords =
        product.pieces === 3 || product.pieces === 2
          ? `${product.pieces} piece ${product.pieces}-piece suit set ensemble dress`
          : product.pieces === "abaya-set"
            ? "abaya set dress kaftan modest"
            : "";

      const stitchingKeywords = product.stitchingOptions
        ? product.stitchingOptions.join(" ")
        : "";

      const searchableFields = [
        product.name,
        product.slug.replace(/-/g, " "),
        product.description,
        product.category,
        product.subCategory ?? "",
        product.fabric ?? "",
        ...(product.tags ?? []),
        ...product.colors,
        ...(product.embellishments ?? []),
        fabricParts,
        pieceKeywords,
        stitchingKeywords,
      ]
        .join(" ")
        .toLowerCase();

      const normalizedHaystack = searchableFields.replace(/-/g, " ");

      const allTermsMatch = searchTerms.every((term) => {
        const cleanTerm = term.replace(/-/g, " ");
        return (
          searchableFields.includes(term) ||
          normalizedHaystack.includes(cleanTerm)
        );
      });

      if (!allTermsMatch) return false;
    }

    return true;
  });
}

export function sortProducts(
  list: Product[],
  sort: SortOption = "newest",
): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort(
        (a, b) => getEffectivePrice(a) - getEffectivePrice(b),
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => getEffectivePrice(b) - getEffectivePrice(a),
      );
    case "best-selling":
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "a-z":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}

export function searchProducts(query: string, limit = 6): Product[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  const searchTerms = q.split(/\s+/).filter(Boolean);
  const matches = filterProducts({ search: query });

  return matches
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      const aExact = aName === q;
      const bExact = bName === q;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = aName.startsWith(q);
      const bStarts = bName.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      const aNameHasAll = searchTerms.every((t) => aName.includes(t));
      const bNameHasAll = searchTerms.every((t) => bName.includes(t));
      if (aNameHasAll && !bNameHasAll) return -1;
      if (!aNameHasAll && bNameHasAll) return 1;

      return 0;
    })
    .slice(0, limit);
}

export function getAllSizes(): string[] {
  const sizes = new Set<string>();
  products.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
  const order = [
    "Unstitched",
    "Made to Measure",
    "One Size",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "52",
    "54",
    "56",
    "58",
    "60",
    "2-3Y",
    "3-4Y",
    "4-5Y",
    "5-6Y",
    "6-7Y",
    "7-8Y",
    "8-9Y",
    "9-10Y",
    "10-11Y",
    "11-12Y",
  ];
  return Array.from(sizes).sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function getAllColors(): string[] {
  const colors = new Set<string>();
  products.forEach((p) => p.colors.forEach((c) => colors.add(c)));
  return Array.from(colors).sort();
}

export function getAllFabrics(): string[] {
  const fabrics = new Set<string>();
  products.forEach((p) => {
    if (p.fabric) fabrics.add(p.fabric);
  });
  return Array.from(fabrics).sort();
}

export function getPriceRange(): { min: number; max: number } {
  const prices = products.map(getEffectivePrice);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

export const FREE_SHIPPING_THRESHOLD = 350;
export const STANDARD_SHIPPING_FEE = 25;

export function formatPrice(amount: number): string {
  return `AED ${amount.toLocaleString("en-US")}`;
}

export function getDiscountPercent(product: Product): number | null {
  if (!product.discountPrice || product.discountPrice >= product.price) {
    return null;
  }
  return Math.round(
    ((product.price - product.discountPrice) / product.price) * 100,
  );
}

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/kusumdesignerwear?igsi=MWExdXUwM2E5dWswaQ%3D%3D&utm_source=qr",
  facebook: "https://www.facebook.com/share/197xSpQNnJ/",
  youtube: "https://youtube.com/@kusumthepremiumdesignerwea-v5v?si=Hv1jcbiTJPztlOZd",
};


