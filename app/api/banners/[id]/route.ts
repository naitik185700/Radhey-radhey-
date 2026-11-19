import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(['ADMIN', 'STAFF']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = params;
    const body = await request.json();
    const { title, subtitle, badge, ctaText, ctaLink, imageUrl, displayOrder, isActive } = body;

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(subtitle !== undefined ? { subtitle } : {}),
        ...(badge !== undefined ? { badge } : {}),
        ...(ctaText !== undefined ? { ctaText } : {}),
        ...(ctaLink !== undefined ? { ctaLink } : {}),
        ...(imageUrl ? { imageUrl } : {}),
        ...(displayOrder !== undefined ? { displayOrder: parseInt(displayOrder) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    return NextResponse.json({ banner, message: 'Banner updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = params;
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
