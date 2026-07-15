import type { NextConfig } from "next";

// On Vercel, VERCEL=1 is set automatically — serve from root (no subdirectory)
// On Hostinger FTP, basePath must be /cabsafars
const isVercel = process.env.VERCEL === "1";
const basePath = isVercel ? "" : "/cabsafars";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
