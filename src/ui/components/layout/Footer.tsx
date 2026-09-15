import Link from "next/link";
import Image from "next/image";
import { CreditCard } from "lucide-react";
import { Newsletter } from "@/components/home/Newsletter";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

const columns = [
  {
    title: "Collections",
    links: [
      { href: "/collections/unstitched", label: "Unstitched Luxury" },
      { href: "/collections/ready-to-wear", label: "Ready to Wear (Pret)" },
      { href: "/collections/luxury-formals", label: "Luxury Formals & Festive" },
      { href: "/collections/abayas-kaftans", label: "Abayas & Kaftans" },
      { href: "/bridal", label: "Bridal Couture" },
      { href: "/collections/mommy-and-me", label: "Mommy & Me (Girls)" },
      { href: "/collections/sale", label: "Sale & Offers" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { href: "/track-order", label: "Track Your Order" },
      { href: "/size-guide", label: "Size Guide & Stitching" },
      { href: "/shipping", label: "Shipping & Customs" },
      { href: "/faqs", label: "Frequently Asked Questions" },
      { href: "/contact", label: "Contact Us" },
      { href: "/cart", label: "Shopping Bag" },
    ],
  },
  {
    title: "The House",
    links: [
      { href: "/about", label: "About Kusum" },
      { href: "/bridal", label: "Bespoke Bridal Appointment" },
      { href: "/collections", label: "View All Collections" },
      { href: "/wishlist", label: "Saved Wishlist" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/shipping", label: "Customs & Duties" },
      { href: "/shipping", label: "Exchange Policy" },
      { href: "/shipping", label: "Privacy Policy" },
      { href: "/shipping", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto">
      <Newsletter />
      <div className="border-t border-border/80 bg-surface">
        <div className="mx-auto grid max-w-[1536px] gap-10 px-4 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-5 xl:px-12 lg:py-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center group" aria-label="Kusum - The Premium Designer Wear">
              <div className="relative h-12 xl:h-13 w-[185px] xl:w-[210px] shrink-0">
                <Image
                  src="/logo-wordmark.png"
                  alt="Kusum - The Premium Designer Wear"
                  fill
                  sizes="210px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted">
              Luxury modest and ethnic apparel. Celebrating master craftsmanship with unstitched lawn, festive pret, celebratory wedding formals, and flowing abayas.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href="https://www.instagram.com/kusumdesignerwear?igsi=MWExdXUwM2E5dWswaQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-xs font-semibold uppercase tracking-wider text-foreground hover:border-[#e00075] hover:text-[#e00075] transition-colors"
                aria-label="Follow Kusum on Instagram"
              >
                <InstagramIcon className="h-5 w-5 text-[#e00075]" />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/share/197xSpQNnJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-xs font-semibold uppercase tracking-wider text-foreground hover:border-[#e00075] hover:text-[#e00075] transition-colors"
                aria-label="Follow Kusum on Facebook"
              >
                <FacebookIcon className="h-5 w-5 text-[#e00075]" />
                <span>Facebook</span>
              </a>
              <a
                href="https://youtube.com/@kusumthepremiumdesignerwea-v5v?si=Hv1jcbiTJPztlOZd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-xs font-semibold uppercase tracking-wider text-foreground hover:border-[#e00075] hover:text-[#e00075] transition-colors"
                aria-label="Subscribe to Kusum on YouTube"
              >
                <YoutubeIcon className="h-5 w-5 text-[#e00075]" />
                <span>YouTube</span>
              </a>
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted transition-colors hover:text-[#e00075]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border/80">
          <div className="mx-auto flex max-w-[1536px] flex-col items-start justify-between gap-4 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:px-8 xl:px-12">
            <p>© {new Date().getFullYear()} KUSUM — The Premium Designer Wear. All rights reserved.</p>
            <div className="flex items-center gap-2" aria-label="Payment methods">
              <CreditCard className="h-4 w-4 text-muted" />
              <span className="text-[11px]">Visa · Mastercard · Apple Pay · Tabby · PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

