import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/players/[id] - Get a single player by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        statistics: {
          orderBy: { season: 'desc' },
        },
      },
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json({ player }, { status: 200 });
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 },
    );
  }
}

// PUT /api/players/[id] - Update a player
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const player = await prisma.player.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        nickname: body.nickname,
        number: body.number ? parseInt(body.number) : null,
        position: body.position,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        photoUrl: body.photoUrl,
        active: body.active,
        bio: body.bio,
      },
    });

    return NextResponse.json({ player }, { status: 200 });
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 },
    );
  }
}

// DELETE /api/players/[id] - Delete a player
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.player.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Player deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 },
    );
  }
}
