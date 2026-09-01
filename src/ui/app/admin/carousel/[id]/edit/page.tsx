import type { Metadata } from "next";
import EditCarouselClient from "./EditCarouselClient";

export const metadata: Metadata = {
  title: "Edit carousel slide",
  description: "Edit a homepage hero slide.",
};

export default function EditCarouselPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EditCarouselClient params={params} />;
}
