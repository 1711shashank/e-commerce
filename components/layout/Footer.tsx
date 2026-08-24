import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Newsletter } from "@/components/home/Newsletter";

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Pinterest", href: "#" },
];

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/collections/women", label: "Women" },
      { href: "/collections/men", label: "Men" },
      { href: "/collections/kids", label: "Kids" },
      { href: "/collections/sale", label: "Sale" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/shipping", label: "Shipping & Returns" },
      { href: "/faqs", label: "FAQs" },
      { href: "/contact", label: "Contact" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/collections", label: "Collections" },
      { href: "/wishlist", label: "Wishlist" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/shipping", label: "Privacy Policy" },
      { href: "/shipping", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto">
      <Newsletter />
      <div className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-5 lg:px-10 lg:py-16">
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl tracking-[0.18em]"
            >
              AURELIA
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Contemporary clothing for everyday elegance — lawn, ready-to-wear,
              and tailored essentials.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex min-h-11 items-center justify-center border border-border px-3 text-xs uppercase tracking-wide hover:border-foreground"
                  aria-label={social.label}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs uppercase tracking-[0.15em]">{col.title}</h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:px-8 lg:px-10">
            <p>© {new Date().getFullYear()} Aurelia. All rights reserved.</p>
            <div className="flex items-center gap-2" aria-label="Payment methods">
              <CreditCard className="h-4 w-4" />
              <span>Visa · Mastercard · Amex · PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
