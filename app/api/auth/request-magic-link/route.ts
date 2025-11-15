import { NextRequest, NextResponse } from 'next/server';
import {
  createMagicLinkToken,
  getUserByEmail,
  sendMagicLinkEmail,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'E-mailadres is verplicht' },
        { status: 400 },
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres' },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    const user = getUserByEmail(normalizedEmail);
    if (!user) {
      // Return success message even if user doesn't exist (security best practice)
      // This prevents email enumeration attacks
      return NextResponse.json(
        {
          success: true,
          message:
            'Als je e-mailadres geregistreerd is, ontvang je een inloglink.',
        },
        { status: 200 },
      );
    }

    // Create magic link token
    const magicLink = createMagicLinkToken(normalizedEmail);

    // Send email
    await sendMagicLinkEmail(normalizedEmail, magicLink.token);

    return NextResponse.json(
      {
        success: true,
        message: 'Inloglink verzonden! Controleer je e-mail.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error requesting magic link:', error);
    return NextResponse.json(
      { error: 'Verzenden van inloglink mislukt' },
      { status: 500 },
    );
  }
}
