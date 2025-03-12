module.exports = {
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
};