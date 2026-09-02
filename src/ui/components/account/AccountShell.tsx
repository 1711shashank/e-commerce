"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { cn } from "@/lib/utils";
import { AccountSidebar } from "./AccountSidebar";

type AccountShellProps = {
  title: string;
  breadcrumbLabel: string;
  children: React.ReactNode;
};

export function AccountShell({
  title,
  breadcrumbLabel,
  children,
}: AccountShellProps) {
  const user = useCustomerAuthStore((s) => s.user);

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: breadcrumbLabel },
        ]}
      />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:w-64 xl:w-72">
          <div className="border border-border bg-surface p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <User className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted">Hello,</p>
                <p className="truncate font-medium">{displayName}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 border border-border bg-surface">
            <AccountSidebar />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="border border-border bg-surface p-5 sm:p-8">
            <h1 className="font-display text-3xl">{title}</h1>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountSidebarLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block px-5 py-3 text-sm transition-colors",
        active
          ? "bg-accent/8 font-medium text-accent"
          : "text-foreground hover:bg-background",
      )}
    >
      {label}
    </Link>
  );
}
