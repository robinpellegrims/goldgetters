import { NextRequest, NextResponse } from 'next/server';
import {
  verifyMagicLinkToken,
  createOrGetUser,
  createSession,
  setSessionCookie,
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Verify token
    const email = verifyMagicLinkToken(token);

    if (!email) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Get or create user
    const user = createOrGetUser(email);

    // Create session
    const sessionId = createSession(user.id, user.email);

    // Set session cookie
    await setSessionCookie(sessionId);

    // Redirect to home page
    return NextResponse.redirect(new URL('/?login=success', request.url));
  } catch (error) {
    console.error('Error verifying magic link:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
