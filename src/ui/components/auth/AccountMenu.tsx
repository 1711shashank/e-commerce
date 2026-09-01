"use client";

import { LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";
import { cn } from "@/lib/utils";

export function AccountMenu() {
  const router = useRouter();
  const hydrated = usePersistHydrated(useCustomerAuthStore.persist);
  const user = useCustomerAuthStore((s) => s.user);
  const access = useCustomerAuthStore((s) => s.access);
  const logout = useCustomerAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const isLoggedIn =
    hydrated && Boolean(access && user?.role === "customer");

  if (!isLoggedIn) return null;

  const displayName =
    user?.first_name?.trim() || user?.email?.split("@")[0] || "Account";

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    if (window.location.pathname === "/checkout") {
      router.replace("/login?next=%2Fcheckout");
    } else {
      router.refresh();
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 items-center gap-1.5 px-2 text-xs uppercase tracking-[0.12em] hover:text-accent"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        <User className="h-5 w-5" />
        <span className="hidden xl:inline max-w-[120px] truncate">
          {displayName}
        </span>
      </button>
      <div
        className={cn(
          "absolute right-0 top-full z-50 min-w-[200px] border border-border bg-surface py-2 shadow-lg",
          open ? "block" : "hidden",
        )}
      >
        <p className="px-4 py-2 text-xs text-muted truncate">{user?.email}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-background"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
