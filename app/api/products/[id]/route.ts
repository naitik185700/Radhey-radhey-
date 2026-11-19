import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        subcategory: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: { orderBy: { size: 'asc' } },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
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

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      mrp,
      sellingPrice,
      fabric,
      careInstructions,
      isFeatured,
      isNewArrival,
      isBestSeller,
      isActive,
      categoryId,
      subcategoryId,
      images,
      variants,
    } = body;

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update basic product fields
      const p = await tx.product.update({
        where: { id },
        data: {
          ...(name ? { name: name.trim() } : {}),
          ...(slug ? { slug: slugify(slug) } : {}),
          ...(sku ? { sku: sku.trim() } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(shortDescription !== undefined ? { shortDescription } : {}),
          ...(mrp !== undefined ? { mrp: parseFloat(mrp) } : {}),
          ...(sellingPrice !== undefined ? { sellingPrice: parseFloat(sellingPrice) } : {}),
          ...(fabric !== undefined ? { fabric } : {}),
          ...(careInstructions !== undefined ? { careInstructions } : {}),
          ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
          ...(isNewArrival !== undefined ? { isNewArrival: Boolean(isNewArrival) } : {}),
          ...(isBestSeller !== undefined ? { isBestSeller: Boolean(isBestSeller) } : {}),
          ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
          ...(categoryId ? { categoryId } : {}),
          ...(subcategoryId !== undefined ? { subcategoryId: subcategoryId || null } : {}),
        },
      });

      // 2. Update images if supplied
      if (images && Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: images.map((img: any, idx: number) => ({
            productId: id,
            url: img.url,
            alt: img.alt || p.name,
            displayOrder: img.displayOrder !== undefined ? img.displayOrder : idx + 1,
            isThumbnail: img.isThumbnail !== undefined ? img.isThumbnail : idx === 0,
          })),
        });
      }

      // 3. Update variants if supplied
      if (variants && Array.isArray(variants)) {
        for (const v of variants) {
          if (v.id) {
            // Update existing variant
            const oldV = existing.variants.find((item) => item.id === v.id);
            const newStock = parseInt(v.stock || '0');
            await tx.productVariant.update({
              where: { id: v.id },
              data: {
                size: v.size,
                color: v.color,
                colorHex: v.colorHex || null,
                sku: v.sku,
                stock: newStock,
                priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
              },
            });

            // Log if stock changed
            if (oldV && oldV.stock !== newStock) {
              await tx.inventoryTransaction.create({
                data: {
                  productId: id,
                  variantId: v.id,
                  type: newStock > oldV.stock ? 'RESTOCK' : 'CORRECTION',
                  previousStock: oldV.stock,
                  newStock: newStock,
                  changeQuantity: newStock - oldV.stock,
                  reason: 'Product variant edit update',
                  adminEmail: auth.user?.email,
                },
              });
            }
          } else {
            // Create new variant
            const newV = await tx.productVariant.create({
              data: {
                productId: id,
                size: v.size,
                color: v.color || 'Standard',
                colorHex: v.colorHex || null,
                sku: v.sku || `${p.sku}-${v.size}`,
                stock: parseInt(v.stock || '0'),
                priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
              },
            });

            if (newV.stock > 0) {
              await tx.inventoryTransaction.create({
                data: {
                  productId: id,
                  variantId: newV.id,
                  type: 'RESTOCK',
                  previousStock: 0,
                  newStock: newV.stock,
                  changeQuantity: newV.stock,
                  reason: 'New variant added',
                  adminEmail: auth.user?.email,
                },
              });
            }
          }
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: { images: true, variants: true, category: true },
      });
    });

    return NextResponse.json({ product: updated, message: 'Product updated successfully' });
  } catch (error: any) {
    console.error('Error updating product:', error);
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

    // Check if product is in any active orders
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      // Instead of hard delete, unpublish product to preserve historical orders
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        message: 'Product has active orders in history, so it was safely unpublished (deactivated) instead of being purged.',
        deactivated: true,
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted permanently' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
