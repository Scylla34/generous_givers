/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
    ],
    // Disable image optimization in development for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Experimental features for faster development
  experimental: {
    // Enable optimized package imports - reduces bundle size
    optimizePackageImports: ['lucide-react', 'date-fns', '@tanstack/react-query', 'recharts'],
  },

  // Rewrites for API proxy
  async rewrites() {
    return [
      {
        source: '/api-docs/:path*',
        destination: 'http://localhost:8080/swagger-ui/:path*',
      },
    ]
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Disable powered by header
  poweredByHeader: false,

  // Enable gzip compression
  compress: true,
}

module.exports = nextConfig
