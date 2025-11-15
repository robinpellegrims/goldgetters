import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.goldgetters.be',
      },
    ],
  },
};

export default nextConfig;
