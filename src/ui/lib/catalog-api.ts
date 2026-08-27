"use client";

import { apiRequest, getApiBase, ApiError } from "@/lib/api";
import type { Product, ProductVariant } from "@/lib/types";

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ProductPayload = {
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  discountPrice?: number | null;
  images: string[];
  colorImages: Record<string, string[]>;
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
  fabric?: string;
  description: string;
  isNew?: boolean;
  isOnSale?: boolean;
  tags?: string[];
};

export async function listPortalProducts(token: string): Promise<Product[]> {
  const data = await apiRequest<Paginated<Product> | Product[]>("/products/", {
    token,
    params: { mine: true, page_size: 100 },
  });
  return Array.isArray(data) ? data : data.results;
}

export async function listPublicDbProducts(): Promise<Product[]> {
  try {
    const data = await apiRequest<Paginated<Product> | Product[]>("/products/", {
      params: { page_size: 100 },
    });
    return Array.isArray(data) ? data : data.results;
  } catch {
    return [];
  }
}

export async function getPortalProduct(
  id: string,
  token: string,
): Promise<Product> {
  return apiRequest<Product>(`/products/${id}/`, { token });
}

export async function createProduct(
  payload: ProductPayload,
  token: string,
): Promise<Product> {
  return apiRequest<Product>("/products/", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function updateProduct(
  id: string,
  payload: ProductPayload,
  token: string,
): Promise<Product> {
  return apiRequest<Product>(`/products/${id}/`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function deleteProduct(id: string, token: string): Promise<void> {
  await apiRequest<void>(`/products/${id}/`, {
    method: "DELETE",
    token,
  });
}

export async function uploadProductImage(
  file: File,
  token: string,
): Promise<string> {
  const url = new URL(
    `${getApiBase()}/products/upload-image/`,
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
