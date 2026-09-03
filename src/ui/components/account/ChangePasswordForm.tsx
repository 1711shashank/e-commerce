"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClassName } from "@/components/account/form-styles";
import { FormLabel } from "@/components/account/FormLabel";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import { redirectToCustomerLogin } from "@/lib/auth-session";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { changePassword } from "@/lib/profile-api";

export function ChangePasswordForm() {
  const access = useCustomerAuthStore((s) => s.access);
  const clearSession = useCustomerAuthStore((s) => s.clearSession);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearFeedback = () => {
    setSuccess(null);
    setError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!access) return;
    setError(null);
    setSuccess(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(access, currentPassword, newPassword);
      setSuccess("Password updated. Please sign in again.");
      clearSession();
      window.setTimeout(() => redirectToCustomerLogin("/account/password"), 800);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? getApiErrorMessage(err, "current_password") ||
              getApiErrorMessage(err, "new_password") ||
              getApiErrorMessage(err)
          : "Could not update password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <p className="text-sm text-muted">
        Choose a strong password you don&apos;t use elsewhere.
      </p>
      <div>
        <FormLabel htmlFor="current-password" required>
          Current password
        </FormLabel>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => {
            clearFeedback();
            setCurrentPassword(e.target.value);
          }}
          required
          className={inputClassName}
        />
      </div>
      <div>
        <FormLabel htmlFor="new-password" required>
          New password
        </FormLabel>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={newPassword}
          onChange={(e) => {
            clearFeedback();
            setNewPassword(e.target.value);
          }}
          required
          className={inputClassName}
        />
      </div>
      <div>
        <FormLabel htmlFor="confirm-password" required>
          Confirm new password
        </FormLabel>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={confirmPassword}
          onChange={(e) => {
            clearFeedback();
            setConfirmPassword(e.target.value);
          }}
          required
          className={inputClassName}
        />
      </div>
      {error && (
        <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
          {error}
        </p>
      )}
      {success && (
        <p className="border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
          {success}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
