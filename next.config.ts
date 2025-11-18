import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@libsql/client', 'sharp'],
};

export default withPayload(nextConfig);
