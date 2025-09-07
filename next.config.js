/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hybrid approach: support both App Router and Pages Router for API routes
  
  images: {
    domains: ['localhost', 'cloudaiart.netlify.app'],
    unoptimized: true
  },
  
  trailingSlash: false,
  
  // Essential for Netlify deployment
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  
  // CORS headers for API routes
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
  
  // Environment variables configuration
  env: {
    HUGGINGFACE_API_TOKEN: process.env.HUGGINGFACE_API_TOKEN || process.env.HUGGINGFACEALL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  
  // Redirect configuration to prefer Pages Router for API routes
  async redirects() {
    return []
  },
}

module.exports = nextConfig