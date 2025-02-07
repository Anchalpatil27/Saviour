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
  // Remove deprecated appDir option as it's now default in Next.js 13+
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
}

module.exports = nextConfig

