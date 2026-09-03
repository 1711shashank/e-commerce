"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { sanitizeNextPath } from "@/lib/auth-redirect";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeNextPath(searchParams.get("next"));
  const email = searchParams.get("email")?.trim() ?? "";
  const hydrated = usePersistHydrated(useCustomerAuthStore.persist);
  const access = useCustomerAuthStore((s) => s.access);
  const user = useCustomerAuthStore((s) => s.user);

  const isCustomer = Boolean(access && user?.role === "customer");

  useEffect(() => {
    if (!hydrated || !isCustomer) return;
    router.replace(next);
  }, [hydrated, isCustomer, router, next]);

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
        Already signed in — redirecting…
      </div>
    );
  }

  return <VerifyEmailForm initialEmail={email} nextPath={next} />;
}
