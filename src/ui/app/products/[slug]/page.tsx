import type { Metadata } from "next";
import { ProductPageClient } from "@/components/product/ProductPageClient";
import { getProductBySlug, getProducts } from "@/lib/services";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: PageProps) {
  return <ProductPageClient params={params} />;
}
