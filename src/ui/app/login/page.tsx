import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Aurelia account to checkout.",
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
      <LoginClient />
    </Suspense>
  );
}
