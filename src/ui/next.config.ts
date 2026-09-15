import type { NextConfig } from "next";

const AUTH_PROXY =
  process.env.AUTH_SERVICE_URL || "http://127.0.0.1:8001";
const CATALOG_PROXY =
  process.env.CATALOG_SERVICE_URL || "http://127.0.0.1:8002";

const extraMediaHosts = (process.env.NEXT_PUBLIC_MEDIA_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim().replace(/^https?:\/\//, ""))
  .filter(Boolean);

const nextConfig: NextConfig = {
  output: "standalone",
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      ...extraMediaHosts.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${AUTH_PROXY}/api/auth/:path*/`,
      },
      {
        source: "/api/products/upload-image/",
        destination: `${CATALOG_PROXY}/api/products/upload-image/`,
      },
      {
        source: "/api/products/upload-image",
        destination: `${CATALOG_PROXY}/api/products/upload-image/`,
      },
      {
        source: "/api/products/:path*",
        destination: `${CATALOG_PROXY}/api/products/:path*/`,
      },
      {
        source: "/api/products",
        destination: `${CATALOG_PROXY}/api/products/`,
      },
      {
        source: "/api/categories/:path*",
        destination: `${CATALOG_PROXY}/api/categories/:path*/`,
      },
      {
        source: "/api/categories",
        destination: `${CATALOG_PROXY}/api/categories/`,
      },
      {
        source: "/api/banners/upload-image/",
        destination: `${CATALOG_PROXY}/api/banners/upload-image/`,
      },
      {
        source: "/api/banners/upload-image",
        destination: `${CATALOG_PROXY}/api/banners/upload-image/`,
      },
      {
        source: "/api/banners/:path*",
        destination: `${CATALOG_PROXY}/api/banners/:path*/`,
      },
      {
        source: "/api/banners",
        destination: `${CATALOG_PROXY}/api/banners/`,
      },
      {
        source: "/media/:path*",
        destination: `${CATALOG_PROXY}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
