"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import { requestPasswordReset } from "@/lib/password-reset-api";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const detail = await requestPasswordReset(email);
      setSuccess(detail);
      setEmail("");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(getApiErrorMessage(err, "email") || getApiErrorMessage(err));
      } else {
        setError("Could not send reset link. Try again later.");
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
      <h1 className="mt-2 font-display text-4xl">Reset your password</h1>
      <p className="mt-3 text-sm text-muted">
        Enter your email and we&apos;ll send you a link to choose a new
        password.
      </p>

      {success ? (
        <div className="mt-10 space-y-6">
          <p className="border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
            {success}
          </p>
          <p className="text-sm text-muted">
            Didn&apos;t get it? Check spam or{" "}
            <button
              type="button"
              className="font-medium text-foreground underline-offset-4 hover:underline"
              onClick={() => setSuccess(null)}
            >
              try again
            </button>
            .
          </p>
          <Link
            href="/login"
            className="inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="mt-10 space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
              htmlFor="reset-email"
            >
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-12 w-full border border-border bg-surface px-4 text-sm outline-none focus:border-accent"
            />
          </div>
          {error && (
            <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}

      {!success && (
        <p className="mt-8 text-sm text-muted">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
