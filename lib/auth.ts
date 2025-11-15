import { cookies } from 'next/headers';

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface MagicLinkToken {
  token: string;
  email: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Session {
  userId: string;
  email: string;
  expiresAt: Date;
}

// In-memory storage (replace with database in production)
const users = new Map<string, User>();
const magicLinkTokens = new Map<string, MagicLinkToken>();
const sessions = new Map<string, Session>();

// Generate a random token
export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

// Generate a random user ID
export function generateUserId(): string {
  return `user_${generateToken().slice(0, 16)}`;
}

// Get user by email
export function getUserByEmail(email: string): User | null {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

// Create a new user (for admin/setup purposes)
export function createUser(email: string, name?: string): User {
  const user: User = {
    id: generateUserId(),
    email,
    name,
    createdAt: new Date(),
  };

  users.set(user.id, user);
  return user;
}

// Create or get user by email (kept for backward compatibility with verify route)
export function createOrGetUser(email: string, name?: string): User {
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return existingUser;
  }

  return createUser(email, name);
}

// Create magic link token
export function createMagicLinkToken(email: string): MagicLinkToken {
  const token = generateToken();
  const magicLink: MagicLinkToken = {
    token,
    email,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    createdAt: new Date(),
  };

  magicLinkTokens.set(token, magicLink);

  // Clean up old tokens for this email
  for (const [key, value] of magicLinkTokens.entries()) {
    if (value.email === email && key !== token) {
      magicLinkTokens.delete(key);
    }
  }

  return magicLink;
}

// Verify magic link token
export function verifyMagicLinkToken(token: string): string | null {
  const magicLink = magicLinkTokens.get(token);

  if (!magicLink) {
    return null;
  }

  // Check if expired
  if (magicLink.expiresAt < new Date()) {
    magicLinkTokens.delete(token);
    return null;
  }

  // Token is valid, delete it (one-time use)
  magicLinkTokens.delete(token);

  return magicLink.email;
}

// Create session
export function createSession(userId: string, email: string): string {
  const sessionId = generateToken();
  const session: Session = {
    userId,
    email,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  };

  sessions.set(sessionId, session);
  return sessionId;
}

// Get session
export function getSession(sessionId: string): Session | null {
  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  // Check if expired
  if (session.expiresAt < new Date()) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

// Delete session
export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

// Get user by ID
export function getUserById(userId: string): User | null {
  return users.get(userId) || null;
}

// Cookie management
const SESSION_COOKIE_NAME = 'goldgetters_session';

export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Get current user from session
export async function getCurrentUser(): Promise<User | null> {
  const sessionId = await getSessionCookie();

  if (!sessionId) {
    return null;
  }

  const session = getSession(sessionId);

  if (!session) {
    await deleteSessionCookie();
    return null;
  }

  const user = getUserById(session.userId);

  if (!user) {
    await deleteSessionCookie();
    deleteSession(sessionId);
    return null;
  }

  return user;
}

// Send magic link email (placeholder - integrate with your email service)
export async function sendMagicLinkEmail(
  email: string,
  token: string,
): Promise<void> {
  const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}`;

  console.log('='.repeat(80));
  console.log('INLOGLINK E-MAIL');
  console.log('='.repeat(80));
  console.log(`Aan: ${email}`);
  console.log(`Onderwerp: Inloggen bij ZVC Goldgetters`);
  console.log('');
  console.log('Klik op de link hieronder om in te loggen:');
  console.log(magicLinkUrl);
  console.log('');
  console.log('Deze link verloopt over 15 minuten.');
  console.log('='.repeat(80));

  // TODO: Replace with actual email service (Resend, SendGrid, etc.)
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'ZVC Goldgetters <noreply@goldgetters.com>',
  //   to: email,
  //   subject: 'Inloggen bij ZVC Goldgetters',
  //   html: `
  //     <h1>Inloggen bij ZVC Goldgetters</h1>
  //     <p>Klik op de link hieronder om in te loggen:</p>
  //     <a href="${magicLinkUrl}">Inloggen</a>
  //     <p>Deze link verloopt over 15 minuten.</p>
  //   `,
  // });
}
