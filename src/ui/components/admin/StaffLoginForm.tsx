"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export function StaffLoginForm({
  nextPath = "/admin",
  title = "Staff login",
}: {
  nextPath?: string;
  title?: string;
}) {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin");  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? "Invalid email or password."
            : err.message,
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
        Internal access
      </p>
      <h1 className="mt-2 font-display text-4xl">{title}</h1>
      <p className="mt-3 text-sm text-muted">
        Sign in with a staff account to manage the catalog. Login is required.
      </p>

      <form className="mt-10 space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
            htmlFor="staff-email"
          >
            Email
          </label>
          <input
            id="staff-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-12 w-full border border-border bg-surface px-4 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label
            className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted"
            htmlFor="staff-password"
          >
            Password
          </label>
          <input
            id="staff-password"
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

      <p className="mt-8 text-xs leading-relaxed text-muted">
        Local admin (seeded by auth-service):
        <br />
        <span className="font-medium text-foreground">admin@gmail.com</span> /{" "}
        <span className="font-medium text-foreground">admin</span>
      </p>
    </div>
  );
}
