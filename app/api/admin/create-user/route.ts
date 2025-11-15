import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';

// ADMIN ENDPOINT - alleen gebruiken om initiële users aan te maken
// In productie moet je dit beveiligen of verwijderen na gebruik
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

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

    // Create user
    const user = createUser(normalizedEmail, name);

    return NextResponse.json(
      {
        success: true,
        message: 'Gebruiker aangemaakt',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Aanmaken gebruiker mislukt' },
      { status: 500 },
    );
  }
}
