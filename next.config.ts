import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@libsql/client'],
};

export default withPayload(nextConfig);
