'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Check, X, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '15',
    minOrderAmount: '1499',
    maxDiscount: '500',
    validUntil: '2028-12-31',
    usageLimit: '500',
    isActive: true,
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create coupon');
      }

      setIsModalOpen(false);
      await loadCoupons();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Offers & Discount Coupons
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-light">
            Create promotional discount codes for Meta Ads, Instagram campaigns, and VIP customers.
          </p>
        </div>
        <button
          onClick={() => {
            setErrorMsg('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min Order</th>
                <th className="py-3.5 px-4">Max Discount</th>
                <th className="py-3.5 px-4">Valid Until</th>
                <th className="py-3.5 px-4 text-center">Used Count</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-400" />
                    <span>Loading coupons...</span>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No active discount coupons found.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-sm bg-neutral-100 px-2 py-1 rounded text-neutral-900 border border-neutral-300">
                        {c.code}
                      </span>
                      {c.description && (
                        <p className="text-[11px] text-neutral-500 mt-1 max-w-xs">{c.description}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-700">₹{c.minOrderAmount}</td>

                    <td className="py-3.5 px-4 text-neutral-700">
                      {c.maxDiscount ? `₹${c.maxDiscount}` : 'No cap'}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-500">{formatDate(c.validUntil)}</td>

                    <td className="py-3.5 px-4 text-center font-bold text-neutral-900">
                      {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : ''}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 text-xs">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200 mb-4">
                <h2 className="font-serif text-lg font-bold text-neutral-900">Create New Coupon</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5 text-neutral-400 hover:text-black" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DIWALI20"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono font-bold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Discount Type</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Flat Fixed Amount (₹)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Discount Value *</label>
                    <input
                      type="number"
                      required
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Min Order (₹)</label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 15% off on orders above ₹1499"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-neutral-300 rounded text-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
