import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(['ADMIN', 'STAFF']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const lowStockOnly = searchParams.get('lowStock') === 'true';
    const threshold = parseInt(searchParams.get('threshold') || '10');

    const variants = await prisma.productVariant.findMany({
      where: lowStockOnly ? { stock: { lte: threshold } } : {},
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: { select: { name: true } },
            images: { take: 1, select: { url: true } },
          },
        },
      },
      orderBy: { stock: 'asc' },
    });

    // Summary statistics
    const allVariants = await prisma.productVariant.findMany({
      select: { stock: true, reservedStock: true },
    });

    const totalStock = allVariants.reduce((sum, v) => sum + v.stock, 0);
    const lowStockCount = allVariants.filter((v) => v.stock > 0 && v.stock <= threshold).length;
    const outOfStockCount = allVariants.filter((v) => v.stock === 0).length;

    return NextResponse.json({
      variants,
      summary: {
        totalStock,
        lowStockCount,
        outOfStockCount,
        totalSkus: allVariants.length,
      },
    });
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
    const { variantId, changeQuantity, adjustmentType, reason } = body;

    if (!variantId || changeQuantity === undefined || !adjustmentType) {
      return NextResponse.json(
        { error: 'variantId, changeQuantity, and adjustmentType are required' },
        { status: 400 }
      );
    }

    const qty = parseInt(changeQuantity);

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }

    const previousStock = variant.stock;
    const newStock = Math.max(0, previousStock + qty);

    const result = await prisma.$transaction(async (tx) => {
      const updatedVariant = await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: newStock },
      });

      const transaction = await tx.inventoryTransaction.create({
        data: {
          productId: variant.productId,
          variantId: variant.id,
          type: adjustmentType, // RESTOCK, DAMAGED, CORRECTION, SALE
          previousStock,
          newStock,
          changeQuantity: qty,
          reason: reason || `${adjustmentType} manual inventory update`,
          adminEmail: auth.user?.email || 'admin@radheygirlspoint.com',
        },
      });

      return { updatedVariant, transaction };
    });

    return NextResponse.json({
      message: 'Inventory updated successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Inventory adjust error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
