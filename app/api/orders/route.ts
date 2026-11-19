import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    const isAdmin = user.role === 'ADMIN' || user.role === 'STAFF';

    const where: any = {};

    if (!isAdmin) {
      // Regular customer only sees their own orders
      where.userId = user.userId;
    } else {
      // Admin filters
      if (status && status !== 'ALL') {
        where.orderStatus = status;
      }
      if (search) {
        where.OR = [
          { orderNumber: { contains: search } },
          { customerName: { contains: search } },
          { customerEmail: { contains: search } },
          { customerPhone: { contains: search } },
        ];
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: { take: 1, select: { url: true } },
              },
            },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items, // array of { productId, variantId, quantity }
      paymentMethod, // 'COD' | 'RAZORPAY'
      couponCode,
      notes,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order fields or empty cart' },
        { status: 400 }
      );
    }

    // Process order inside a database transaction to prevent race conditions and overselling
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isActive) {
          throw new Error(`Product not available: ${item.productId}`);
        }

        const variant = item.variantId
          ? await tx.productVariant.findUnique({ where: { id: item.variantId } })
          : null;

        if (variant) {
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name} (${variant.size}). Only ${variant.stock} available.`);
          }

          // Deduct stock safely
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { stock: { decrement: item.quantity } },
          });

          // Record inventory transaction
          await tx.inventoryTransaction.create({
            data: {
              productId: product.id,
              variantId: variant.id,
              type: 'SALE',
              previousStock: variant.stock,
              newStock: variant.stock - item.quantity,
              changeQuantity: -item.quantity,
              reason: 'Customer online order placement',
            },
          });
        }

        const unitPrice = variant?.priceOverride || product.sellingPrice;
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;

        orderItemsData.push({
          productId: product.id,
          variantId: variant?.id || null,
          productName: product.name,
          variantDetails: variant ? `Size: ${variant.size}, Color: ${variant.color}` : 'Standard',
          unitPrice,
          quantity: item.quantity,
          totalPrice: lineTotal,
        });
      }

      // Check coupon
      let discountAmount = 0;
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.toUpperCase().trim() },
        });

        if (coupon && coupon.isActive && new Date() <= new Date(coupon.validUntil)) {
          if (subtotal >= coupon.minOrderAmount) {
            if (coupon.discountType === 'PERCENTAGE') {
              discountAmount = (subtotal * coupon.discountValue) / 100;
              if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
              }
            } else {
              discountAmount = coupon.discountValue;
            }

            // Increment coupon usage
            await tx.coupon.update({
              where: { id: coupon.id },
              data: { usedCount: { increment: 1 } },
            });

            await tx.couponUsage.create({
              data: {
                couponId: coupon.id,
                userId: user?.userId || null,
              },
            });
          }
        }
      }

      // Shipping calculation (Free if above threshold ₹999)
      const shippingSetting = await tx.setting.findUnique({ where: { key: 'shipping_fee' } });
      const thresholdSetting = await tx.setting.findUnique({ where: { key: 'free_shipping_threshold' } });
      const standardShipping = shippingSetting ? parseFloat(shippingSetting.value) : 99;
      const freeThreshold = thresholdSetting ? parseFloat(thresholdSetting.value) : 999;

      const shippingFee = subtotal >= freeThreshold ? 0 : standardShipping;
      const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

      // Unique Order Number
      const orderNumber = `RR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.userId || null,
          customerName: customerName.trim(),
          customerEmail: customerEmail.toLowerCase().trim(),
          customerPhone: customerPhone.trim(),
          shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
          subtotal,
          discountAmount,
          shippingFee,
          totalAmount,
          paymentMethod: paymentMethod || 'COD',
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID', // In production verified via webhook
          orderStatus: 'CONFIRMED',
          couponCode: couponCode || null,
          notes: notes || null,
          items: {
            create: orderItemsData,
          },
          payments: {
            create: {
              amount: totalAmount,
              currency: 'INR',
              status: paymentMethod === 'COD' ? 'PENDING' : 'SUCCESS',
              method: paymentMethod || 'COD',
            },
          },
        },
        include: {
          items: true,
          payments: true,
        },
      });

      return order;
    });

    return NextResponse.json(
      { order: result, message: 'Order placed successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
