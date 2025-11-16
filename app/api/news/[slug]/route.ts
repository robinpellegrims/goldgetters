import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/news/[slug] - Get a single news article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const news = await prisma.news.findUnique({
      where: { slug },
    });

    if (!news) {
      return NextResponse.json(
        { error: 'News article not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ news }, { status: 200 });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news article' },
      { status: 500 },
    );
  }
}

// PUT /api/news/[slug] - Update a news article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // If publishing for the first time, set publishedAt
    const wasPublished = await prisma.news.findUnique({
      where: { slug },
      select: { published: true, publishedAt: true },
    });

    const news = await prisma.news.update({
      where: { slug },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        published: body.published,
        publishedAt:
          body.published && !wasPublished?.publishedAt
            ? new Date()
            : undefined,
        authorName: body.authorName,
      },
    });

    return NextResponse.json({ news }, { status: 200 });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news article' },
      { status: 500 },
    );
  }
}

// DELETE /api/news/[slug] - Delete a news article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    await prisma.news.delete({
      where: { slug },
    });

    return NextResponse.json(
      { message: 'News article deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news article' },
      { status: 500 },
    );
  }
}
