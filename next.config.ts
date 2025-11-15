import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Add your actual API image domain here when available
      // {
      //   protocol: 'https',
      //   hostname: 'your-api-domain.com',
      // },
    ],
  },
};

export default nextConfig;
