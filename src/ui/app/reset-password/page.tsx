import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Aurelia account.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-5 py-16 text-sm text-muted">
          Loading…
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
