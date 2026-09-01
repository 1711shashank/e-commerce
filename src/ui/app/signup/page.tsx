import type { Metadata } from "next";
import { Suspense } from "react";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an Aurelia account to checkout and shop.",
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
      <SignupClient />
    </Suspense>
  );
}
