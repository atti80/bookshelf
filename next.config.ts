import type { NextConfig } from "next";

const wordpressUrl = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL || "");
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: wordpressUrl.hostname,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: wordpressUrl.hostname,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
