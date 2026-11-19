import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const size = searchParams.get('size');
    const fabric = searchParams.get('fabric');
    const isFeatured = searchParams.get('featured');
    const isNewArrival = searchParams.get('newArrival');
    const isBestSeller = searchParams.get('bestSeller');
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '24');
    const page = parseInt(searchParams.get('page') || '1');
    const all = searchParams.get('all') === 'true'; // Admin view

    const where: any = {
      ...(all ? {} : { isActive: true }),
    };

    if (category) {
      where.OR = [
        { category: { slug: category } },
        { category: { name: { contains: category } } },
      ];
    }

    if (subcategory) {
      where.subcategory = { slug: subcategory };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { fabric: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.sellingPrice = {};
      if (minPrice) where.sellingPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.sellingPrice.lte = parseFloat(maxPrice);
    }

    if (fabric) {
      where.fabric = { contains: fabric };
    }

    if (isFeatured === 'true') where.isFeatured = true;
    if (isNewArrival === 'true') where.isNewArrival = true;
    if (isBestSeller === 'true') where.isBestSeller = true;

    if (size) {
      where.variants = {
        some: {
          size: { equals: size },
          stock: { gt: 0 },
        },
      };
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { sellingPrice: 'asc' };
    if (sort === 'price_desc') orderBy = { sellingPrice: 'desc' };
    if (sort === 'popularity') orderBy = [{ isBestSeller: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'name_asc') orderBy = { name: 'asc' };

    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        subcategory: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Products fetch error:', error);
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

    if (!name || !sku || !mrp || !sellingPrice || !categoryId) {
      return NextResponse.json(
        { error: 'Name, SKU, MRP, Selling Price, and Category are required' },
        { status: 400 }
      );
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    // Check SKU and Slug conflict
    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      return NextResponse.json({ error: `Product SKU '${sku}' already exists` }, { status: 409 });
    }

    const existingSlug = await prisma.product.findUnique({ where: { slug: generatedSlug } });
    if (existingSlug) {
      return NextResponse.json(
        { error: `Product slug '${generatedSlug}' already exists` },
        { status: 409 }
      );
    }

    const defaultImages = images && images.length > 0 ? images : [
      { url: '/brand/product-black-suit.png', alt: name, isThumbnail: true, displayOrder: 1 },
    ];

    const defaultVariants = variants && variants.length > 0 ? variants : [
      { size: 'M', color: 'Default', sku: `${sku}-M`, stock: 10 },
      { size: 'L', color: 'Default', sku: `${sku}-L`, stock: 10 },
    ];

    // Create product, variants, images, and inventory logs in a transaction
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: name.trim(),
          slug: generatedSlug,
          sku: sku.trim(),
          description: description || '',
          shortDescription: shortDescription || null,
          mrp: parseFloat(mrp),
          sellingPrice: parseFloat(sellingPrice),
          fabric: fabric || null,
          careInstructions: careInstructions || null,
          isFeatured: Boolean(isFeatured),
          isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : true,
          isBestSeller: Boolean(isBestSeller),
          isActive: isActive !== undefined ? Boolean(isActive) : true,
          categoryId,
          subcategoryId: subcategoryId || null,
          images: {
            create: defaultImages.map((img: any, idx: number) => ({
              url: img.url,
              alt: img.alt || name,
              displayOrder: img.displayOrder !== undefined ? img.displayOrder : idx + 1,
              isThumbnail: img.isThumbnail !== undefined ? img.isThumbnail : idx === 0,
            })),
          },
          variants: {
            create: defaultVariants.map((v: any) => ({
              size: v.size,
              color: v.color || 'Standard',
              colorHex: v.colorHex || null,
              sku: v.sku || `${sku}-${v.size}-${v.color || 'STD'}`,
              stock: parseInt(v.stock || '0'),
              priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
            })),
          },
        },
        include: {
          variants: true,
          images: true,
          category: true,
        },
      });

      // Record inventory transactions for initial stock
      for (const variant of created.variants) {
        if (variant.stock > 0) {
          await tx.inventoryTransaction.create({
            data: {
              productId: created.id,
              variantId: variant.id,
              type: 'RESTOCK',
              previousStock: 0,
              newStock: variant.stock,
              changeQuantity: variant.stock,
              reason: 'Initial product creation stock',
              adminEmail: auth.user?.email || 'admin@radheygirlspoint.com',
            },
          });
        }
      }

      return created;
    });

    return NextResponse.json({ product, message: 'Product created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
