import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ items: [] });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 },
              },
            },
            variant: true,
          },
        },
      },
    });

    return NextResponse.json({ items: cart?.items || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { productId, variantId, quantity } = body;

    if (!productId) {
      return NextResponse.json({ error: 'ProductId is required' }, { status: 400 });
    }

    if (!user) {
      // If guest user, frontend manages local storage cart
      return NextResponse.json({ message: 'Guest cart managed on client' });
    }

    // Upsert user cart
    let cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.userId } });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
      });
      return NextResponse.json({ item: updatedItem, message: 'Cart quantity updated' });
    } else {
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity: quantity || 1,
        },
      });
      return NextResponse.json({ item: newItem, message: 'Item added to cart' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Cart cleared' });
    }

    const cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({ message: 'Cart cleared' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
