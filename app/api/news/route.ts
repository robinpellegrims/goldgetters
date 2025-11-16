import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/news - Get all news articles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') !== 'false';
    const limit = searchParams.get('limit');

    const news = await prisma.news.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { publishedAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ news }, { status: 200 });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 },
    );
  }
}

// POST /api/news - Create a new news article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published,
      authorName,
    } = body;

    // Validate required fields
    if (!title || !slug || !content || !authorName) {
      return NextResponse.json(
        { error: 'Title, slug, content, and author name are required' },
        { status: 400 },
      );
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorName,
      },
    });

    return NextResponse.json({ news }, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 },
    );
  }
}
