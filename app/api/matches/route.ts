import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/matches - Get all matches
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const season = searchParams.get('season');
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';

    const matches = await prisma.match.findMany({
      where: {
        ...(season && { season }),
        ...(status && { status }),
        ...(upcoming && {
          matchDate: { gte: new Date() },
          status: 'scheduled',
        }),
      },
      orderBy: { matchDate: 'desc' },
    });

    return NextResponse.json({ matches }, { status: 200 });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 },
    );
  }
}

// POST /api/matches - Create a new match
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      matchDate,
      location,
      competition,
      season,
      status,
      notes,
    } = body;

    // Validate required fields
    if (!homeTeam || !awayTeam || !matchDate || !season) {
      return NextResponse.json(
        { error: 'Home team, away team, match date, and season are required' },
        { status: 400 },
      );
    }

    const match = await prisma.match.create({
      data: {
        homeTeam,
        awayTeam,
        homeScore: homeScore ? parseInt(homeScore) : null,
        awayScore: awayScore ? parseInt(awayScore) : null,
        matchDate: new Date(matchDate),
        location,
        competition,
        season,
        status: status || 'scheduled',
        notes,
      },
    });

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 },
    );
  }
}
