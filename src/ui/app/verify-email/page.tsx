import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your Aurelia account email with a one-time code.",
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
      <VerifyEmailClient />
    </Suspense>
  );
}
