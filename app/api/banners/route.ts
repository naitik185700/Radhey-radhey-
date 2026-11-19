import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    const banners = await prisma.banner.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ banners });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(['ADMIN', 'STAFF']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { title, subtitle, badge, ctaText, ctaLink, imageUrl, displayOrder, isActive } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title: title.trim(),
        subtitle: subtitle || null,
        badge: badge || null,
        ctaText: ctaText || 'Shop Now',
        ctaLink: ctaLink || '/shop',
        imageUrl,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ banner, message: 'Banner created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
