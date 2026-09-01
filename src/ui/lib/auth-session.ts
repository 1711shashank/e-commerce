type SessionExpiredHandler = () => void;

let handler: SessionExpiredHandler | null = null;
let redirecting = false;

export function registerSessionExpiredHandler(fn: SessionExpiredHandler) {
  handler = fn;
}

export function isSessionExpiredError(status: number, detail: string): boolean {
  if (status !== 401 && status !== 403) return false;
  return detail.toLowerCase().includes("token has expired");
}

export function notifySessionExpired(): void {
  if (typeof window === "undefined" || redirecting) return;
  redirecting = true;
  handler?.();
}

export function redirectToAdminLogin(): void {
  const path = window.location.pathname + window.location.search;
  const loginUrl = path.startsWith("/admin/login")
    ? "/admin/login"
    : `/admin/login?next=${encodeURIComponent(path)}`;
  window.location.href = loginUrl;
}
