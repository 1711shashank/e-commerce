"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import { confirmPasswordReset } from "@/lib/password-reset-api";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() || null;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token && typeof window !== "undefined") {
      window.history.replaceState({}, "", "/reset-password");
    }
  }, [token]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
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
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          getApiErrorMessage(err, "token") ||
            getApiErrorMessage(err, "new_password") ||
            getApiErrorMessage(err),
        );
      } else {
        setError("Could not reset password. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-5 py-10 sm:px-8 lg:py-16">
        <h1 className="font-display text-4xl">Invalid reset link</h1>
        <p className="mt-3 text-sm text-muted">
          This reset link is invalid or incomplete. Request a new one to
          continue.
        </p>
        <Link
          href="/forgot-password"
          className="mt-8 inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md px-5 py-10 sm:px-8 lg:py-16">
        <h1 className="font-display text-4xl">Password updated</h1>
        <p className="mt-3 border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
          Your password has been reset. You can sign in with your new password.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
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
            htmlFor="reset-new-password"
          >
            New password
          </label>
          <input
            id="reset-new-password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            value={newPassword}
            onChange={(e) => {
              setError(null);
              setNewPassword(e.target.value);
            }}
            className="min-h-12 w-full border border-border bg-surface px-4 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label
            className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
            htmlFor="reset-confirm-password"
          >
            Confirm new password
          </label>
          <input
            id="reset-confirm-password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            value={confirmPassword}
            onChange={(e) => {
              setError(null);
              setConfirmPassword(e.target.value);
            }}
            className="min-h-12 w-full border border-border bg-surface px-4 text-sm outline-none focus:border-accent"
          />
        </div>
        {error && (
          <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
            {error}
            {error.toLowerCase().includes("invalid") ||
            error.toLowerCase().includes("expired") ? (
              <>
                {" "}
                <Link
                  href="/forgot-password"
                  className="font-medium underline-offset-4 hover:underline"
                >
                  Request a new link
                </Link>
              </>
            ) : null}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
