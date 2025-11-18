/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { NextRequest } from 'next/server';

import config from '@/payload.config';
import {
  REST_DELETE,
  REST_GET,
  REST_PATCH,
  REST_POST,
} from '@payloadcms/next/routes';

export const GET = async (
  req: NextRequest,
  args: { params: Promise<{ slug: string[] }> },
) => {
  const params = await args.params;
  return REST_GET(req, { config, params });
};

export const POST = async (
  req: NextRequest,
  args: { params: Promise<{ slug: string[] }> },
) => {
  const params = await args.params;
  return REST_POST(req, { config, params });
};

export const DELETE = async (
  req: NextRequest,
  args: { params: Promise<{ slug: string[] }> },
) => {
  const params = await args.params;
  return REST_DELETE(req, { config, params });
};

export const PATCH = async (
  req: NextRequest,
  args: { params: Promise<{ slug: string[] }> },
) => {
  const params = await args.params;
  return REST_PATCH(req, { config, params });
};
