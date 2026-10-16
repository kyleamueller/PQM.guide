import type { NextConfig } from "next";
import path from "path";
import { legacyRedirects } from "./src/data/legacy-redirects";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
