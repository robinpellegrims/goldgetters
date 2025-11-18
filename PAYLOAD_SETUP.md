# PayloadCMS Setup Guide

This project has been configured with PayloadCMS v3.64.0 with the following integrations:

- **Database**: Turso (LibSQL/SQLite)
- **Storage**: S3-compatible (AWS S3, Cloudflare R2, DigitalOcean Spaces, MinIO, etc.)
- **Email**: SMTP (using existing configuration)

## 📦 Installed Packages

- `payload` - Core PayloadCMS package
- `@payloadcms/next` - Next.js integration
- `@payloadcms/db-sqlite` - SQLite database adapter (compatible with Turso)
- `@payloadcms/storage-s3` - S3 storage plugin
- `@payloadcms/richtext-lexical` - Lexical rich text editor
- `@payloadcms/ui` - UI components
- `@libsql/client` - Turso/LibSQL client
- `graphql` - GraphQL support
- `sharp` - Image processing

## 🔧 Configuration Files

### 1. `payload.config.ts`

Main PayloadCMS configuration file with:

- User authentication collection
- Media collection with S3-compatible storage
- Turso database configuration
- SMTP email configuration
- Lexical rich text editor
- Custom public URL support for CDN/custom domains

### 2. Next.js Integration

- **Admin Panel**: `/app/(payload)/admin/[[...segments]]/page.tsx`
- **API Routes**: `/app/(payload)/api/[...slug]/route.ts`
- **Next Config**: `next.config.ts` wrapped with `withPayload()`

## 🌍 Environment Variables

Add these variables to your `.env` file (see `.env.example`):

### PayloadCMS

```env
PAYLOAD_SECRET=your-secure-random-string-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Turso Database

```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

To create a Turso database:

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create a new database
turso db create goldgetters

# Get the database URL
turso db show goldgetters --url

# Create an auth token
turso db tokens create goldgetters
```

### S3-Compatible Storage

**Required variables**:

```env
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key-id
S3_SECRET_ACCESS_KEY=your-secret-access-key
S3_REGION=auto
S3_ENDPOINT=https://your-s3-endpoint.com
```

**Configuration Examples for Different Providers**:

#### AWS S3

```env
S3_BUCKET=my-bucket
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=...
S3_REGION=us-east-1
# S3_ENDPOINT is optional for AWS S3 (it uses the default endpoint)
```

#### Cloudflare R2

```env
S3_BUCKET=goldgetters-media
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_REGION=auto
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

Setup steps:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > R2
2. Create bucket and get Account ID
3. Create API token with "Object Read & Write" permissions

#### DigitalOcean Spaces

```env
S3_BUCKET=my-space
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_REGION=nyc3
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
```

#### MinIO (Self-hosted)

```env
S3_BUCKET=payload-media
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_REGION=us-east-1
S3_ENDPOINT=http://localhost:9000
```

#### Advanced: Custom Domain or CDN (Optional)

If you want to serve files through a custom domain or CDN instead of the default S3 URLs:

```env
S3_PUBLIC_URL=https://cdn.your-domain.com
```

**When to use `S3_PUBLIC_URL`**:

- ✅ You have a CloudFront/Cloudflare CDN in front of your bucket
- ✅ You're using a custom domain for R2 public access
- ✅ You want to use DigitalOcean Spaces CDN endpoint
- ❌ **Not needed** for basic S3/R2/Spaces setup - the adapter handles URLs automatically

### SMTP Email

These are already configured in your project:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
CONTACT_EMAIL_FROM=noreply@goldgetters.be
```

## 🚀 Getting Started

### 1. Set up environment variables

A `.env` file has been created with development defaults. Update it with your actual credentials:

**Minimum required for local development:**

```env
PAYLOAD_SECRET=<generate-a-secure-random-string>
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Generate a secure `PAYLOAD_SECRET`:

```bash
openssl rand -base64 32
```

