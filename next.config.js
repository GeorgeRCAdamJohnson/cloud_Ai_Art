/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for Netlify - use default build
  // output: 'standalone',
  
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
}

module.exports = nextConfig