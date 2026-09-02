"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";

export function RequireCustomerSession({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = usePersistHydrated(useCustomerAuthStore.persist);
  const access = useCustomerAuthStore((s) => s.access);
  const user = useCustomerAuthStore((s) => s.user);

  const isCustomer = Boolean(access && user?.role === "customer");

  useEffect(() => {
    if (!hydrated) return;
    if (!isCustomer) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, isCustomer, router, pathname]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-sm text-muted">
        Checking session…
      </div>
    );
  }

  if (!isCustomer) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-sm text-muted">
        Redirecting to sign in…
      </div>
    );
  }

  return <>{children}</>;
}
