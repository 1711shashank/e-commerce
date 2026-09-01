"use client";

import Link from "next/link";
import { ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { buildLoginUrl, buildSignupUrl } from "@/lib/auth-redirect";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { useStore } from "@/lib/store";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";
import type { Category } from "@/lib/types";

const links = [
  { href: "/collections/women", label: "Women" },
  { href: "/collections/men", label: "Men" },
  { href: "/collections/kids", label: "Kids" },
  { href: "/collections/unstitched", label: "Unstitched" },
  { href: "/collections/ready-to-wear", label: "Ready to Wear" },
  { href: "/collections/sale", label: "Sale" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav({
  categories,
}: {
  categories: Category[];
}) {
  const { isMobileNavOpen, closeMobileNav } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const authHydrated = usePersistHydrated(useCustomerAuthStore.persist);
  const access = useCustomerAuthStore((s) => s.access);
  const user = useCustomerAuthStore((s) => s.user);
  const logout = useCustomerAuthStore((s) => s.logout);
  const isCustomerLoggedIn =
    authHydrated && Boolean(access && user?.role === "customer");

  const parents = categories.filter((c) => !c.parentId);

  return (
    <Drawer
      open={isMobileNavOpen}
      onClose={closeMobileNav}
      title="Menu"
      side="left"
    >
      <nav className="px-2 py-4">
        <ul>
          {parents.map((cat) => {
            const subs = categories.filter((c) => c.parentId === cat.id);
            const isOpen = openId === cat.id;
            return (
              <li key={cat.id} className="border-b border-border">
                <div className="flex items-center">
                  <Link
                    href={`/collections/${cat.slug}`}
                    onClick={closeMobileNav}
                    className="flex min-h-12 flex-1 items-center px-3 text-sm uppercase tracking-[0.1em]"
                  >
                    {cat.name}
                  </Link>
                  {subs.length > 0 && (
                    <button
                      type="button"
                      className="flex h-12 w-12 items-center justify-center"
                      onClick={() => setOpenId(isOpen ? null : cat.id)}
                      aria-expanded={isOpen}
                      aria-label={`Toggle ${cat.name} subcategories`}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
                {isOpen && subs.length > 0 && (
                  <ul className="bg-background/80 pb-2">
                    {subs.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/collections/${cat.slug}?sub=${sub.slug}`}
                          onClick={closeMobileNav}
                          className="flex min-h-11 items-center px-6 text-sm text-muted hover:text-foreground"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          {links
            .filter(
              (l) =>
                !parents.some((p) => l.href === `/collections/${p.slug}`),
            )
            .map((link) => (
              <li key={link.href} className="border-b border-border">
                <Link
                  href={link.href}
                  onClick={closeMobileNav}
                  className="flex min-h-12 items-center px-3 text-sm uppercase tracking-[0.1em]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
        </ul>
        <div className="mt-4 border-t border-border px-3 py-4">
          {isCustomerLoggedIn ? (
            <div className="space-y-3">
              <p className="text-xs text-muted truncate">{user?.email}</p>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  closeMobileNav();
                }}
                className="flex min-h-12 w-full items-center gap-2 text-sm uppercase tracking-[0.1em]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href={buildLoginUrl()}
                onClick={closeMobileNav}
                className="flex min-h-12 items-center text-sm uppercase tracking-[0.1em]"
              >
                Sign in
              </Link>
              <Link
                href={buildSignupUrl()}
                onClick={closeMobileNav}
                className="flex min-h-12 items-center text-sm uppercase tracking-[0.1em]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </Drawer>
  );
}
