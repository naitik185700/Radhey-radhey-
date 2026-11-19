import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, getCurrentUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
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
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Role check: customer can only view their own order
    const isAdmin = user.role === 'ADMIN' || user.role === 'STAFF';
    if (!isAdmin && order.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
    const { orderStatus, paymentStatus, trackingNumber, courierName, notes } = body;

    const existing = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Handle Order Cancellation with automatic stock restoration
    const isNowCancelled = orderStatus === 'CANCELLED' && existing.orderStatus !== 'CANCELLED';

    const updated = await prisma.$transaction(async (tx) => {
      if (isNowCancelled) {
        // Restore stock for all items in the order
        for (const item of existing.items) {
          if (item.variantId) {
            const v = await tx.productVariant.findUnique({ where: { id: item.variantId } });
            if (v) {
              await tx.productVariant.update({
                where: { id: v.id },
                data: { stock: { increment: item.quantity } },
              });

              await tx.inventoryTransaction.create({
                data: {
                  productId: item.productId,
                  variantId: item.variantId,
                  type: 'CANCELLED_RESTORE',
                  previousStock: v.stock,
                  newStock: v.stock + item.quantity,
                  changeQuantity: item.quantity,
                  reason: `Stock restored upon cancellation of order ${existing.orderNumber}`,
                  adminEmail: auth.user?.email || 'admin@radheygirlspoint.com',
                },
              });
            }
          }
        }
      }

      const orderUpdated = await tx.order.update({
        where: { id },
        data: {
          ...(orderStatus ? { orderStatus } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
          ...(trackingNumber !== undefined ? { trackingNumber } : {}),
          ...(courierName !== undefined ? { courierName } : {}),
          ...(notes !== undefined ? { notes } : {}),
        },
        include: { items: true, payments: true },
      });

      return orderUpdated;
    });

    return NextResponse.json({
      order: updated,
      message: isNowCancelled
        ? 'Order cancelled and inventory successfully restored.'
        : 'Order status updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
