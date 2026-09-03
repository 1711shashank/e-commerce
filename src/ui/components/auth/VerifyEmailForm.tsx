"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import { buildLoginUrl } from "@/lib/auth-redirect";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailForm({
  initialEmail = "",
  nextPath = "/",
}: {
  initialEmail?: string;
  nextPath?: string;
}) {
  const router = useRouter();
  const verifyEmail = useCustomerAuthStore((s) => s.verifyEmail);
  const resendVerificationOtp = useCustomerAuthStore(
    (s) => s.resendVerificationOtp,
  );

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.replace(/\s/g, "");
    if (!trimmedEmail) {
      setError("Enter the email you signed up with.");
      return;
    }
    if (!/^\d{4,8}$/.test(trimmedOtp)) {
      setError("Enter the verification code from your email.");
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(trimmedEmail, trimmedOtp);
      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Too many attempts. Please try again later.");
      } else if (err instanceof ApiError) {
        setError(
          getApiErrorMessage(err, "otp") ||
            getApiErrorMessage(err, "email") ||
            getApiErrorMessage(err),
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Could not verify email. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError(null);
    setInfo(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Enter the email you signed up with.");
      return;
    }
    if (cooldown > 0) return;

    setResending(true);
    try {
      await resendVerificationOtp(trimmedEmail);
      setInfo("If that email needs verification, a new code has been sent.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Too many requests. Please try again later.");
      } else {
        setError(
          err instanceof ApiError
            ? getApiErrorMessage(err)
            : "Could not resend code. Try again.",
        );
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-10 sm:px-8 lg:py-16">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">
        Join Aurelia
      </p>
      <h1 className="mt-2 font-display text-4xl">Verify email</h1>
      <p className="mt-3 text-sm text-muted">
        Enter the code we sent to your email to finish creating your account.
      </p>

      <form className="mt-10 space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
            htmlFor="verify-email"
          >
            Email
          </label>
          <input
            id="verify-email"
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
            htmlFor="verify-otp"
          >
            Verification code
          </label>
          <input
            id="verify-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={8}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ""))}
            className="min-h-12 w-full border border-border bg-surface px-4 text-sm tracking-[0.2em] outline-none focus:border-accent"
            placeholder="000000"
          />
        </div>
        {error && (
          <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
            {error}
          </p>
        )}
        {info && (
          <p className="border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
            {info}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying…" : "Verify email"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Didn&apos;t get a code?{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={resending || cooldown > 0}
          className="font-medium text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resending
            ? "Sending…"
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend code"}
        </button>
      </p>

      <p className="mt-8 text-sm text-muted">
        <Link
          href={buildLoginUrl(nextPath)}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
