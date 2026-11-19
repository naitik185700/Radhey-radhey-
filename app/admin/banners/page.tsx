'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, EyeOff, X, RefreshCw } from 'lucide-react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badge: 'New Collection',
    ctaText: 'Shop Now',
    ctaLink: '/category/suits',
    imageUrl: '/brand/hero-banner-source.png',
    displayOrder: 1,
    isActive: true,
  });

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners?all=true');
      if (res.ok) {
        const data = await res.json();
        setBanners(data.banners || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      badge: 'New Collection',
      ctaText: 'Shop Now',
      ctaLink: '/category/suits',
      imageUrl: '/brand/hero-banner-source.png',
      displayOrder: banners.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: any) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || '',
      badge: b.badge || '',
      ctaText: b.ctaText,
      ctaLink: b.ctaLink,
      imageUrl: b.imageUrl,
      displayOrder: b.displayOrder,
      isActive: b.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      await loadBanners();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        await loadBanners();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Homepage Banners & Hero CMS
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-light">
            Customize hero slides, headings, seasonal sales, and call-to-actions dynamically without code.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-neutral-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-400" />
            <span>Loading banners...</span>
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-subtle flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] bg-neutral-100">
                <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.isActive ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {b.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {b.badge && (
                    <span className="text-[10px] uppercase font-semibold text-neutral-500">
                      {b.badge}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-base text-neutral-900 mt-0.5">
                    {b.title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-light mt-1">{b.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-500">Link: {b.ctaLink}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 text-xs">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200 mb-4">
                <h2 className="font-serif text-lg font-bold text-neutral-900">
                  {editingBanner ? 'Edit Banner' : 'Create Hero Banner'}
                </h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5 text-neutral-400 hover:text-black" />
                </button>
              </div>

              <form onSubmit={handleSaveBanner} className="space-y-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Banner Heading *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ETHNIC SUIT SETS"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Elegant Styles for Every Occasion"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. New Collection"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">CTA Destination Link</label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="/category/suits"
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Banner Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/brand/hero-banner-source.png"
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded text-black focus:ring-black"
                      />
                      <span className="font-semibold text-neutral-800">Active (Visible on Homepage)</span>
                    </label>
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
                    {isSubmitting ? 'Saving...' : 'Save Banner'}
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
