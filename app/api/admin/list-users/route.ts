import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/auth';

// ADMIN ENDPOINT - lijst van alle users
// In productie moet je dit beveiligen of verwijderen
export async function GET() {
  // Note: In de huidige implementatie is er geen publieke functie om alle users op te halen
  // Dit is voor security redenen - we geven alleen info over specifieke users
  // Voor development kun je dit aanpassen als nodig

  return NextResponse.json(
    {
      message:
        'User lijst is niet beschikbaar via API. Check server logs of gebruik getUserByEmail().',
    },
    { status: 200 },
  );
}
