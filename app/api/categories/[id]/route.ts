import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

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
    const { name, slug, description, image, parentId, displayOrder, isActive } = body;

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updatedSlug = slug ? slugify(slug) : (name ? slugify(name) : existing.slug);

    // If slug changed, verify no conflict
    if (updatedSlug !== existing.slug) {
      const conflict = await prisma.category.findUnique({
        where: { slug: updatedSlug },
      });
      if (conflict) {
        return NextResponse.json(
          { error: `Slug '${updatedSlug}' is already taken` },
          { status: 409 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        slug: updatedSlug,
        ...(description !== undefined ? { description } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(parentId !== undefined ? { parentId: parentId || null } : {}),
        ...(displayOrder !== undefined ? { displayOrder: parseInt(displayOrder) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    return NextResponse.json({ category, message: 'Category updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = params;

    // Safety Check: Check if any products exist under this category
    const productsCount = await prisma.product.count({
      where: {
        OR: [{ categoryId: id }, { subcategoryId: id }],
      },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: ${productsCount} product(s) are currently assigned to it. Please reassign or delete these products first.`,
        },
        { status: 400 }
      );
    }

    // Also check if any child subcategories exist
    const subcategoriesCount = await prisma.category.count({
      where: { parentId: id },
    });

    if (subcategoriesCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: It has ${subcategoriesCount} subcategories. Please reassign or delete subcategories first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
