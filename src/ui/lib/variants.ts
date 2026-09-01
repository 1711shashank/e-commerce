import type { Product, ProductVariant } from "@/lib/types";

const LEGACY_SEED_STOCK = 999;

export function normalizeVariants(product: Product): ProductVariant[] {
  if (product.variants?.length) {
    return product.variants;
  }
  if (!product.inStock) return [];
  return product.colors.flatMap((color) =>
    product.sizes.map((size) => ({
      color,
      size,
      stockQty: LEGACY_SEED_STOCK,
    })),
  );
}

export function getVariantStock(
  product: Product,
  color: string,
  size: string,
): number {
  const variant = normalizeVariants(product).find(
    (v) => v.color === color && v.size === size,
  );
  return variant?.stockQty ?? 0;
}

export function colorsWithStock(product: Product): string[] {
  const variants = normalizeVariants(product);
  const colors = new Set<string>();
  for (const v of variants) {
    if (v.stockQty > 0) colors.add(v.color);
  }
  return product.colors.filter((c) => colors.has(c));
}

export function sizesWithStockForColor(product: Product, color: string): string[] {
  const variants = normalizeVariants(product);
  const sizes = new Set<string>();
  for (const v of variants) {
    if (v.color === color && v.stockQty > 0) sizes.add(v.size);
  }
  return product.sizes.filter((s) => sizes.has(s));
}

export function productHasStock(product: Product): boolean {
  return normalizeVariants(product).some((v) => v.stockQty > 0);
}

export function getFirstInStockVariant(
  product: Product,
): { color: string; size: string } | null {
  for (const color of product.colors) {
    for (const size of product.sizes) {
      if (getVariantStock(product, color, size) > 0) {
        return { color, size };
      }
    }
  }
  return null;
}

export function getSizeStockMap(
  product: Product,
  color: string,
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const size of product.sizes) {
    map[size] = getVariantStock(product, color, size);
  }
  return map;
}

export function syncVariantStock(
  colors: string[],
  sizes: string[],
  existing: ProductVariant[],
): ProductVariant[] {
  const map = new Map(
    existing.map((v) => [`${v.color}|${v.size}`, v.stockQty]),
  );
  return colors.flatMap((color) =>
    sizes.map((size) => ({
      color,
      size,
      stockQty: map.get(`${color}|${size}`) ?? 0,
    })),
  );
}

export function variantKey(color: string, size: string): string {
  return `${color}|${size}`;
}

export function getImagesForColor(product: Product, color: string): string[] {
  return product.imagesByColor[color] ?? [];
}

export function getDefaultProductImage(product: Product): string {
  const defaultColor = product.colors[0];
  if (defaultColor) {
    const imgs = product.imagesByColor[defaultColor];
    if (imgs?.[0]) return imgs[0];
  }
  return "";
}

export function normalizeImagesByColor(
  product: Product,
): Record<string, string[]> {
  const mapped: Record<string, string[]> = { ...product.imagesByColor };
  for (const color of product.colors) {
    if (!mapped[color]) mapped[color] = [];
  }
  return mapped;
}
