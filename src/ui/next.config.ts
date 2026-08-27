import type { NextConfig } from "next";

const AUTH_PROXY =
  process.env.AUTH_SERVICE_URL || "http://127.0.0.1:8001";
const CATALOG_PROXY =
  process.env.CATALOG_SERVICE_URL || "http://127.0.0.1:8002";

const nextConfig: NextConfig = {
  output: "standalone",
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
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${AUTH_PROXY}/api/auth/:path*`,
      },
      {
        source: "/api/products/:path*",
        destination: `${CATALOG_PROXY}/api/products/:path*`,
      },
      {
        source: "/api/products",
        destination: `${CATALOG_PROXY}/api/products/`,
      },
      {
        source: "/api/categories/:path*",
        destination: `${CATALOG_PROXY}/api/categories/:path*`,
      },
      {
        source: "/api/categories",
        destination: `${CATALOG_PROXY}/api/categories/`,
      },
      {
        source: "/media/:path*",
        destination: `${CATALOG_PROXY}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
