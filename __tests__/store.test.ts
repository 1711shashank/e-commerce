import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import { useStore } from "@/lib/store";
import { products } from "@/data/products";

// Mock localStorage for Node environment
beforeAll(() => {
  const storage: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, val: string) => { storage[key] = val; },
    removeItem: (key: string) => { delete storage[key]; },
    clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
    key: () => null,
    length: 0,
  };
});

describe("Kusum Zustand Store (Cart & Wishlist)", () => {
  beforeEach(() => {
    useStore.setState({
      cart: [],
      wishlist: [],
      isCartOpen: false,
      isSearchOpen: false,
      isMobileNavOpen: false,
    });
  });

  it("adds unstitched item to cart", () => {
    const p = products[0];
    useStore.getState().addToCart(p, "Unstitched", "Default", 1, { stitchingType: "unstitched" });

    const cart = useStore.getState().cart;
    expect(cart.length).toBe(1);
    expect(cart[0].productId).toBe(p.id);
    expect(cart[0].stitchingType).toBe("unstitched");
    expect(cart[0].quantity).toBe(1);
  });

  it("adds stitched item with size to cart as separate line item", () => {
    const p = products[0];
    useStore.getState().addToCart(p, "Unstitched", "Default", 1, { stitchingType: "unstitched" });
    useStore.getState().addToCart(p, "M", "Default", 1, { stitchingType: "stitched" });

    const cart = useStore.getState().cart;
    expect(cart.length).toBe(2);
    expect(cart[0].stitchingType).toBe("unstitched");
    expect(cart[1].stitchingType).toBe("stitched");
  });

  it("increments quantity when adding same variant again", () => {
    const p = products[0];
    useStore.getState().addToCart(p, "M", "Default", 1, { stitchingType: "stitched" });
    useStore.getState().addToCart(p, "M", "Default", 2, { stitchingType: "stitched" });

    const cart = useStore.getState().cart;
    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(3);
  });

  it("updates quantity and removes item when quantity reaches 0", () => {
    const p = products[0];
    useStore.getState().addToCart(p, "M", "Default", 2, { stitchingType: "stitched" });

    useStore.getState().updateQuantity(p.id, "M", "Default", 5, "stitched");
    expect(useStore.getState().cart[0].quantity).toBe(5);

    useStore.getState().updateQuantity(p.id, "M", "Default", 0, "stitched");
    expect(useStore.getState().cart.length).toBe(0);
  });

  it("removes item directly with removeFromCart", () => {
    const p1 = products[0];
    const p2 = products[1];
    useStore.getState().addToCart(p1, "M", "Default", 1);
    useStore.getState().addToCart(p2, "L", "Default", 1);

    expect(useStore.getState().cart.length).toBe(2);
    useStore.getState().removeFromCart(p1.id, "M", "Default");
    expect(useStore.getState().cart.length).toBe(1);
    expect(useStore.getState().cart[0].productId).toBe(p2.id);
  });

  it("toggles product in wishlist correctly", () => {
    const pId = products[0].id;
    expect(useStore.getState().isInWishlist(pId)).toBe(false);

    useStore.getState().toggleWishlist(pId);
    expect(useStore.getState().isInWishlist(pId)).toBe(true);
    expect(useStore.getState().wishlistCount()).toBe(1);

    useStore.getState().toggleWishlist(pId);
    expect(useStore.getState().isInWishlist(pId)).toBe(false);
    expect(useStore.getState().wishlistCount()).toBe(0);
  });
});
