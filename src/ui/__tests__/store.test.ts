import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import { useStore } from "@/lib/store";
import { products } from "@/data/products";

beforeAll(() => {
  const storage: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, val: string) => {
      storage[key] = val;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      Object.keys(storage).forEach((k) => delete storage[k]);
    },
    key: () => null,
    length: 0,
  };
});

describe("Kusum Zustand Store (Cart & Wishlist)", () => {
  const p = products[0];
  const color = p.colors[0];
  const size = p.sizes[0];

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
    const ok = useStore
      .getState()
      .addToCart(p, size, color, 1, { stitchingType: "unstitched" });
    expect(ok).toBe(true);

    const cart = useStore.getState().cart;
    expect(cart.length).toBe(1);
    expect(cart[0].productId).toBe(p.id);
    expect(cart[0].stitchingType).toBe("unstitched");
    expect(cart[0].quantity).toBe(1);
  });

  it("adds stitched item with size to cart as separate line item", () => {
    useStore.getState().addToCart(p, size, color, 1, { stitchingType: "unstitched" });
    useStore.getState().addToCart(p, size, color, 1, { stitchingType: "stitched" });

    const cart = useStore.getState().cart;
    expect(cart.length).toBe(2);
    expect(cart[0].stitchingType).toBe("unstitched");
    expect(cart[1].stitchingType).toBe("stitched");
  });

  it("increments quantity when adding same variant again", () => {
    useStore.getState().addToCart(p, size, color, 1, { stitchingType: "stitched" });
    useStore.getState().addToCart(p, size, color, 2, { stitchingType: "stitched" });

    const cart = useStore.getState().cart;
    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(3);
  });

  it("updates quantity and removes item when quantity reaches 0", () => {
    useStore.getState().addToCart(p, size, color, 2, { stitchingType: "stitched" });

    useStore.getState().updateQuantity(p.id, size, color, 5, undefined, "stitched");
    expect(useStore.getState().cart[0].quantity).toBe(5);

    useStore.getState().updateQuantity(p.id, size, color, 0, undefined, "stitched");
    expect(useStore.getState().cart.length).toBe(0);
  });

  it("removes item directly with removeFromCart", () => {
    const p2 = products[1];
    useStore.getState().addToCart(p, size, color, 1);
    useStore.getState().addToCart(p2, p2.sizes[0], p2.colors[0], 1);

    expect(useStore.getState().cart.length).toBe(2);
    useStore.getState().removeFromCart(p.id, size, color);
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
