# Backend Setup Guide

This guide will help you set up the backend for the Goldgetters application using Turso Cloud as the database and Prisma as the ORM.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- A Turso account (sign up at https://turso.tech)

## Database Setup with Turso

### 1. Install Turso CLI

```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (PowerShell)
iwr -useb https://get.tur.so/install.ps1 | iex
```

### 2. Authenticate with Turso

```bash
turso auth login
```

### 3. Create a Database

```bash
# Create a new database
turso db create goldgetters

# Get the database URL
turso db show goldgetters --url

# Create an authentication token
turso db tokens create goldgetters
```

### 4. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your Turso credentials:

```env
DATABASE_URL=libsql://[your-database-name]-[your-org].turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token
```

## Prisma Setup

### 1. Install Dependencies

First, ensure all dependencies are installed:

```bash
npm install
```

This will automatically run `prisma generate` through the postinstall script.

If the postinstall script doesn't run automatically, you can manually generate the Prisma client:

```bash
npm run db:generate
# or
npx prisma generate
```

### 2. Push the Schema to the Database

```bash
npx prisma db push
```

This will create all the tables in your Turso database based on the schema defined in `prisma/schema.prisma`.

### 3. (Optional) Open Prisma Studio

To view and manage your database data:

```bash
npx prisma studio
```

## Database Schema

The application includes a simple demo model to verify the backend is working:

- **DemoItem**: A simple model with `name` and `message` fields

You can add more models later as needed for your application.

## API Endpoints

### Demo

- `GET /api/demo` - Get all demo items
- `POST /api/demo` - Create a new demo item

## Example API Requests

### Get All Demo Items

```bash
curl http://localhost:3000/api/demo
```

### Create a Demo Item

```bash
curl -X POST http://localhost:3000/api/demo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "message": "This is a test message"
  }'
```

## Development

### Run the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Database Migrations

When you make changes to the schema:

```bash
# Push changes to the database
npx prisma db push

# Regenerate Prisma Client
npx prisma generate
```

## Production Deployment

For production, make sure to:

1. Set up your production Turso database
2. Update environment variables in your hosting platform
3. Run `npx prisma generate` during build
4. The schema will be automatically pushed or you can use migrations

## Troubleshooting

### Prisma Client Not Found

If you get an error about Prisma Client not being found:

```bash
npx prisma generate
```

### Connection Issues

If you can't connect to Turso:

1. Verify your `DATABASE_URL` is correct
2. Ensure your `DATABASE_AUTH_TOKEN` is valid
3. Check that your Turso database is running: `turso db list`

### Reset Database

To reset your database (⚠️ this will delete all data):

```bash
turso db destroy goldgetters
turso db create goldgetters
npx prisma db push
```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Turso Documentation](https://docs.turso.tech)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
