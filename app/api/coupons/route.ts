import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { usages: true },
        },
      },
    });
    return NextResponse.json({ coupons });
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
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      validUntil,
      usageLimit,
      isActive,
    } = body;

    if (!code || discountValue === undefined) {
      return NextResponse.json(
        { error: 'Coupon code and discount value are required' },
        { status: 400 }
      );
    }

    const normalizedCode = code.toUpperCase().trim();

    const existing = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Coupon code '${normalizedCode}' already exists` },
        { status: 409 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: normalizedCode,
        description: description || null,
        discountType: discountType || 'PERCENTAGE',
        discountValue: parseFloat(discountValue),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ coupon, message: 'Coupon created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
