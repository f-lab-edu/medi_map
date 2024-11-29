/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.icons8.com', 'nedrug.mfds.go.kr'],
  },
  experimental: {
    cacheHandler: './cache',
  },
};

module.exports = nextConfig;