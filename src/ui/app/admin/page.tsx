import type { Metadata } from "next";
import { AdminProductList } from "@/components/admin/AdminProductList";

export const metadata: Metadata = {
  title: "Products",
  description: "Internal catalog product management.",
};

export default function AdminPortalPage() {
  return <AdminProductList />;
}
