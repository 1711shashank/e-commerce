"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClassName } from "@/components/account/form-styles";
import { FormLabel } from "@/components/account/FormLabel";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { fetchProfile, updateProfile } from "@/lib/profile-api";
import { validateOptionalMobile } from "@/lib/validation";

export function ProfileForm() {
  const access = useCustomerAuthStore((s) => s.access);
  const user = useCustomerAuthStore((s) => s.user);
  const setUser = useCustomerAuthStore((s) => s.setUser);

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [mobile, setMobile] = useState(user?.mobile ?? "");
  const [profileFetching, setProfileFetching] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!access) return;
    setProfileFetching(true);
    setProfileLoadError(null);
    try {
      const profile = await fetchProfile(access);
      setUser(profile);
      setFirstName(profile.first_name ?? "");
      setLastName(profile.last_name ?? "");
      setMobile(profile.mobile ?? "");
    } catch {
      setProfileLoadError("Could not load your profile. Showing saved data.");
    } finally {
      setProfileFetching(false);
    }
  }, [access, setUser]);

  useEffect(() => {
    if (!access) return;
    let cancelled = false;
    fetchProfile(access)
      .then((profile) => {
        if (cancelled) return;
        setUser(profile);
        setFirstName(profile.first_name ?? "");
        setLastName(profile.last_name ?? "");
        setMobile(profile.mobile ?? "");
      })
      .catch(() => {
        if (!cancelled) {
          setProfileLoadError("Could not load your profile. Showing saved data.");
        }
      })
      .finally(() => {
        if (!cancelled) setProfileFetching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [access, setUser]);

  const profileUnchanged =
    firstName.trim() === (user?.first_name ?? "").trim() &&
    lastName.trim() === (user?.last_name ?? "").trim() &&
    mobile.trim() === (user?.mobile ?? "").trim();

  const clearProfileFeedback = () => {
    setProfileSuccess(null);
    setProfileError(null);
  };

  const onProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!access || profileUnchanged) return;

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedMobile = mobile.trim();

    if (!trimmedFirst) {
      setProfileError("First name is required.");
      setProfileSuccess(null);
      return;
    }

    const mobileError = validateOptionalMobile(trimmedMobile);
    if (mobileError) {
      setProfileError(mobileError);
      setProfileSuccess(null);
      return;
    }

    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const updated = await updateProfile(access, {
        first_name: trimmedFirst,
        last_name: trimmedLast,
        mobile: trimmedMobile,
      });
      setUser(updated);
      setProfileSuccess("Profile updated.");
    } catch (err) {
      setProfileError(
        err instanceof ApiError
          ? getApiErrorMessage(err, "mobile") || getApiErrorMessage(err)
          : "Could not update profile.",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  if (profileFetching) {
    return <p className="text-sm text-muted">Loading profile…</p>;
  }

  return (
    <div>
      {profileLoadError && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-border bg-surface px-4 py-3 text-sm">
          <p className="text-muted">{profileLoadError}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadProfile}
          >
            Retry
          </Button>
        </div>
      )}

      <form className="space-y-4" onSubmit={onProfileSubmit}>
        <div>
          <FormLabel htmlFor="profile-email">Email</FormLabel>
          <input
            id="profile-email"
            type="email"
            value={user?.email ?? ""}
            disabled
            className={`${inputClassName} cursor-not-allowed opacity-60`}
          />
          <p className="mt-1 text-xs text-muted">Email cannot be changed.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FormLabel htmlFor="profile-first-name" required>
              First name
            </FormLabel>
            <input
              id="profile-first-name"
              type="text"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => {
                clearProfileFeedback();
                setFirstName(e.target.value);
              }}
              className={inputClassName}
            />
          </div>
          <div>
            <FormLabel htmlFor="profile-last-name">Last name</FormLabel>
            <input
              id="profile-last-name"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => {
                clearProfileFeedback();
                setLastName(e.target.value);
              }}
              className={inputClassName}
            />
          </div>
        </div>
        <div>
          <FormLabel htmlFor="profile-mobile">Mobile number</FormLabel>
          <input
            id="profile-mobile"
            type="tel"
            autoComplete="tel"
            value={mobile}
            onChange={(e) => {
              clearProfileFeedback();
              setMobile(e.target.value);
            }}
            placeholder="+91 98765 43210"
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-muted">Optional. Used for order updates.</p>
        </div>
        {profileError && (
          <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
            {profileError}
          </p>
        )}
        {profileSuccess && (
          <p className="border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
            {profileSuccess}
          </p>
        )}
        <Button type="submit" disabled={profileLoading || profileUnchanged}>
          {profileLoading ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
