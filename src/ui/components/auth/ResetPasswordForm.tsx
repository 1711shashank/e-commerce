"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import { confirmPasswordReset } from "@/lib/password-reset-api";

export function ResetPasswordForm({ initialToken }: { initialToken?: string }) {
  const token = initialToken?.trim() ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(token, newPassword);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(
          err instanceof ApiError
            ? getApiErrorMessage(err, "token") ||
                getApiErrorMessage(err, "new_password") ||
                getApiErrorMessage(err)
            : "Could not reset password.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token && !success) {
    return (
      <div className="mx-auto max-w-md px-5 py-10 sm:px-8 lg:py-16">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          Your account
        </p>
        <h1 className="mt-2 font-display text-4xl">Invalid link</h1>
        <p className="mt-3 text-sm text-muted">
          This reset link is invalid or has expired. Request a new one to
          continue.
        </p>
        <p className="mt-8">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Request a new reset link
          </Link>
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md px-5 py-10 sm:px-8 lg:py-16">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          Your account
        </p>
        <h1 className="mt-2 font-display text-4xl">Password updated</h1>
        <p className="mt-6 border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
          Your password has been reset. You can sign in with your new password.
        </p>
        <p className="mt-8">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-10 sm:px-8 lg:py-16">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">
        Your account
      </p>
      <h1 className="mt-2 font-display text-4xl">Choose a new password</h1>
      <p className="mt-3 text-sm text-muted">
        Enter a strong password you don&apos;t use elsewhere.
      </p>

      <form className="mt-10 space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
            htmlFor="new-password"
          >
            New password
          </label>
          <input
            id="new-password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="min-h-12 w-full border border-border bg-surface px-4 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label
            className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
            htmlFor="confirm-password"
          >
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
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
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted">
        <Link
          href="/forgot-password"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Request a new link
        </Link>
      </p>
    </div>
  );
}
