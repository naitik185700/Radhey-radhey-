import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ items: [] });
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 },
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ items: wishlist?.items || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please login to save to wishlist' }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'ProductId is required' }, { status: 400 });
    }

    let wishlist = await prisma.wishlist.findUnique({ where: { userId: user.userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId: user.userId } });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false, message: 'Removed from wishlist' });
    } else {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      return NextResponse.json({ saved: true, message: 'Added to wishlist' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
