import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/app/builder",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

export default nextConfig;
