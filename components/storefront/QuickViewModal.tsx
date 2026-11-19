'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, ShoppingBag, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';

interface QuickViewModalProps {
  product: any;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || '/brand/product-black-suit.png'
  );
  const [isAdded, setIsAdded] = useState(false);

  const discount = calculateDiscount(product.mrp, product.sellingPrice);
  const wishlisted = isWishlisted(product.id);
  const maxStock = selectedVariant ? selectedVariant.stock : 10;
  const isOutOfStock = maxStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      slug: product.slug,
      price: selectedVariant?.priceOverride || product.sellingPrice,
      mrp: product.mrp,
      image: selectedImage,
      size: selectedVariant?.size || 'Free Size',
      color: selectedVariant?.color || 'Standard',
      quantity,
      maxStock,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 z-20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Product Images */}
            <div className="p-6 bg-neutral-50 flex flex-col items-center justify-center">
              <div className="relative w-full aspect-[3/4] max-h-[380px] rounded-lg overflow-hidden bg-white shadow-subtle mb-3">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover object-top"
                  sizes="400px"
                />
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img.url)}
                      className={`relative w-14 h-16 rounded overflow-hidden border-2 transition-all ${
                        selectedImage === img.url ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img.url} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Variant Select */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                {product.category && (
                  <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                    {product.category.name}
                  </span>
                )}

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
                  {product.name}
                </h2>

                <p className="text-xs text-neutral-500 font-mono mt-0.5">SKU: {product.sku}</p>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 my-4">
                  <span className="font-bold text-2xl text-neutral-900">
                    {formatPrice(selectedVariant?.priceOverride || product.sellingPrice)}
                  </span>
                  {product.mrp > product.sellingPrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      {formatPrice(product.mrp)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-neutral-900 text-white rounded">
                      Save {discount}%
                    </span>
                  )}
                </div>

                {/* Fabric & Description */}
                {product.fabric && (
                  <div className="mb-4 text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-100">
                    <span className="font-semibold text-neutral-900">Fabric:</span> {product.fabric}
                  </div>
                )}

                {/* Size Selector */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                        Select Size:
                      </span>
                      {selectedVariant && (
                        <span className="text-xs text-neutral-500">
                          {selectedVariant.stock > 0 ? (
                            <span className="text-emerald-600 font-medium">In Stock ({selectedVariant.stock})</span>
                          ) : (
                            <span className="text-red-500 font-medium">Out of Stock</span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v: any) => {
                        const isSelected = selectedVariant?.id === v.id;
                        const outOfStock = v.stock <= 0;
                        return (
                          <button
                            key={v.id}
                            disabled={outOfStock}
                            onClick={() => {
                              setSelectedVariant(v);
                              setQuantity(1);
                            }}
                            className={`min-w-[44px] h-10 px-3 text-xs font-semibold rounded border transition-all ${
                              isSelected
                                ? 'bg-black text-white border-black'
                                : outOfStock
                                ? 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed line-through'
                                : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                            }`}
                          >
                            {v.size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-neutral-100 space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-3 px-6 rounded-md text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      isOutOfStock
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black hover:bg-neutral-800 text-white shadow-premium'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-md border transition-colors ${
                      wishlisted
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-neutral-200 hover:border-black text-neutral-700'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-600 text-red-600' : ''}`} />
                  </button>
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="w-full text-center block text-xs font-semibold text-neutral-600 hover:text-black py-1"
                >
                  View Full Product Details & Size Chart &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
