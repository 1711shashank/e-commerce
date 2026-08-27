import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/services";

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

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = getRelatedProducts(product, 8);

  return <ProductDetail product={product} related={related} />;
}
