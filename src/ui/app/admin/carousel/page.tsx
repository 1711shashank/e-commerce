import type { Metadata } from "next";
import { CarouselList } from "@/components/admin/CarouselList";

export const metadata: Metadata = {
  title: "Carousel",
  description: "Manage homepage hero carousel slides.",
};

export default function AdminCarouselPage() {
  return <CarouselList />;
}
