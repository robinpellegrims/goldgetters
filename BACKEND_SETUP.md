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

The application includes the following models:

- **Player**: Team member information
- **News**: News articles and announcements
- **Match**: Match/game records
- **PhotoGallery**: Photo gallery collections
- **Photo**: Individual photos in galleries
- **PlayerStatistic**: Player statistics per season
- **ContactSubmission**: Contact form submissions

## API Endpoints

### Players

- `GET /api/players` - Get all players
  - Query params: `?active=true` - Filter active players only
- `GET /api/players/[id]` - Get a specific player
- `POST /api/players` - Create a new player
- `PUT /api/players/[id]` - Update a player
- `DELETE /api/players/[id]` - Delete a player

### News

- `GET /api/news` - Get all news articles
  - Query params:
    - `?published=true` - Filter published articles only (default)
    - `?limit=10` - Limit number of results
- `GET /api/news/[slug]` - Get a specific news article
- `POST /api/news` - Create a new news article
- `PUT /api/news/[slug]` - Update a news article
- `DELETE /api/news/[slug]` - Delete a news article

### Matches

- `GET /api/matches` - Get all matches
  - Query params:
    - `?season=2024-2025` - Filter by season
    - `?status=scheduled` - Filter by status
    - `?upcoming=true` - Get upcoming matches only
- `GET /api/matches/[id]` - Get a specific match
- `POST /api/matches` - Create a new match
- `PUT /api/matches/[id]` - Update a match
- `DELETE /api/matches/[id]` - Delete a match

## Example API Requests

### Create a Player

```bash
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "nickname": "JD",
    "number": 10,
    "position": "Forward",
    "active": true
  }'
```

### Create a News Article

```bash
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team wins championship!",
    "slug": "team-wins-championship",
    "content": "The team has won the championship...",
    "excerpt": "Victory at last!",
    "authorName": "Admin",
    "published": true
  }'
```

### Create a Match

```bash
curl -X POST http://localhost:3000/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "homeTeam": "Goldgetters",
    "awayTeam": "Opponents FC",
    "matchDate": "2025-11-20T19:00:00Z",
    "season": "2024-2025",
    "location": "Home Stadium",
    "competition": "League"
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
