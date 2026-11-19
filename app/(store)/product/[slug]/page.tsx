import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 0;

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
    include: { images: true, category: true },
  });

  if (!product) return { title: 'Product Not Found | Radhey Radhey Girls Point' };

  return {
    title: `${product.name} | Radhey Radhey Girls Point`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: [{ url: product.images[0]?.url || '/brand/product-black-suit.png' }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
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
    notFound();
  }

  // Related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: {
      images: { take: 1 },
      variants: true,
      category: true,
    },
    take: 4,
  });

  return (
    <ProductDetailClient
      product={product as any}
      relatedProducts={relatedProducts as any}
    />
  );
}