**For production**, also configure:

- Turso database credentials
- S3-compatible storage credentials
- SMTP email credentials

See `.env.example` for all available options.

### 2. Start the development server

```bash
pnpm run dev
```

**Note:** The database schema will be automatically created on first run. No manual migration needed for development.

### 3. Access the admin panel

Navigate to: `http://localhost:3000/admin`

### 4. Create your first admin user

On first visit, you'll be prompted to create an admin user account.

## 📚 Collections

### Users Collection

- **Auth enabled**: Yes
- **Fields**:
  - Email (auth field)
  - Password (auth field)
  - Name (required)
  - Role (admin/editor/user)

### Media Collection

- **Upload enabled**: Yes
- **Storage**: S3-compatible (automatic URL generation)
- **Custom domain**: Optional via `S3_PUBLIC_URL` for CDN
- **Image sizes**:
  - Thumbnail: 400x300
  - Card: 768x1024
  - Tablet: 1024x auto
- **Fields**:
  - Alt text (required)

## 🔌 API Access

### REST API

- Base URL: `http://localhost:3000/api`
- Collections: `/api/users`, `/api/media`
- Auth: `/api/users/login`, `/api/users/logout`

### GraphQL API

- Endpoint: `http://localhost:3000/api/graphql`
- Playground: Available in development mode

## 📝 TypeScript Types

PayloadCMS automatically generates TypeScript types in `payload-types.ts`. These types are generated based on your collections configuration.

## 🎨 Customization

### Adding New Collections

Edit `payload.config.ts` and add new collections in the `collections` array:

```typescript
{
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
}
```

### Adding New Fields

Add fields to existing collections in `payload.config.ts`.

## 🔒 Security Notes

1. **Never commit** your `.env` file
2. Use a **strong PAYLOAD_SECRET** (at least 32 characters)
3. Keep your **Turso auth token** secure
4. Keep your **S3 API credentials** secure and rotate them periodically
5. Restrict S3 bucket access with appropriate policies
6. Enable **2FA** for production admin accounts

## 📖 Documentation

- [PayloadCMS Docs](https://payloadcms.com/docs)
- [Turso Docs](https://docs.turso.tech/)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [DigitalOcean Spaces Docs](https://docs.digitalocean.com/products/spaces/)

## 🆘 Troubleshooting

### Database connection issues

- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are correct
- Check Turso database is active: `turso db list`

### S3 upload issues

- Verify bucket exists and credentials are correct
- Check that `S3_ENDPOINT` is formatted correctly for your provider
- Verify API credentials have read/write permissions
- Check CORS configuration if accessing files from browser
- For AWS S3: Ensure IAM permissions are configured correctly
- For Cloudflare R2: Verify account ID in endpoint URL
- For public access, ensure bucket permissions or CDN is configured

### Email not sending

- Verify SMTP credentials are correct
- Check SMTP port (usually 587 for TLS, 465 for SSL)
- Ensure your email provider allows SMTP access
- **Note**: SMTP verification on boot is disabled (`verifyTransportOnBoot: false`) to prevent blocking app startup if SMTP isn't configured. Email will still work once properly configured.

## 🔄 Database Migrations

**Development**: PayloadCMS automatically syncs the database schema when you start the dev server. No manual migrations needed.

**Production**: For production deployments with schema changes, you may want to generate and run migrations:

```bash
# Generate migration
npx payload migrate:create

# Run migrations
npx payload migrate
```

**Note**: The Payload CLI may have issues with ESM configs. If you encounter errors, the database will still auto-sync in development mode.

## 🌐 Production Deployment

1. Set `NEXT_PUBLIC_SERVER_URL` to your production URL
2. Use production Turso database
3. Configure production S3 bucket
4. Set up CDN or custom domain for public file access (recommended)
5. Set `NODE_ENV=production`
6. Build the project: `pnpm run build`
7. Start the server: `pnpm start`
