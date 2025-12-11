import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lawngreen-dragonfly-304220.hostingersite.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "website.anwarululoom.com",
        pathname: "/**",
      },
    ],
    // Performance optimizations
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config: any) => {
    // Handle JSON imports properly (for production builds)
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".json": [".json"],
    };
    return config;
  },
  // Turbopack configuration (for development)
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // Turbopack handles TypeScript/JSX natively, no additional config needed
  },
};

export default nextConfig;
