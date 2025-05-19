/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Configure which routes should use Node.js runtime
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'bcryptjs', 'jose', 'nanoid'],
    webpackBuildWorker: true
  },
  // Configure runtime for all routes
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('mongoose');
    }
    return config;
  },
  // Disable build traces to prevent stack overflow
  output: 'standalone',
  // Configure static page generation
  staticPageGenerationTimeout: 120,
  // Configure dynamic routes
  dynamicParams: true
};

module.exports = nextConfig;
