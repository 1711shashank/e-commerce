import type { Metadata } from "next";
import { ProductListing } from "@/components/product/ProductListing";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  getParentCategories,
  getProducts,
} from "@/lib/services";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse all Aurelia products with search and filters.",
};

interface PageProps {
  searchParams: Promise<{ search?: string; new?: string }>;
}

export default async function AllProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const products = getProducts();
  const categories = getParentCategories();

  return (
    <div>
      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 lg:px-10">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "All Products" },
          ]}
        />
      </div>
      <ProductListing
        products={products}
        categories={categories}
        title="All Products"
        initialFilters={{
          search: sp.search,
          isNew: sp.new === "1" ? true : undefined,
        }}
      />
    </div>
  );
}
