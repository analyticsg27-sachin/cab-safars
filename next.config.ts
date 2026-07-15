import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/cabsafars",
  assetPrefix: "/cabsafars",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
