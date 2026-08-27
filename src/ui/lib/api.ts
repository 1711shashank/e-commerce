const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH ?? "/api";

export function getApiBase(): string {
  if (API_URL) return `${API_URL}${API_BASE_PATH}`;
  return API_BASE_PATH;
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
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token, params } = options;
  const url = new URL(
    `${getApiBase()}${path.startsWith("/") ? path : `/${path}`}`,
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
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
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}
