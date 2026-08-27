import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aurelia — Contemporary Clothing",
    template: "%s · Aurelia",
  },
  description:
    "Shop Aurelia for lawn, ready-to-wear, menswear, kids, and seasonal sale collections. Modern fashion with timeless ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
