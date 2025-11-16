import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/players - Get all players or filter by active status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('active') === 'true';

    const players = await prisma.player.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: [{ number: 'asc' }, { lastName: 'asc' }],
      include: {
        statistics: {
          orderBy: { season: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({ players }, { status: 200 });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 },
    );
  }
}

// POST /api/players - Create a new player
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      nickname,
      number,
      position,
      birthDate,
      photoUrl,
      bio,
    } = body;

    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 },
      );
    }

    const player = await prisma.player.create({
      data: {
        firstName,
        lastName,
        nickname,
        number: number ? parseInt(number) : null,
        position,
        birthDate: birthDate ? new Date(birthDate) : null,
        photoUrl,
        bio,
      },
    });

    return NextResponse.json({ player }, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 },
    );
  }
}
