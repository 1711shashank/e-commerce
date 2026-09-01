import { isSessionExpiredError, notifySessionExpired } from "@/lib/auth-session";
import { apiRequest, getApiBase, ApiError } from "@/lib/api";
import type { Banner } from "@/lib/types";

export type BannerPayload = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt?: string;
  sortOrder?: number;
  isActive?: boolean;
  textColor?: "light" | "dark";
};

export async function fetchPublicBanners(): Promise<Banner[]> {
  const data = await apiRequest<Banner[]>("/banners/");
  return Array.isArray(data) ? data : [];
}

export async function listAllBanners(token: string): Promise<Banner[]> {
  const data = await apiRequest<Banner[]>("/banners/", {
    token,
    params: { all: true },
  });
  return Array.isArray(data) ? data : [];
}

export async function getBanner(id: string, token: string): Promise<Banner> {
  return apiRequest<Banner>(`/banners/${id}/`, { token });
}

export async function createBanner(
  payload: BannerPayload,
  token: string,
): Promise<Banner> {
  return apiRequest<Banner>("/banners/", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function updateBanner(
  id: string,
  payload: BannerPayload,
  token: string,
): Promise<Banner> {
  return apiRequest<Banner>(`/banners/${id}/`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function deleteBanner(id: string, token: string): Promise<void> {
  await apiRequest<void>(`/banners/${id}/`, {
    method: "DELETE",
    token,
  });
}

export async function reorderBanners(
  ids: string[],
  token: string,
): Promise<Banner[]> {
  return apiRequest<Banner[]>("/banners/reorder/", {
    method: "POST",
    token,
    body: { ids },
  });
}

export async function uploadBannerImage(
  file: File,
  token: string,
): Promise<string> {
  const url = new URL(
    `${getApiBase()}/banners/upload-image/`,
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  );

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    cache: "no-store",
  });

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
        : `Upload failed (${res.status})`;
    if (isSessionExpiredError(res.status, message)) {
      notifySessionExpired();
    }
    throw new ApiError(message, res.status, data);
  }

  const imageUrl =
    typeof data === "object" &&
    data &&
    "url" in data &&
    typeof (data as { url: unknown }).url === "string"
      ? (data as { url: string }).url
      : null;

  if (!imageUrl) {
    throw new ApiError("Upload did not return an image URL.", res.status, data);
  }

  return imageUrl;
}
