import type { CartItem, Product } from "@/lib/types";
import { getEffectivePrice } from "@/lib/services";
import {
  getDefaultProductImage,
  getImagesForColor,
  getVariantStock,
  productHasStock,
} from "@/lib/variants";

export function findProductInCatalog(
  catalog: Product[],
  item: Pick<CartItem, "productId" | "slug">,
): Product | undefined {
  return catalog.find(
    (p) => p.id === item.productId || p.slug === item.slug,
  );
}

export function getCartLineQuantity(
  cart: CartItem[],
  productId: string,
  color: string,
  size: string,
): number {
  return (
    cart.find(
      (item) =>
        item.productId === productId &&
        item.color === color &&
        item.size === size,
    )?.quantity ?? 0
  );
}

export function getMaxLineQuantity(
  product: Product,
  color: string,
  size: string,
): number {
  return getVariantStock(product, color, size);
}

export function getMaxAddQuantity(
  product: Product,
  color: string,
  size: string,
  cart: CartItem[],
): number {
  const stock = getVariantStock(product, color, size);
  if (stock <= 0) return 0;
  const inCart = getCartLineQuantity(cart, product.id, color, size);
  return Math.max(0, stock - inCart);
}

export function clampQuantity(quantity: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(Math.max(1, quantity), max);
}

export type CartValidationIssue =
  | { type: "missing"; item: CartItem }
  | { type: "out_of_stock"; item: CartItem }
  | { type: "over_quantity"; item: CartItem; max: number };

export function validateCartAgainstCatalog(
  cart: CartItem[],
  catalog: Product[],
): CartValidationIssue[] {
  const issues: CartValidationIssue[] = [];

  for (const item of cart) {
    const product = findProductInCatalog(catalog, item);
    if (!product || !productHasStock(product)) {
      issues.push({ type: "missing", item });
      continue;
    }
    const max = getMaxLineQuantity(product, item.color, item.size);
    if (max <= 0) {
      issues.push({ type: "out_of_stock", item });
    } else if (item.quantity > max) {
      issues.push({ type: "over_quantity", item, max });
    }
  }

  return issues;
}

export function reconcileCartItems(
  cart: CartItem[],
  catalog: Product[],
): CartItem[] {
  const next: CartItem[] = [];

  for (const item of cart) {
    const product = findProductInCatalog(catalog, item);
    if (!product) continue;

    const max = getMaxLineQuantity(product, item.color, item.size);
    if (max <= 0) continue;

    const quantity = Math.min(item.quantity, max);
    next.push({
      ...item,
      quantity,
      price: getEffectivePrice(product),
      image:
        getImagesForColor(product, item.color)[0] ??
        getDefaultProductImage(product),
    });
  }

  return next;
}
