"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;

  useEffect(() => {
    if (token && typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [token]);

  return <ResetPasswordForm initialToken={token} />;
}
