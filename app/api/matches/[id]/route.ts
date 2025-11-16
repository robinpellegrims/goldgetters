import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/matches/[id] - Get a single match by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const match = await prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({ match }, { status: 200 });
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 },
    );
  }
}

// PUT /api/matches/[id] - Update a match
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const match = await prisma.match.update({
      where: { id },
      data: {
        homeTeam: body.homeTeam,
        awayTeam: body.awayTeam,
        homeScore: body.homeScore ? parseInt(body.homeScore) : null,
        awayScore: body.awayScore ? parseInt(body.awayScore) : null,
        matchDate: body.matchDate ? new Date(body.matchDate) : undefined,
        location: body.location,
        competition: body.competition,
        season: body.season,
        status: body.status,
        notes: body.notes,
      },
    });

    return NextResponse.json({ match }, { status: 200 });
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 },
    );
  }
}

// DELETE /api/matches/[id] - Delete a match
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.match.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Match deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 },
    );
  }
}
