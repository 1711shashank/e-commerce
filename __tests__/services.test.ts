import { describe, it, expect } from "vitest";
import {
  formatPrice,
  getEffectivePrice,
  getDiscountPercent,
  filterProducts,
  sortProducts,
  searchProducts,
  getCategoryBySlug,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "@/lib/services";
import { products } from "@/data/products";

describe("Kusum E-Commerce Services", () => {
  describe("Currency & Pricing", () => {
    it("formats price in AED currency correctly", () => {
      expect(formatPrice(350)).toBe("AED 350");
      expect(formatPrice(1250)).toBe("AED 1,250");
    });

    it("calculates effective price correctly (discount vs regular)", () => {
      const discountedProduct = products.find((p) => p.discountPrice != null)!;
      expect(getEffectivePrice(discountedProduct)).toBe(discountedProduct.discountPrice);

      const regularProduct = products.find((p) => p.discountPrice == null)!;
      expect(getEffectivePrice(regularProduct)).toBe(regularProduct.price);
    });

    it("calculates discount percent accurately", () => {
      const sample = { ...products[0], price: 1000, discountPrice: 800 };
      expect(getDiscountPercent(sample)).toBe(20);
    });

    it("verifies UAE shipping threshold constants", () => {
      expect(FREE_SHIPPING_THRESHOLD).toBe(350);
      expect(STANDARD_SHIPPING_FEE).toBe(25);
    });
  });

  describe("Product Filtering & Modest Search", () => {
    it("filters products by category slug", () => {
      const lawn = filterProducts({ category: "unstitched" }, products);
      expect(lawn.length).toBeGreaterThan(0);
      lawn.forEach((p) => expect(p.category).toBe("unstitched"));
    });

    it("filters products by abayas & kaftans category", () => {
      const abayas = filterProducts({ category: "abayas-kaftans" }, products);
      expect(abayas.length).toBeGreaterThan(0);
      abayas.forEach((p) => expect(p.category).toBe("abayas-kaftans"));
    });

    it("filters by stitching option", () => {
      const unstitched = filterProducts({ stitchingType: "unstitched" }, products);
      expect(unstitched.length).toBeGreaterThan(0);
      unstitched.forEach((p) => expect(p.stitchingOptions).toContain("unstitched"));
    });

    it("filters products by piece count", () => {
      const threePiece = filterProducts({ pieces: [3] }, products);
      expect(threePiece.length).toBeGreaterThan(0);
      threePiece.forEach((p) => expect(p.pieces).toBe(3));
    });

    it("searches products by keyword (case-insensitive)", () => {
      const results = searchProducts("lawn", 10);
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        const text = `${p.name} ${p.description} ${p.fabric ?? ""}`.toLowerCase();
        expect(text).toContain("lawn");
      });
    });

    it("searches products by multiple tokens (e.g. 'lawn suit')", () => {
      const results = searchProducts("lawn suit", 10);
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        const text = `${p.name} ${p.description} ${p.fabric ?? ""} ${(p.tags ?? []).join(" ")}`.toLowerCase();
        expect(text).toContain("lawn");
      });
    });

    it("handles hyphenated search terms like 'ready to wear'", () => {
      const results = searchProducts("ready to wear", 10);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe("Sorting", () => {
    it("sorts products by price low-to-high", () => {
      const sorted = sortProducts([...products], "price-asc");
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(getEffectivePrice(sorted[i])).toBeLessThanOrEqual(getEffectivePrice(sorted[i + 1]));
      }
    });

    it("sorts products by price high-to-low", () => {
      const sorted = sortProducts([...products], "price-desc");
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(getEffectivePrice(sorted[i])).toBeGreaterThanOrEqual(getEffectivePrice(sorted[i + 1]));
      }
    });
  });

  describe("Category Retrieval", () => {
    it("retrieves valid category by slug", () => {
      const cat = getCategoryBySlug("luxury-formals");
      expect(cat).toBeDefined();
      expect(cat?.name).toBe("Luxury Formals");
    });
  });
});
