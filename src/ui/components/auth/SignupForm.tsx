"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import { buildLoginUrl, buildVerifyEmailUrl } from "@/lib/auth-redirect";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";

export function SignupForm({
  nextPath = "/",
}: {
  nextPath?: string;
}) {
  const router = useRouter();
  const register = useCustomerAuthStore((s) => s.register);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const registeredEmail = await register(
        email.trim(),
        password,
        firstName.trim(),
        lastName.trim(),
      );
      router.replace(buildVerifyEmailUrl(registeredEmail, nextPath));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          getApiErrorMessage(err, "email") ||
            getApiErrorMessage(err, "password") ||
            getApiErrorMessage(err),
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Sign up failed. Start the auth service (port 8001) and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-10 sm:px-8 lg:py-16">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">
        Join Aurelia
      </p>
      <h1 className="mt-2 font-display text-4xl">Create account</h1>
      <p className="mt-3 text-sm text-muted">
        Sign up to checkout and keep track of your orders.
      </p>

      <form className="mt-10 space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
              htmlFor="signup-first-name"
            >
              First name
            </label>
            <input
              id="signup-first-name"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="min-h-12 w-full border border-border bg-surface px-4 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label
              className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
              htmlFor="signup-last-name"
            >
              Last name
            </label>
            <input
              id="signup-last-name"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="min-h-12 w-full border border-border bg-surface px-4 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>
        <div>
          <label
            className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
            htmlFor="signup-email"
          >
            Email
          </label>
          <input
            id="signup-email"
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
            htmlFor="signup-password"
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-12 w-full border border-border bg-surface px-4 text-sm outline-none focus:border-accent"
          />
          <p className="mt-1 text-xs text-muted">At least 8 characters</p>
        </div>
        <div>
          <label
            className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
            htmlFor="signup-confirm-password"
          >
            Confirm password
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="min-h-12 w-full border border-border bg-surface px-4 text-sm outline-none focus:border-accent"
          />
        </div>
        {error && (
          <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={buildLoginUrl(nextPath)}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
