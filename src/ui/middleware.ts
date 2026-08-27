import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hostnameOf(hostHeader: string | null): string {
  if (!hostHeader) return "";
  return hostHeader.split(":")[0].toLowerCase();
}

function isStaticOrInternal(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

function isApi(pathname: string): boolean {
  return pathname === "/api" || pathname.startsWith("/api/");
}

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function middleware(request: NextRequest) {
  const adminHost = (process.env.ADMIN_HOST || "").toLowerCase().trim();
  const storeHosts = (process.env.STORE_HOSTS || "localhost,127.0.0.1,www.localhost")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  const adminUrl = (process.env.NEXT_PUBLIC_ADMIN_URL || "").replace(/\/$/, "");
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

  // Single-host local mode: no ADMIN_HOST configured → path /admin works as-is
  if (!adminHost) {
    return NextResponse.next();
  }

  const host = hostnameOf(request.headers.get("host"));
  const { pathname, search } = request.nextUrl;

  if (isStaticOrInternal(pathname) || isApi(pathname)) {
    return NextResponse.next();
  }

  const onAdminHost = host === adminHost;
  const onStoreHost = storeHosts.includes(host) || (!onAdminHost && host !== adminHost);

  if (onAdminHost) {
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    if (!isAdminPath(pathname)) {
      if (siteUrl) {
        return NextResponse.redirect(new URL(`${pathname}${search}`, siteUrl));
      }
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Store (or unknown) host: send /admin* to the admin origin when configured
  if (isAdminPath(pathname) && adminUrl && onStoreHost) {
    return NextResponse.redirect(new URL(`${pathname}${search}`, adminUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
