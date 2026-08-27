import type { Product } from "@/lib/types";
import { products as seedProducts } from "@/data/products";

export const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "One Size",
] as const;

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
  fabric: string;
  description: string;
  images: string[];
  tags: string;
  isNew: boolean;
  isOnSale: boolean;
  inStock: boolean;
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
    fabric: "",
    description: "",
    images: [],
    tags: "",
    isNew: true,
    isOnSale: false,
    inStock: true,
  };
}

export function productToFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    category: product.category,
    subCategory: product.subCategory ?? "",
    price: String(product.price),
    discountPrice:
      product.discountPrice != null ? String(product.discountPrice) : "",
    sizes: [...product.sizes],
    colors: [...product.colors],
    fabric: product.fabric ?? "",
    description: product.description,
    images: [...product.images],
    tags: (product.tags ?? []).join(", "),
    isNew: product.isNew,
    isOnSale: product.isOnSale,
    inStock: product.inStock,
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

  const images = values.images.map((u) => u.trim()).filter(Boolean);
  if (!images.length) {
    return { error: "Add at least one image." };
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
    images,
    sizes: values.sizes,
    colors,
    fabric: values.fabric.trim() || undefined,
    description,
    isNew: values.isNew,
    isOnSale: values.isOnSale || discountPrice != null,
    inStock: values.inStock,
    rating: 5,
    createdAt: options?.createdAt ?? new Date().toISOString(),
    tags: parseList(values.tags),
  };

  return { product };
}
