import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bookshelf-images-ati.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  publicRuntimeConfig: {
    bucketUrl: process.env.NEXT_PUBLIC_AWS_BUCKET_URL,
  },
};

export default nextConfig;
