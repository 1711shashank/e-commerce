"use client";

import { Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { AccountSidebarLink } from "./AccountShell";

const settingsLinks = [
  { href: "/account", label: "Profile information", exact: true },
  { href: "/account/password", label: "Change password", exact: true },
  { href: "/account/addresses", label: "Saved addresses", exact: false },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav>
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Settings className="h-4 w-4 text-accent" />
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Account settings
        </span>
      </div>
      <ul>
        {settingsLinks.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <AccountSidebarLink
                href={link.href}
                label={link.label}
                active={active}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
