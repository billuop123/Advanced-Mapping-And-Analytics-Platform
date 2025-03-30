import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  typescript: {
    // Disable TypeScript build errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during the build process
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude the problematic file from being processed by Webpack
    config.module.rules.push({
      test: /\.html$/,
      loader: "ignore-loader", // Use ignore-loader to skip this file
    });

    return config;
  },
};

export default nextConfig;