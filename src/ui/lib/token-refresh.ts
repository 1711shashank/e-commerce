"use client";

export type AuthScope = "staff" | "customer";

type TokenSession = {
  getRefresh: () => string | null;
  setTokens: (access: string, refresh: string) => void;
};

const sessions: Partial<Record<AuthScope, TokenSession>> = {};
const inflight: Partial<Record<AuthScope, Promise<string | null>>> = {};

function resolveScope(): AuthScope {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return "staff";
  }
  return "customer";
}

function refreshEndpoint(): string {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  const basePath = process.env.NEXT_PUBLIC_API_BASE_PATH ?? "/api";
  const apiBase = apiUrl ? `${apiUrl}${basePath}` : basePath;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(`${apiBase}/auth/token/refresh/`, origin).toString();
}

export function registerTokenSession(scope: AuthScope, session: TokenSession): void {
  sessions[scope] = session;
}

export async function refreshAccessToken(
  scope: AuthScope = resolveScope(),
): Promise<string | null> {
  const existing = inflight[scope];
  if (existing) return existing;

  const promise = (async () => {
    const session = sessions[scope];
    const refresh = session?.getRefresh() ?? null;
    if (!refresh || !session) return null;

    try {
      const res = await fetch(refreshEndpoint(), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { access?: string; refresh?: string };
      if (!data.access) return null;
      const nextRefresh = data.refresh ?? refresh;
      session.setTokens(data.access, nextRefresh);
      return data.access;
    } catch {
      return null;
    } finally {
      delete inflight[scope];
    }
  })();

  inflight[scope] = promise;
  return promise;
}
