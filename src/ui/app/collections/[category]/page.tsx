import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductListing } from "@/components/product/ProductListing";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
  getSubCategories,
} from "@/lib/services";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string; search?: string; new?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: "Collection" };
  return {
    title: cat.name,
    description: cat.description ?? `Shop ${cat.name} at Aurelia.`,
  };
}

export function generateStaticParams() {
  return getCategories()
    .filter((c) => !c.parentId)
    .map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category } = await params;
  const sp = await searchParams;
  const cat = getCategoryBySlug(category);
  if (!cat || cat.parentId) notFound();

  const allCategories = getCategories();
  const subs = getSubCategories(cat.id);
  const products = getProducts();

  return (
    <div>
      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 lg:px-10">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/collections" },
            { label: cat.name },
          ]}
        />
      </div>
      <ProductListing
        products={products}
        categories={[cat, ...subs]}
        title={cat.name}
        initialFilters={{
          category: category === "sale" ? "sale" : category,
          subCategory: sp.sub,
          search: sp.search,
          isNew: sp.new === "1" ? true : undefined,
        }}
      />
    </div>
  );
}
