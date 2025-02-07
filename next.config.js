/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Socket.IO-specific configuration
    if (!isServer) {
      config.externals = [...config.externals, "bufferutil", "utf-8-validate"]
    }

    return config
  },
  // Enable experimental features for app directory
  experimental: {
    appDir: true,
  },
  // Ensure NEXT_PUBLIC_BASE_URL is available at build time
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
}

module.exports = nextConfig

