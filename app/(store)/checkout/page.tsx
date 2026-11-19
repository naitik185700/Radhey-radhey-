'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Tag,
  ArrowRight,
  Check,
  ShoppingBag,
  Lock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    apartment: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    postalCode: '302001',
    paymentMethod: 'COD', // 'COD' | 'RAZORPAY'
    notes: '',
  });

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const freeShippingThreshold = 999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
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
        setAppliedCoupon(null);
        setDiscountAmount(0);
      } else {
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discountAmount);
        setCouponSuccess(data.message);
      }
    } catch (err: any) {
      setCouponError('Error verifying coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setErrorMessage('Your bag is empty.');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.postalCode) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const fullShippingAddress = `${formData.street}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.state} - ${formData.postalCode}`;

      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: fullShippingAddress,
        paymentMethod: formData.paymentMethod,
        couponCode: appliedCoupon?.code || null,
        notes: formData.notes || null,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Order created successfully!
      const orderNumber = data.order.orderNumber;
      clearCart();
      router.push(`/order-success/${orderNumber}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-neutral-400" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Add authentic Indian ethnic wear before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex px-8 py-3 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900">
          Secure Checkout
        </h1>
        <p className="text-xs text-neutral-500 mt-1 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit SSL Encrypted & Verified Payment Protection</span>
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Shipping & Payment Information */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle space-y-4">
              <h2 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-sans">
                  1
                </span>
                <span>Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Pooja Sharma"
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address (For Invoices) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="pooja@example.com"
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Mobile Number (For Delivery Updates) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs bg-neutral-100 border border-r-0 border-neutral-300 rounded-l text-neutral-600">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="9876543210"
                      className="w-full border border-neutral-300 rounded-r px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle space-y-4">
              <h2 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-sans">
                  2
                </span>
                <span>Shipping Address</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Street Address / House No. *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleFormChange}
                    placeholder="House/Flat number, building, street"
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Apartment / Suite / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleFormChange}
                    placeholder="Near landmark or floor"
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleFormChange}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleFormChange}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      maxLength={6}
                      value={formData.postalCode}
                      onChange={handleFormChange}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle space-y-4">
              <h2 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-sans">
                  3
                </span>
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Cash On Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD'
                      ? 'border-black bg-neutral-50 ring-1 ring-black'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleFormChange}
                    className="mt-0.5 text-black focus:ring-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-neutral-900">
                        Cash on Delivery (COD)
                      </span>
                      <Banknote className="w-4 h-4 text-neutral-600" />
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Pay in cash or UPI QR code at your doorstep upon delivery.
                    </p>
                  </div>
                </label>

                {/* Razorpay Gateway */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.paymentMethod === 'RAZORPAY'
                      ? 'border-black bg-neutral-50 ring-1 ring-black'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={formData.paymentMethod === 'RAZORPAY'}
                    onChange={handleFormChange}
                    className="mt-0.5 text-black focus:ring-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-neutral-900">
                        Razorpay Secure Online Payment
                      </span>
                      <CreditCard className="w-4 h-4 text-neutral-600" />
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Instant & secure checkout via UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards & NetBanking.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle space-y-5 sticky top-28">
              <h2 className="font-serif text-base font-bold text-neutral-900">
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h2>

              {/* Items List */}
              <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                    <div className="relative w-14 h-16 rounded overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-neutral-900 line-clamp-1">{item.name}</p>
                      <p className="text-neutral-500">
                        Size: {item.size || 'Standard'} &bull; Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-neutral-900 mt-0.5">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase font-medium bg-white border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded disabled:opacity-50"
                  >
                    {isApplyingCoupon ? 'Verifying...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
                {couponSuccess && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    {couponSuccess}
                  </p>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Charges</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-600 font-semibold uppercase">Free Delivery</strong>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-bold text-neutral-900">
                  <span>Total Payable</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {errorMessage}
                </div>
              )}

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-md shadow-premium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Stock & Placing Order...</span>
                ) : (
                  <>
                    <span>Place Order ({formatPrice(finalTotal)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[10px] text-neutral-400">
                By placing this order you agree to our 7-day return policy and terms.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
