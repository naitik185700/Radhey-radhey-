import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true'; // If true, include inactive categories (for admin)

    const categories = await prisma.category.findMany({
      where: {
        parentId: null, // Top-level categories
        ...(all ? {} : { isActive: true }),
      },
      include: {
        subcategories: {
          where: all ? {} : { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
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
    const { name, slug, description, image, parentId, displayOrder, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    // Check slug uniqueness
    const existing = await prisma.category.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Category with slug '${generatedSlug}' already exists.` },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: generatedSlug,
        description: description || null,
        image: image || null,
        parentId: parentId || null,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ category, message: 'Category created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
