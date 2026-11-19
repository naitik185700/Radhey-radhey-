import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = params;
    const body = await request.json();
    const { quantity } = body;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return NextResponse.json({ message: 'Item removed from cart' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parseInt(quantity) },
    });

    return NextResponse.json({ item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = params;
    await prisma.cartItem.delete({ where: { id: itemId } });
    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
