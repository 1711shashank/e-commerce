import type { Metadata } from "next";
import EditProductClient from "./EditProductClient";
import { getCategories } from "@/lib/services";

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Update product details, sizes, and pricing.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const categories = getCategories();
  return <EditProductClient params={params} categories={categories} />;
}
