import type { Metadata } from "next";
import NewCarouselClient from "./NewCarouselClient";

export const metadata: Metadata = {
  title: "New carousel slide",
  description: "Add a homepage hero slide.",
};

export default function NewCarouselPage() {
  return <NewCarouselClient />;
}
