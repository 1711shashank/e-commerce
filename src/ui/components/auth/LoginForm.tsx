"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import { buildSignupUrl } from "@/lib/auth-redirect";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";

export function LoginForm({
  nextPath = "/",
  title = "Sign in",
}: {
  nextPath?: string;
  title?: string;
}) {
  const router = useRouter();
  const customerLogin = useCustomerAuthStore((s) => s.customerLogin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await customerLogin(email.trim(), password);
      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? "Invalid email or password."
            : getApiErrorMessage(err),
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Login failed. Start the auth service (port 8001) and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-10 sm:px-8 lg:py-16">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">
        Your account
      </p>
      <h1 className="mt-2 font-display text-4xl">{title}</h1>
      <p className="mt-3 text-sm text-muted">
        Sign in to checkout and manage your orders.
      </p>

      <form className="mt-10 space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
            htmlFor="customer-email"
          >
            Email
          </label>
          <input
            id="customer-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-12 w-full border border-border bg-surface px-4 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label
            className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
            htmlFor="customer-password"
          >
            Password
          </label>
          <input
            id="customer-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-12 w-full border border-border bg-surface px-4 text-sm outline-none focus:border-accent"
          />
        </div>
        {error && (
          <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={buildSignupUrl(nextPath)}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
