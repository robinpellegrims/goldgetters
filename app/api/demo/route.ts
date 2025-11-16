import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/demo - Get all demo items
export async function GET() {
  try {
    const items = await prisma.demoItem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching demo items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo items' },
      { status: 500 },
    );
  }
}

// POST /api/demo - Create a new demo item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 },
      );
    }

    const item = await prisma.demoItem.create({
      data: {
        name,
        message,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Error creating demo item:', error);
    return NextResponse.json(
      { error: 'Failed to create demo item' },
      { status: 500 },
    );
  }
}
