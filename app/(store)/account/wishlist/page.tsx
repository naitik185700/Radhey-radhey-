'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/storefront/ProductCard';

export default function WishlistPage() {
  const { wishlistIds } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=50');
        if (res.ok) {
          const data = await res.json();
          const filtered = (data.products || []).filter((p: any) =>
            wishlistIds.includes(p.id)
          );
          setWishlistProducts(filtered);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [wishlistIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8 pb-4 border-b border-neutral-200">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900">
          My Saved Wishlist ({wishlistIds.length})
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Review and quickly move your favorite handcrafted designs into your bag.
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-neutral-200 p-8">
          <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-neutral-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto my-3">
            Tap the heart icon on any product to save it here for later.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
