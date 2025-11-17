# PayloadCMS Setup Guide

This project has been configured with PayloadCMS v3.64.0 with the following integrations:

- **Database**: Turso (LibSQL/SQLite)
- **Storage**: AWS S3 (or S3-compatible services)
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
- Media collection with S3 storage
- Turso database configuration
- SMTP email configuration
- Lexical rich text editor

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

### S3 Storage
```env
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key-id
S3_SECRET_ACCESS_KEY=your-secret-access-key
S3_REGION=us-east-1
S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
```

**Note**: For S3-compatible services (DigitalOcean Spaces, MinIO, etc.), update the `S3_ENDPOINT` accordingly:
- **DigitalOcean Spaces**: `https://nyc3.digitaloceanspaces.com`
- **MinIO**: `http://localhost:9000` (or your MinIO server URL)

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
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

### 2. Generate a secure PAYLOAD_SECRET
```bash
openssl rand -base64 32
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Access the admin panel
Navigate to: `http://localhost:3000/admin`

### 5. Create your first admin user
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
- **Storage**: S3
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
4. Use **IAM policies** to restrict S3 access
5. Enable **2FA** for production admin accounts

## 📖 Documentation

- [PayloadCMS Docs](https://payloadcms.com/docs)
- [Turso Docs](https://docs.turso.tech/)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)

## 🆘 Troubleshooting

### Database connection issues
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are correct
- Check Turso database is active: `turso db list`

### S3 upload issues
- Verify bucket exists and credentials are correct
- Check bucket permissions and CORS configuration
- Ensure `S3_REGION` matches your bucket region

### Email not sending
- Verify SMTP credentials are correct
- Check SMTP port (usually 587 for TLS, 465 for SSL)
- Ensure your email provider allows SMTP access

## 🔄 Database Migrations

For production deployments, you may want to run migrations:

```bash
# Generate migration
npx payload migrate:create

# Run migrations
npx payload migrate
```

## 🌐 Production Deployment

1. Set `NEXT_PUBLIC_SERVER_URL` to your production URL
2. Use production Turso database
3. Configure production S3 bucket
4. Set `NODE_ENV=production`
5. Build the project: `npm run build`
6. Start the server: `npm start`
