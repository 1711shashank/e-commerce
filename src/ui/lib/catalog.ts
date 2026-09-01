import type { Product, ProductVariant } from "@/lib/types";
import { products as seedProducts } from "@/data/products";
import { syncVariantStock, normalizeImagesByColor } from "@/lib/variants";

export const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
] as const;

export const SIZE_SORT_ORDER = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
] as const;

export function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ai = SIZE_SORT_ORDER.indexOf(a as (typeof SIZE_SORT_ORDER)[number]);
    const bi = SIZE_SORT_ORDER.indexOf(b as (typeof SIZE_SORT_ORDER)[number]);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export const FABRIC_OPTIONS = [
  "Lawn",
  "Cotton",
  "Linen",
  "Silk",
  "Chiffon",
  "Knit",
  "Denim",
  "Wool",
  "Other",
] as const;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function mergeCatalog(
  seed: Product[] = seedProducts,
  custom: Product[] = [],
): Product[] {
  if (!custom.length) return seed;
  const customSlugs = new Set(custom.map((p) => p.slug));
  const customIds = new Set(custom.map((p) => p.id));
  return [
    ...custom,
    ...seed.filter((p) => !customSlugs.has(p.slug) && !customIds.has(p.id)),
  ];
}

export function createProductId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `custom-${crypto.randomUUID()}`;
  }
  return `custom-${Date.now()}`;
}

export type ProductFormValues = {
  name: string;
  category: string;
  subCategory: string;
  price: string;
  discountPrice: string;
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
  fabric: string;
  description: string;
  imagesByColor: Record<string, string[]>;
  tags: string;
  isNew: boolean;
  isOnSale: boolean;
};

export function emptyProductForm(): ProductFormValues {
  return {
    name: "",
    category: "women",
    subCategory: "",
    price: "",
    discountPrice: "",
    sizes: ["M"],
    colors: [],
    variants: syncVariantStock([], ["M"], []),
    fabric: "",
    description: "",
    imagesByColor: {},
    tags: "",
    isNew: true,
    isOnSale: false,
  };
}

export function productToFormValues(product: Product): ProductFormValues {
  const colors = [...product.colors];
  const sizes = [...product.sizes].filter((s) => s !== "One Size");
  const baseVariants =
    product.variants?.length
      ? product.variants
          .filter((v) => v.size !== "One Size")
          .map((v) => ({ ...v }))
      : syncVariantStock(colors, sizes, []);

  return {
    name: product.name,
    category: product.category,
    subCategory: product.subCategory ?? "",
    price: String(product.price),
    discountPrice:
      product.discountPrice != null ? String(product.discountPrice) : "",
    sizes,
    colors,
    variants: syncVariantStock(colors, sizes, baseVariants),
    fabric: product.fabric ?? "",
    description: product.description,
    imagesByColor: normalizeImagesByColor(product),
    tags: (product.tags ?? []).join(", "),
    isNew: product.isNew,
    isOnSale: product.isOnSale,
  };
}

export function parseList(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function buildProductFromForm(
  values: ProductFormValues,
  options?: { id?: string; slug?: string; createdAt?: string },
): { product?: Product; error?: string } {
  const name = values.name.trim();
  if (!name) return { error: "Name is required." };

  const price = Number(values.price);
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "Enter a valid price greater than zero." };
  }

  let discountPrice: number | undefined;
  if (values.discountPrice.trim()) {
    discountPrice = Number(values.discountPrice);
    if (!Number.isFinite(discountPrice) || discountPrice <= 0) {
      return { error: "Sale price must be a valid number." };
    }
    if (discountPrice >= price) {
      return { error: "Sale price must be lower than the regular price." };
    }
  }

  if (!values.sizes.length) {
    return { error: "Add at least one size." };
  }

  const colors = values.colors.map((c) => c.trim()).filter(Boolean);
  if (!colors.length) {
    return { error: "Add at least one color." };
  }

  const variants = syncVariantStock(colors, values.sizes, values.variants);
  const hasStock = variants.some((v) => v.stockQty > 0);
  if (!hasStock) {
    return { error: "Set stock for at least one color and size combination." };
  }

  const imagesByColor: Record<string, string[]> = {};
  for (const color of colors) {
    imagesByColor[color] = (values.imagesByColor[color] ?? [])
      .map((u) => u.trim())
      .filter(Boolean);
    if (!imagesByColor[color].length) {
      return { error: `Add at least one image for color: ${color}.` };
    }
  }

  const description = values.description.trim();
  if (!description) return { error: "Description is required." };

  const slug = options?.slug || slugify(name);
  if (!slug) return { error: "Could not generate a product slug from the name." };

  const product: Product = {
    id: options?.id ?? createProductId(),
    slug,
    name,
    category: values.category,
    subCategory: values.subCategory || undefined,
    price,
    discountPrice,
    imagesByColor,
    sizes: values.sizes,
    colors,
    variants,
    fabric: values.fabric.trim() || undefined,
    description,
    isNew: values.isNew,
    isOnSale: values.isOnSale || discountPrice != null,
    inStock: hasStock,
    rating: 5,
    createdAt: options?.createdAt ?? new Date().toISOString(),
    tags: parseList(values.tags),
  };

  return { product };
}
