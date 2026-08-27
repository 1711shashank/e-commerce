import type { Metadata } from "next";
import { NewProductClient } from "./NewProductClient";
import { getCategories } from "@/lib/services";

export const metadata: Metadata = {
  title: "Add Product",
  description: "Create a new Aurelia product with sizes and pricing.",
};

export default function NewProductPage() {
  const categories = getCategories();
  return <NewProductClient categories={categories} />;
}
