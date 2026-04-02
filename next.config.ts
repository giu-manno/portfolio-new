import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Remove basePath if you configure a custom domain in GitHub Pages settings
  basePath: "/portfolio-new",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
