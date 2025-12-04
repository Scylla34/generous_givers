/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  },
  async rewrites() {
    return [
      {
        source: '/api-docs/:path*',
        destination: 'http://localhost:8080/swagger-ui/:path*',
      },
    ]
  },
}

module.exports = nextConfig
