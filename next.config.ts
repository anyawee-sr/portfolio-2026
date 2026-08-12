import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.34"],
  images: {
    unoptimized: isDev,
  },
};

export default nextConfig;
