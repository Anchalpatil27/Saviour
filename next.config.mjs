/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', etc. on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        async_hooks: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        util: false,
      };
    }
    
    // Explicitly mark mongodb as external
    if (isServer) {
      config.externals = [...(config.externals || []), 'mongodb'];
    }
    
    return config;
  },
  // This is an alternative way to specify external packages
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint checking during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

