import { buildConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { s3Storage } from '@payloadcms/storage-s3';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // Basic configuration
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',

  // Collections
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'editor',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'User', value: 'user' },
          ],
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: 'media',
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 1024,
            position: 'centre',
          },
          {
            name: 'tablet',
            width: 1024,
            height: undefined,
            position: 'centre',
          },
        ],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
  ],

  // Database - Turso with LibSQL
  db: sqliteAdapter({
    client: {
      url: process.env.TURSO_DATABASE_URL || 'file:local.db',
      authToken: process.env.TURSO_AUTH_TOKEN,
    },
    logger: process.env.NODE_ENV === 'development',
  }),

  // Email - SMTP
  email: nodemailerAdapter({
    defaultFromAddress:
      process.env.CONTACT_EMAIL_FROM || 'noreply@goldgetters.be',
    defaultFromName: 'Gold Getters',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    // Don't verify SMTP connection on boot to prevent blocking if SMTP isn't configured
    verifyTransportOnBoot: false,
  }),

  // Storage - S3-compatible (AWS S3, Cloudflare R2, DigitalOcean Spaces, MinIO, etc.)
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
          // Use custom public URL if configured (for CDN or custom domain)
          ...(process.env.S3_PUBLIC_URL && {
            generateFileURL: ({ filename, prefix }) => {
              return `${process.env.S3_PUBLIC_URL}/${prefix ? `${prefix}/` : ''}${filename}`;
            },
          }),
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT, // S3-compatible endpoint
        forcePathStyle: true, // Required for some S3-compatible services
      },
    }),
  ],

  // Editor
  editor: lexicalEditor({}),

  // Sharp for image processing
  sharp,

  // TypeScript
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Admin panel
  admin: {
    user: 'users',
  },
});
