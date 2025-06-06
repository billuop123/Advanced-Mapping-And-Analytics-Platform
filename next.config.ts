import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // Add other image hostnames as needed
    ],
  },
  
  // Conditional static export (recommended approach)
  output: process.env.NODE_ENV === 'production' ? 'export' : 'standalone',
  
  // Better to fix TypeScript errors than ignore them
  typescript: {
    ignoreBuildErrors: false, // Changed to false for better code quality
  },
  
  // Similarly for ESLint
  eslint: {
    ignoreDuringBuilds: false, // Changed to false for better code quality
  },

  // Enhanced webpack configuration
  webpack: (config, { isServer }) => {
    // Client-side specific configurations
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          // Add client-side aliases here if needed
        },
        fallback: {
          ...config.resolve?.fallback,
          // Add polyfills if needed for client-side
        }
      };
    }

    // Handle HTML files (if absolutely necessary)
    config.module.rules.push({
      test: /\.html$/,
      use: 'ignore-loader',
    });

    return config;
  },
};

export default nextConfig;
