import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uqbnnjhiuschryrsnyse.storage.supabase.co",
        pathname: "/**",
      },
    ],
  },
  publicRuntimeConfig: {
    bucketUrl: process.env.NEXT_PUBLIC_AWS_BUCKET_URL,
  },
};

export default nextConfig;
