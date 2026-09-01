import { isSessionExpiredError, notifySessionExpired } from "@/lib/auth-session";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH ?? "/api";
const CATALOG_SERVICE_URL = (process.env.CATALOG_SERVICE_URL ?? "").replace(
  /\/$/,
  "",
);

export function getApiBase(): string {
  if (typeof window === "undefined" && CATALOG_SERVICE_URL) {
    return `${CATALOG_SERVICE_URL}${API_BASE_PATH}`;
  }
  if (API_URL) return `${API_URL}${API_BASE_PATH}`;
  return API_BASE_PATH;
}

function getRequestBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (CATALOG_SERVICE_URL) {
    return CATALOG_SERVICE_URL;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  params?: Record<string, string | number | boolean | undefined | null>;
  skipSessionExpiry?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token, params, skipSessionExpiry } = options;
  const url = new URL(
    `${getApiBase()}${path.startsWith("/") ? path : `/${path}`}`,
    getRequestBaseUrl(),
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data &&
      "detail" in data &&
      typeof (data as { detail: unknown }).detail === "string"
        ? (data as { detail: string }).detail
        : `Request failed (${res.status})`;
    if (token && !skipSessionExpiry && isSessionExpiredError(res.status, message)) {
      notifySessionExpired();
    }
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}
