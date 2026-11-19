import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || subtotal === undefined) {
      return NextResponse.json(
        { error: 'Coupon code and subtotal are required' },
        { status: 400 }
      );
    }

    const normalizedCode = code.toUpperCase().trim();
    const subtotalNum = parseFloat(subtotal);

    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 });
    }

    if (new Date() > new Date(coupon.validUntil)) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon usage limit has been reached' }, { status: 400 });
    }

    if (subtotalNum < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          error: `Minimum cart value of ₹${coupon.minOrderAmount} required for this coupon. Add ₹${(
            coupon.minOrderAmount - subtotalNum
          ).toFixed(0)} more to apply.`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotalNum * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, subtotalNum);

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount: Math.round(discountAmount),
      message: `Coupon applied! You saved ₹${Math.round(discountAmount)}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
