import { promoStrips } from "@/data/banners";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type {
  Category,
  Product,
  ProductFilters,
  SortOption,
} from "@/lib/types";
import { productHasStock } from "@/lib/variants";

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
    .filter((p) => productHasStock(p))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}

export function getSaleProducts(limit = 8): Product[] {
  return products.filter((p) => p.isOnSale).slice(0, limit);
}

export function getRelatedProducts(
  product: Product,
  limit = 4,
  list: Product[] = products,
): Product[] {
  return list
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

    if (filters.inStock === true && !productHasStock(product)) return false;
    if (filters.inStock === false && productHasStock(product)) return false;

    if (filters.isNew && !product.isNew) return false;
    if (filters.isOnSale && !product.isOnSale) return false;

    if (filters.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      const haystack = [
        product.name,
        product.description,
        product.category,
        product.subCategory ?? "",
        product.fabric ?? "",
        ...(product.tags ?? []),
        ...product.colors,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
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

export function searchProducts(
  query: string,
  limit = 6,
  list: Product[] = products,
): Product[] {
  if (!query.trim()) return [];
  return filterProducts({ search: query }, list).slice(0, limit);
}

export function getAllSizes(): string[] {
  const sizes = new Set<string>();
  products.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
  const order = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
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

export function getPriceRange(list: Product[] = products): {
  min: number;
  max: number;
} {
  const prices = list.map(getEffectivePrice);
  if (!prices.length) return { min: 0, max: 0 };
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDiscountPercent(product: Product): number | null {
  if (!product.discountPrice || product.discountPrice >= product.price) {
    return null;
  }
  return Math.round(
    ((product.price - product.discountPrice) / product.price) * 100,
  );
}
