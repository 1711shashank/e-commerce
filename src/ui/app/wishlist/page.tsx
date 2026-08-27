"use client";

import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { getProductById } from "@/lib/services";
import { useStore } from "@/lib/store";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const products = wishlist
    .map((id) => getProductById(id))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <Breadcrumb
        className="mb-8"
        items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />
      <h1 className="font-display text-3xl sm:text-4xl">Wishlist</h1>
      <p className="mt-2 text-sm text-muted">
        {products.length} saved {products.length === 1 ? "item" : "items"}
      </p>

      {products.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted">Your wishlist is empty.</p>
          <Button className="mt-6">
            <Link href="/collections">Browse collections</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map(
            (product) =>
              product && <ProductCard key={product.id} product={product} />,
          )}
        </div>
      )}
    </div>
  );
}
