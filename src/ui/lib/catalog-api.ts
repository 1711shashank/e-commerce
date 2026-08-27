"use client";

import { apiRequest } from "@/lib/api";
import type { Product } from "@/lib/types";

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
  sizes: string[];
  colors: string[];
  fabric?: string;
  description: string;
  isNew?: boolean;
  isOnSale?: boolean;
  inStock?: boolean;
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
