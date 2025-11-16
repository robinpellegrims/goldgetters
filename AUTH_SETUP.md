# Magic Link Authentication Setup

This document explains the magic link authentication system implemented in the ZVC Goldgetters website.

## Overview

The authentication system allows users to sign in using magic links sent to their email addresses. No passwords are required!

## Current Implementation

### Features

- **Magic Link Authentication**: Users receive a unique link via email to sign in
- **Session Management**: Cookie-based sessions that last 30 days
- **Secure Tokens**: Cryptographically secure random tokens
- **Token Expiration**: Magic links expire after 15 minutes
- **One-time Use**: Each magic link can only be used once
- **Protected Routes**: Middleware to protect specific pages (configurable)
- **User Display**: Shows logged-in user in the header
- **Logout**: Secure logout functionality

### Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Frontend (Next.js App Router)      │
│  - Login Page (/auth/login)         │
│  - Site Header (shows auth status)  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  API Routes (/app/api/auth/*)       │
│  - POST /request-magic-link         │
│  - GET  /verify?token=...           │
│  - POST /logout                     │
│  - GET  /me                         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Auth Library (/lib/auth.ts)        │
│  - Token generation & verification  │
│  - Session management               │
│  - User management                  │
│  - Cookie handling                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Storage (currently in-memory)      │
│  - Users                            │
│  - Magic Link Tokens                │
│  - Sessions                         │
└─────────────────────────────────────┘
```

## Usage

### For Users

1. **Sign In**:
   - Click "Login" in the header
   - Enter your email address
   - Check your email for the magic link
   - Click the link to sign in

2. **Sign Out**:
   - Click "Logout" button in the header

### For Developers

#### Testing in Development

In development mode, magic links are printed to the console instead of being sent via email:

```bash
npm run dev
# Visit http://localhost:3000
# Click "Login" and enter an email
# Check the console for the magic link URL
# Copy and paste the URL in your browser
```

#### Protecting Routes

To make a route require authentication, add it to the `protectedRoutes` array in `middleware.ts`:

```typescript
const protectedRoutes = ['/dashboard', '/profile', '/admin'];
```

#### Getting the Current User

In server components:

```typescript
import { getCurrentUser } from '@/lib/auth';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Please sign in</div>;
  }

  return <div>Welcome, {user.email}!</div>;
}
```

In client components:

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  if (!user) return <div>Please sign in</div>;

  return <div>Welcome, {user.email}!</div>;
}
```

## Production Setup

The current implementation uses **in-memory storage** for users, tokens, and sessions. This means:

- ✅ Works perfectly for development and testing
- ❌ Data is lost when the server restarts
- ❌ Won't work with multiple server instances (load balancing)
- ❌ Not suitable for production

### Recommended Production Setup

#### 1. Set up a Database

We recommend using **Prisma** with **PostgreSQL**:

```bash
# Install Prisma
pnpm add prisma @prisma/client
pnpm add -D prisma

# Initialize Prisma
npx prisma init
```

Create the schema in `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  sessions  Session[]
}

model MagicLinkToken {
  id        String   @id @default(cuid())
  token     String   @unique
  email     String
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

Run migrations:

```bash
# Set DATABASE_URL in .env
echo "DATABASE_URL=postgresql://user:password@localhost:5432/goldgetters" > .env

# Create and run migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

Update `lib/auth.ts` to use Prisma instead of in-memory storage.

#### 2. Email Service (Already Configured!)

The project already uses **nodemailer** with SMTP for sending emails (shared with the contact form).

The magic link emails are automatically sent using the same SMTP configuration. Make sure you have the following environment variables set in `.env`:

```bash
# SMTP Configuration (already in use for contact form)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password

# App URL for magic links
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**How it works:**

- In **development mode**: Magic links are logged to the console (for easy testing)
- In **production mode**: Emails are sent via SMTP to the user's email address

The `sendMagicLinkEmail` function in `lib/auth.ts` automatically:

1. Checks if you're in development mode and logs to console
2. Uses the same nodemailer configuration as the contact form
3. Sends a styled email with the magic link
4. Handles errors gracefully

**No additional setup needed!** The email service is already integrated and ready to use.

#### 3. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Set the following variables:

```bash
# Required for production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:password@localhost:5432/goldgetters

# SMTP (already configured for contact form)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

#### 4. Deploy

Make sure to:

1. Set all environment variables in your hosting platform
2. Run database migrations in production
3. Test the email delivery
4. Set up HTTPS (required for secure cookies)


## Security Considerations

### Current Implementation

✅ **Secure Token Generation**: Uses `crypto.getRandomValues()` for cryptographically secure random tokens
✅ **Token Expiration**: Magic links expire after 15 minutes
✅ **One-time Use**: Tokens are deleted after verification
✅ **HTTP-Only Cookies**: Session cookies are not accessible via JavaScript
✅ **Secure Cookies**: Cookies are secure in production (HTTPS only)
✅ **SameSite Protection**: Cookies use `SameSite=Lax` to prevent CSRF
✅ **Session Expiration**: Sessions expire after 30 days

### Additional Production Recommendations

1. **Rate Limiting**: Implement rate limiting on the magic link request endpoint to prevent abuse
2. **Email Verification**: Consider requiring email verification before allowing access
3. **HTTPS Only**: Always use HTTPS in production
4. **Database Security**: Use connection pooling and prepared statements (Prisma handles this)
5. **Monitoring**: Set up logging and monitoring for suspicious activity
6. **Backup**: Regular database backups
7. **GDPR Compliance**: Add user data deletion endpoints if required

## API Endpoints

### POST /api/auth/request-magic-link

Request a magic link to be sent to an email address.

**Request:**

```json
{
  "email": "user@example.com",
  "name": "Optional Name"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Magic link sent! Check your email."
}
```

### GET /api/auth/verify?token=xxx

Verify a magic link token and create a session. Redirects to home page on success.

**Query Parameters:**

- `token`: The magic link token

**Redirects:**

- Success: `/?login=success`
- Error: `/auth/login?error=invalid_token`

### POST /api/auth/logout

Logout the current user by deleting their session.

**Response:**

```json
{
  "success": true
}
```

### GET /api/auth/me

Get the currently authenticated user.

**Response:**

```json
{
  "user": {
    "id": "user_xxx",
    "email": "user@example.com",
    "name": "Optional Name"
  }
}
```

Or if not authenticated:

```json
{
  "user": null
}
```

## Files Structure

```
/home/user/goldgetters/
├── lib/
│   └── auth.ts                              # Core authentication logic
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── request-magic-link/
│   │       │   └── route.ts                 # Request magic link endpoint
│   │       ├── verify/
│   │       │   └── route.ts                 # Verify token endpoint
│   │       ├── logout/
│   │       │   └── route.ts                 # Logout endpoint
│   │       └── me/
│   │           └── route.ts                 # Get current user endpoint
│   └── auth/
│       └── login/
│           └── page.tsx                     # Login page UI
├── components/
│   └── site-header.tsx                      # Header with auth status
├── middleware.ts                            # Route protection
├── .env.example                             # Environment variables template
└── AUTH_SETUP.md                            # This file
```

## Troubleshooting

### Magic link not working

1. Check the console for the magic link URL in development mode
2. Verify `NEXT_PUBLIC_APP_URL` is set correctly in `.env`
3. Check that the token hasn't expired (15 minutes)
4. Make sure you're using the link only once

### Session not persisting

1. Check browser cookies are enabled
2. Verify the session cookie is being set (check browser dev tools)
3. In production, make sure you're using HTTPS

### Email not sending

1. Verify your email service API key is correct
2. Check the email service dashboard for errors
3. In development, emails are logged to console instead of being sent
4. Check spam folder

## Support

For issues or questions, please contact the development team or check the project repository.
