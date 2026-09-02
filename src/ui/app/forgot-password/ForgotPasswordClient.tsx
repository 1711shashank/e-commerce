"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";

export default function ForgotPasswordClient() {
  const router = useRouter();
  const hydrated = usePersistHydrated(useCustomerAuthStore.persist);
  const access = useCustomerAuthStore((s) => s.access);
  const user = useCustomerAuthStore((s) => s.user);
  const isCustomer = Boolean(access && user?.role === "customer");

  useEffect(() => {
    if (!hydrated || !isCustomer) return;
    router.replace("/account/password");
  }, [hydrated, isCustomer, router]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-sm text-muted">
        Loading…
      </div>
    );
  }

  if (isCustomer) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-sm text-muted">
        Redirecting to change password…
      </div>
    );
  }

  return <ForgotPasswordForm />;
}
