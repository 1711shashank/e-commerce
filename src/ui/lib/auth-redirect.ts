const DEFAULT_NEXT = "/";

export function sanitizeNextPath(
  next: string | null | undefined,
  fallback = DEFAULT_NEXT,
): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  if (next.startsWith("/admin")) return fallback;
  if (next.startsWith("/login") || next.startsWith("/signup")) return fallback;
  if (next.startsWith("/verify-email")) return fallback;
  if (next.startsWith("/forgot-password") || next.startsWith("/reset-password")) {
    return fallback;
  }

  try {
    const url = new URL(next, "http://localhost");
    return url.pathname + url.search;
  } catch {
    return fallback;
  }
}

export function buildLoginUrl(nextPath?: string): string {
  const next = sanitizeNextPath(nextPath);
  if (next === DEFAULT_NEXT) return "/login";
  return `/login?next=${encodeURIComponent(next)}`;
}

export function buildSignupUrl(nextPath?: string): string {
  const next = sanitizeNextPath(nextPath);
  if (next === DEFAULT_NEXT) return "/signup";
  return `/signup?next=${encodeURIComponent(next)}`;
}

export function buildVerifyEmailUrl(
  email: string,
  nextPath?: string,
): string {
  const params = new URLSearchParams();
  params.set("email", email.trim());
  const next = sanitizeNextPath(nextPath);
  if (next !== DEFAULT_NEXT) {
    params.set("next", next);
  }
  return `/verify-email?${params.toString()}`;
}
