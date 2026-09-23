import type { NextConfig } from "next";

// GitHub Pages serve il sito sotto /ToolboxSuite/.
// In dev (o con NEXT_PUBLIC_BASE_PATH="") il basePath resta vuoto.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
