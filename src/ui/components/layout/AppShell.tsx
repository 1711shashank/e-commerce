"use client";

import { usePathname } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SiteShell } from "@/components/layout/SiteShell";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isPortal) {
    return <AdminShell>{children}</AdminShell>;
  }

  return <SiteShell>{children}</SiteShell>;
}
