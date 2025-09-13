import type { NextConfig } from "next";

const bucketUrl = new URL(process.env.NEXT_PUBLIC_AWS_BUCKET_URL || "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: bucketUrl.hostname,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: bucketUrl.hostname,
        pathname: "/**",
      },
    ],
  },
  publicRuntimeConfig: {
    bucketUrl: bucketUrl,
  },
};

export default nextConfig;
