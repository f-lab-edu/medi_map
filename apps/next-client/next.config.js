/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.icons8.com', 'nedrug.mfds.go.kr'],
  },
  async headers() {
    return [
      {
        source: '/videos/:all*', // Apply to all files in the /videos directory
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year cache
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;