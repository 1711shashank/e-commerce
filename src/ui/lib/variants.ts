import type { Product, ProductVariant } from "@/lib/types";

export function normalizeVariants(product: Product): ProductVariant[] {
  if (product.variants?.length) {
    return product.variants;
  }
  if (!product.inStock) return [];
  return product.colors.flatMap((color) =>
    product.sizes.map((size) => ({
      color,
      size,
      stockQty: 10,
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
  const mapped = product.colorImages?.[color];
  if (mapped?.length) return mapped;
  return product.images;
}

export function getDefaultProductImage(product: Product): string {
  const defaultColor = product.colors[0];
  if (defaultColor) {
    const imgs = getImagesForColor(product, defaultColor);
    if (imgs[0]) return imgs[0];
  }
  return product.images[0] ?? "";
}

export function flattenColorImages(
  colors: string[],
  colorImages: Record<string, string[]>,
): string[] {
  const flat: string[] = [];
  const seen = new Set<string>();
  for (const color of colors) {
    for (const url of colorImages[color] ?? []) {
      if (url && !seen.has(url)) {
        seen.add(url);
        flat.push(url);
      }
    }
  }
  return flat;
}

export function normalizeColorImages(
  product: Product,
): Record<string, string[]> {
  if (product.colorImages && Object.keys(product.colorImages).length > 0) {
    return { ...product.colorImages };
  }
  const colors = product.colors;
  if (!colors.length) return {};
  const mapped: Record<string, string[]> = {};
  for (const color of colors) {
    mapped[color] = color === colors[0] ? [...product.images] : [];
  }
  return mapped;
}
