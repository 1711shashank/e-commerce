"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Products", exact: true },
  { href: "/admin/products/new", label: "Add product" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hydrated = usePersistHydrated(useAuthStore.persist);
  const user = useAuthStore((s) => s.user);
  const access = useAuthStore((s) => s.access);
  const logout = useAuthStore((s) => s.logout);
  const isLogin = pathname.startsWith("/admin/login");
  const staff =
    hydrated &&
    !!access &&
    (user?.role === "staff" || user?.role === "admin");

  return (
    <div className="flex min-h-full flex-col bg-[color-mix(in_srgb,var(--background)_92%,var(--accent)_8%)]">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-6">
            <Link
              href={staff ? "/admin" : "/admin/login"}
              className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-foreground"
            >
              Aurelia Staff
            </Link>
            {staff && (
              <nav aria-label="Portal" className="hidden sm:block">
                <ul className="flex items-center gap-1">
                  {nav.map((item) => {
                    const active = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex min-h-11 items-center px-3 text-sm transition-colors",
                            active
                              ? "text-foreground"
                              : "text-muted hover:text-foreground",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </div>

          {hydrated && staff && (
            <div className="flex items-center gap-3">
              <span className="hidden truncate text-xs text-muted sm:inline">
                {user?.email}
              </span>
              <button
                type="button"
                onClick={() =>
                  void logout().then(() => {
                    window.location.href = "/admin/login";
                  })
                }
                className="min-h-11 px-3 text-sm text-muted hover:text-foreground"
              >
                Log out
              </button>
            </div>
          )}

          {hydrated && !staff && !isLogin && (
            <Link
              href="/admin/login"
              className="inline-flex min-h-11 items-center bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-surface/80 py-4 text-center text-xs text-muted">
        Internal catalog tools · login required · not part of the public store
      </footer>
    </div>
  );
}
