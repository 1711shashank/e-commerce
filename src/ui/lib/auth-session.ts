type SessionExpiredHandler = () => void;

let staffHandler: SessionExpiredHandler | null = null;
let customerHandler: SessionExpiredHandler | null = null;
let redirecting = false;

export function registerSessionExpiredHandler(fn: SessionExpiredHandler) {
  staffHandler = fn;
}

export function registerCustomerSessionExpiredHandler(fn: SessionExpiredHandler) {
  customerHandler = fn;
}

export function isSessionExpiredError(status: number, detail: string): boolean {
  if (status !== 401 && status !== 403) return false;
  return detail.toLowerCase().includes("token has expired");
}

export function notifySessionExpired(): void {
  if (typeof window === "undefined" || redirecting) return;
  redirecting = true;
  const path = window.location.pathname;
  if (path.startsWith("/admin")) {
    staffHandler?.();
  } else {
    customerHandler?.();
  }
}

export function redirectToAdminLogin(): void {
  const path = window.location.pathname + window.location.search;
  const loginUrl = path.startsWith("/admin/login")
    ? "/admin/login"
    : `/admin/login?next=${encodeURIComponent(path)}`;
  window.location.href = loginUrl;
}

export function redirectToCustomerLogin(nextPath?: string): void {
  const path =
    nextPath ?? window.location.pathname + window.location.search;
  const loginUrl = path.startsWith("/login")
    ? "/login"
    : `/login?next=${encodeURIComponent(path)}`;
  window.location.href = loginUrl;
}
