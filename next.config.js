/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'cloudaiart.netlify.app'],
    unoptimized: true
  },
  trailingSlash: true,
  distDir: '.next',
  // Configure for Netlify deployment - no target needed in Next.js 14+
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  // Optimize for Netlify deployment
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig