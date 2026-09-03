"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const [token] = useState(() => searchParams.get("token")?.trim() ?? "");

  useEffect(() => {
    if (token) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [token]);

  return <ResetPasswordForm initialToken={token} />;
}
