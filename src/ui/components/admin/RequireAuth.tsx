"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StaffLoginForm } from "@/components/admin/StaffLoginForm";
import { useAuthStore } from "@/lib/auth-store";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = usePersistHydrated(useAuthStore.persist);
  const access = useAuthStore((s) => s.access);
  const user = useAuthStore((s) => s.user);
  const staff = user?.role === "staff" || user?.role === "admin";
  const onLoginPage = pathname.startsWith("/admin/login");

  useEffect(() => {
    if (!hydrated) return;
    if ((!access || !staff) && !onLoginPage && pathname !== "/admin") {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, access, staff, router, pathname, onLoginPage]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-sm text-muted">
        Checking session…
      </div>
    );
  }

  if (!access || !staff) {
    if (onLoginPage) return null;
    return <StaffLoginForm nextPath={pathname || "/admin"} />;
  }

  return <>{children}</>;
}
