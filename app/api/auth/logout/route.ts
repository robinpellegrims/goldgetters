import { NextRequest, NextResponse } from 'next/server';
import {
  getSessionCookie,
  deleteSession,
  deleteSessionCookie,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const sessionId = await getSessionCookie();

    if (sessionId) {
      // Delete session from storage
      deleteSession(sessionId);
    }

    // Delete session cookie
    await deleteSessionCookie();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current session
    const sessionId = await getSessionCookie();

    if (sessionId) {
      // Delete session from storage
      deleteSession(sessionId);
    }

    // Delete session cookie
    await deleteSessionCookie();

    // Redirect to home page
    return NextResponse.redirect(new URL('/?logout=success', request.url));
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
