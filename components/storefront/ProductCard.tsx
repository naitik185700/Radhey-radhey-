'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import QuickViewModal from './QuickViewModal';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    mrp: number;
    sellingPrice: number;
    fabric?: string | null;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    images: { url: string; alt?: string | null }[];
    variants?: { id: string; size: string; color: string; stock: number }[];
    category?: { name: string; slug: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const discount = calculateDiscount(product.mrp, product.sellingPrice);
  const primaryImage = product.images[0]?.url || '/brand/product-black-suit.png';
  const secondaryImage = product.images[1]?.url || primaryImage;

  // Calculate total stock across variants
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 10;
  const isOutOfStock = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;

  const wishlisted = isWishlisted(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    const firstVariant = product.variants?.[0];

    addToCart({
      productId: product.id,
      variantId: firstVariant?.id,
      name: product.name,
      slug: product.slug,
      price: product.sellingPrice,
      mrp: product.mrp,
      image: primaryImage,
      size: firstVariant?.size || 'Free Size',
      color: firstVariant?.color || 'Standard',
      quantity: 1,
      maxStock: firstVariant?.stock || 10,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <>
      <div className="group relative flex flex-col bg-white rounded-lg overflow-hidden border border-neutral-100 hover:border-neutral-300 hover:shadow-premium transition-all duration-300">
        {/* Image Container with Badges & Hover Actions */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-neutral-900 text-white rounded">
                -{discount}%
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-brand-gold text-white rounded">
                Best Seller
              </span>
            )}
            {isLowStock && (
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500 text-white rounded">
                Only {totalStock} left
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md shadow-subtle transition-all duration-200 z-10 ${
              wishlisted
                ? 'bg-red-50 text-red-600 scale-110'
                : 'bg-white/80 hover:bg-white text-neutral-600 hover:text-black'
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-600 text-red-600' : ''}`} />
          </button>

          {/* Hover Quick Actions */}
          <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-neutral-800 text-xs font-semibold rounded shadow-subtle flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`py-2 px-3 text-xs font-semibold rounded shadow-subtle flex items-center justify-center gap-1.5 transition-colors ${
                isOutOfStock
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAdded ? 'Added' : 'Add'}</span>
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between text-left">
          <div>
            {product.category && (
              <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1">
                {product.category.name}
              </p>
            )}

            <Link href={`/product/${product.slug}`}>
              <h3 className="font-serif text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-black hover:underline line-clamp-1 transition-colors">
                {product.name}
              </h3>
            </Link>

            {product.fabric && (
              <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                {product.fabric}
              </p>
            )}
          </div>

          {/* Pricing & Stock */}
          <div className="mt-3 pt-2 border-t border-neutral-100 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-sm sm:text-base text-neutral-900">
                {formatPrice(product.sellingPrice)}
              </span>
              {product.mrp > product.sellingPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>

            {isOutOfStock ? (
              <span className="text-[11px] font-medium text-red-600 uppercase tracking-wide">
                Sold Out
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-600">
                In Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}
