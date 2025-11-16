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

// Send magic link email
export async function sendMagicLinkEmail(
  email: string,
  token: string,
): Promise<void> {
  const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}`;

  // In development mode, log to console
  if (process.env.NODE_ENV === 'development') {
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
  }

  // Only send email if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn(
      'SMTP is not configured. Email will not be sent in production.',
    );
    return;
  }

  // Dynamically import nodemailer (only when needed)
  const nodemailer = await import('nodemailer');

  // Configure SMTP transporter (using same config as contact form)
  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const emailFrom = process.env.SMTP_USER;

  // Send email
  await transporter.sendMail({
    from: `"ZVC Goldgetters" <${emailFrom}>`,
    to: email,
    subject: 'Inloggen bij ZVC Goldgetters',
    text: `
Inloggen bij ZVC Goldgetters

Klik op de onderstaande link om in te loggen:
${magicLinkUrl}

Deze link is 15 minuten geldig.

Als je deze e-mail niet hebt aangevraagd, kun je deze negeren.

Met vriendelijke groet,
ZVC Goldgetters
    `,
    html: /* HTML */ `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              background: linear-gradient(135deg, #a2682a 0%, #e1b453 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: linear-gradient(135deg, #a2682a 0%, #e1b453 100%);
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              color: #666;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">ZVC Goldgetters</div>
            </div>

            <h2>Inloggen</h2>
            <p>Klik op de onderstaande knop om in te loggen:</p>

            <div style="text-align: center;">
              <a href="${magicLinkUrl}" class="button">Inloggen</a>
            </div>

            <div class="warning">
              <strong>Let op:</strong> Deze link is 15 minuten geldig en kan
              slechts één keer gebruikt worden.
            </div>

            <div class="footer">
              <p>
                Als je deze e-mail niet hebt aangevraagd, kun je deze negeren.
              </p>
              <p>Met vriendelijke groet,<br />ZVC Goldgetters</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
