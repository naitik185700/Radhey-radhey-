'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;

  const finalTotal = Math.max(0, subtotal - (couponDiscount || 0) + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Failed to apply coupon');
        setCouponDiscount(null);
      } else {
        setCouponDiscount(data.discountAmount);
        setCouponSuccess(data.message);
      }
    } catch (err: any) {
      setCouponError('Error validating coupon');
    } finally {
      setIsApplying(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-serif font-bold tracking-wide text-neutral-900">
                Your Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-neutral-900 text-white text-xs">
            <div className="flex justify-between items-center mb-1.5">
              {amountNeededForFreeShipping === 0 ? (
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Congratulations! You unlocked FREE Delivery
                </span>
              ) : (
                <span>
                  Add <strong className="text-white font-semibold">{formatPrice(amountNeededForFreeShipping)}</strong> more for <strong>FREE Delivery</strong>
                </span>
              )}
              <span className="text-[11px] text-neutral-400 font-mono">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-neutral-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-neutral-800 mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mb-6">
                  Explore our handcrafted suit sets, regal anarkalis, and festive kurti sets.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg border border-neutral-100 hover:border-neutral-200 transition-all bg-white"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-sm font-semibold text-neutral-900 hover:text-black line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.size && (
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Size: <span className="font-medium text-neutral-800">{item.size}</span>
                          {item.color && (
                            <>
                              {' '}&bull; Color: <span className="font-medium text-neutral-800">{item.color}</span>
                            </>
                          )}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-sm text-neutral-900">
                          {formatPrice(item.price)}
                        </span>
                        {item.mrp > item.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatPrice(item.mrp)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-neutral-200 rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-neutral-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="border-t border-neutral-200 p-5 bg-neutral-50 space-y-4">
              {/* Promo Code Input */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. WELCOME10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase font-medium bg-white border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponCode.trim()}
                    className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded disabled:opacity-50"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </form>

                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
                {couponSuccess && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {couponSuccess}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount && couponDiscount > 0 ? (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-600 font-semibold uppercase tracking-wide">
                        Free
                      </strong>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm font-bold text-neutral-900">
                  <span>Total Amount</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-6 bg-black hover:bg-neutral-800 text-white font-medium text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 shadow-premium transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
