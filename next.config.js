/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  output: 'standalone',
  trailingSlash: true,
  distDir: '.next'
}

module.exports = nextConfig