"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StaffLoginForm } from "@/components/admin/StaffLoginForm";
import { useAuthStore } from "@/lib/auth-store";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const hydrated = usePersistHydrated(useAuthStore.persist);
  const access = useAuthStore((s) => s.access);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated) return;
    if (access && (user?.role === "staff" || user?.role === "admin")) {
      router.replace(next);
    }
  }, [hydrated, access, user, router, next]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-sm text-muted">
        Loading…
      </div>
    );
  }

  if (access && (user?.role === "staff" || user?.role === "admin")) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-sm text-muted">
        Already signed in — redirecting…
      </div>
    );
  }

  return <StaffLoginForm nextPath={next} />;
}
