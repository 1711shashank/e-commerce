"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getMaxAddQuantity,
  getMaxLineQuantity,
  reconcileCartItems,
} from "@/lib/cart-stock";
import { getEffectivePrice } from "@/lib/services";
import type { CartItem, Product } from "@/lib/types";
import { getDefaultProductImage, getImagesForColor } from "@/lib/variants";

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  isMobileNavOpen: boolean;
  isSearchOpen: boolean;
  addToCart: (
    product: Product,
    size: string,
    color: string,
    quantity?: number,
    options?: { openCart?: boolean; stitchingType?: "unstitched" | "stitched" },
  ) => boolean;
  removeFromCart: (
    productId: string,
    size: string,
    color: string,
    stitchingType?: string,
  ) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number,
    product?: Product,
    stitchingType?: string,
  ) => boolean;
  reconcileCart: (catalog: Product[]) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  cartCount: () => number;
  cartSubtotal: () => number;
  wishlistCount: () => number;
}

function sameLine(
  item: CartItem,
  productId: string,
  size: string,
  color: string,
  stitchingType?: string,
) {
  return (
    item.productId === productId &&
    item.size === size &&
    item.color === color &&
    (stitchingType === undefined || item.stitchingType === stitchingType)
  );
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,
      isMobileNavOpen: false,
      isSearchOpen: false,

      addToCart: (product, size, color, quantity = 1, options) => {
        const shouldOpen = options?.openCart !== false;
        const stitchingType = options?.stitchingType;
        const allowed = getMaxAddQuantity(product, color, size, get().cart);
        if (allowed <= 0) return false;

        const addQty = Math.min(quantity, allowed);

        set((state) => {
          const existing = state.cart.find(
            (item) =>
              item.productId === product.id &&
              item.size === size &&
              item.color === color &&
              item.stitchingType === stitchingType,
          );
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.productId === product.id &&
                item.size === size &&
                item.color === color &&
                item.stitchingType === stitchingType
                  ? { ...item, quantity: item.quantity + addQty }
                  : item,
              ),
              isCartOpen: shouldOpen ? true : state.isCartOpen,
            };
          }
          const item: CartItem = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image:
              getImagesForColor(product, color)[0] ??
              getDefaultProductImage(product),
            price: getEffectivePrice(product),
            size,
            color,
            quantity: addQty,
            stitchingType,
          };
          return {
            cart: [...state.cart, item],
            isCartOpen: shouldOpen ? true : state.isCartOpen,
          };
        });
        return true;
      },

      removeFromCart: (productId, size, color, stitchingType) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) => !sameLine(item, productId, size, color, stitchingType),
          ),
        }));
      },

      updateQuantity: (
        productId,
        size,
        color,
        quantity,
        product,
        stitchingType,
      ) => {
        if (quantity < 1) {
          get().removeFromCart(productId, size, color, stitchingType);
          return true;
        }

        const max =
          product != null
            ? getMaxLineQuantity(product, color, size)
            : quantity;

        if (product != null && max <= 0) {
          get().removeFromCart(productId, size, color, stitchingType);
          return false;
        }

        const nextQty = product != null ? Math.min(quantity, max) : quantity;

        set((state) => ({
          cart: state.cart.map((item) =>
            sameLine(item, productId, size, color, stitchingType)
              ? { ...item, quantity: nextQty }
              : item,
          ),
        }));
        return nextQty === quantity;
      },

      reconcileCart: (catalog) => {
        set((state) => ({
          cart: reconcileCartItems(state.cart, catalog),
        }));
      },

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        }));
      },

      isInWishlist: (productId) => get().wishlist.includes(productId),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
      openMobileNav: () => set({ isMobileNavOpen: true }),
      closeMobileNav: () => set({ isMobileNavOpen: false }),
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),

      cartCount: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),
      cartSubtotal: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      wishlistCount: () => get().wishlist.length,
    }),
    {
      name: "kusum-store",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    },
  ),
);
