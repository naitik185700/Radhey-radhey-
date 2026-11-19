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
    const search = searchParams.get('search');

    const where: any = { role: 'CUSTOMER' };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const customers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        addresses: {
          select: {
            street: true,
            city: true,
            state: true,
            postalCode: true,
          },
          take: 1,
        },
        orders: {
          select: {
            id: true,
            totalAmount: true,
            orderStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedCustomers = customers.map((c) => {
      const totalSpend = c.orders.reduce((sum, o) => sum + o.totalAmount, 0);
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || '-',
        address: c.addresses[0] ? `${c.addresses[0].city}, ${c.addresses[0].state}` : 'N/A',
        totalOrders: c.orders.length,
        totalSpend,
        registeredAt: c.createdAt,
      };
    });

    return NextResponse.json({ customers: formattedCustomers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
