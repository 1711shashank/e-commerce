export function getStoreOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
}

export function getAdminOrigin(): string {
  return (process.env.NEXT_PUBLIC_ADMIN_URL || "").replace(/\/$/, "");
}

export function storeProductUrl(slug: string): string {
  const origin = getStoreOrigin();
  const path = `/products/${slug}`;
  return origin ? `${origin}${path}` : path;
}
