/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { NextRequest } from 'next/server';

import config from '@/payload.config';
import {
  REST_DELETE,
  REST_GET,
  REST_PATCH,
  REST_POST,
} from '@payloadcms/next/routes';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
): Promise<Response> {
  return REST_GET({ config, params: await context.params, req });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
): Promise<Response> {
  return REST_POST({ config, params: await context.params, req });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
): Promise<Response> {
  return REST_DELETE({ config, params: await context.params, req });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
): Promise<Response> {
  return REST_PATCH({ config, params: await context.params, req });
}
