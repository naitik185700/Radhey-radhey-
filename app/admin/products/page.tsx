'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Check,
  X,
  Upload,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    description: '',
    shortDescription: '',
    mrp: '',
    sellingPrice: '',
    fabric: 'Pure Chanderi Silk',
    careInstructions: 'Dry Clean Only',
    categoryId: '',
    subcategoryId: '',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    isActive: true,
    images: [{ url: '/brand/product-black-suit.png', isThumbnail: true, displayOrder: 1 }],
    variants: [
      { size: 'S', color: 'Black', sku: '', stock: '10', priceOverride: '' },
      { size: 'M', color: 'Black', sku: '', stock: '20', priceOverride: '' },
      { size: 'L', color: 'Black', sku: '', stock: '15', priceOverride: '' },
    ],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?all=true&limit=100'),
        fetch('/api/categories?all=true'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormError('');
    setFormData({
      name: '',
      slug: '',
      sku: `RR-${Math.floor(100 + Math.random() * 900)}`,
      description: '',
      shortDescription: '',
      mrp: '2999',
      sellingPrice: '2299',
      fabric: 'Pure Chanderi Silk',
      careInstructions: 'Dry Clean Only',
      categoryId: categories[0]?.id || '',
      subcategoryId: '',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isActive: true,
      images: [{ url: '/brand/product-black-suit.png', isThumbnail: true, displayOrder: 1 }],
      variants: [
        { size: 'S', color: 'Black', sku: '', stock: '10', priceOverride: '' },
        { size: 'M', color: 'Black', sku: '', stock: '20', priceOverride: '' },
        { size: 'L', color: 'Black', sku: '', stock: '15', priceOverride: '' },
      ],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setFormError('');
    setFormData({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      shortDescription: p.shortDescription || '',
      mrp: p.mrp.toString(),
      sellingPrice: p.sellingPrice.toString(),
      fabric: p.fabric || '',
      careInstructions: p.careInstructions || '',
      categoryId: p.categoryId,
      subcategoryId: p.subcategoryId || '',
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      isBestSeller: p.isBestSeller,
      isActive: p.isActive,
      images: p.images.length > 0 ? p.images : [{ url: '/brand/product-black-suit.png', isThumbnail: true, displayOrder: 1 }],
      variants: p.variants.map((v: any) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        sku: v.sku,
        stock: v.stock.toString(),
        priceOverride: v.priceOverride ? v.priceOverride.toString() : '',
      })),
    });
    setIsModalOpen(true);
  };

  const handleDuplicate = async (p: any) => {
    try {
      const newSku = `${p.sku}-COPY-${Math.floor(10 + Math.random() * 90)}`;
      const payload = {
        name: `${p.name} (Copy)`,
        slug: `${p.slug}-copy-${Date.now().toString().slice(-4)}`,
        sku: newSku,
        description: p.description,
        shortDescription: p.shortDescription,
        mrp: p.mrp,
        sellingPrice: p.sellingPrice,
        fabric: p.fabric,
        careInstructions: p.careInstructions,
        categoryId: p.categoryId,
        subcategoryId: p.subcategoryId,
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: false,
        isActive: true,
        images: p.images.map((img: any) => ({ url: img.url, alt: `${p.name} Copy` })),
        variants: p.variants.map((v: any) => ({
          size: v.size,
          color: v.color,
          sku: `${newSku}-${v.size}`,
          stock: v.stock,
        })),
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete or deactivate "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadData();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete product');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePublish = async (p: any) => {
    try {
      await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !p.isActive }),
      });
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add/remove variant row
  const addVariantRow = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: 'M', color: 'Standard', sku: '', stock: '10', priceOverride: '' },
      ],
    });
  };

  const removeVariantRow = (idx: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== idx),
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter ? p.categoryId === categoryFilter : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-light">
            Manage catalogue, inventory variants, specifications, and pricing.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-subtle flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-neutral-300 rounded-lg py-2 px-3 text-xs bg-white text-neutral-700 focus:outline-none focus:border-black w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Selling Price</th>
                <th className="py-3.5 px-4 text-right">MRP</th>
                <th className="py-3.5 px-4 text-center">Variants / Stock</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-400" />
                    <span>Loading catalogue...</span>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No products found matching query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const totalStock = p.variants?.reduce((s: number, v: any) => s + v.stock, 0) || 0;
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded overflow-hidden bg-neutral-100 flex-shrink-0">
                            <Image
                              src={p.images[0]?.url || '/brand/product-black-suit.png'}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900 text-sm line-clamp-1">{p.name}</p>
                            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">SKU: {p.sku}</p>
                            <div className="flex gap-1.5 mt-1">
                              {p.isFeatured && (
                                <span className="px-1.5 py-0.2 text-[9px] bg-purple-50 text-purple-700 rounded font-semibold">
                                  Featured
                                </span>
                              )}
                              {p.isBestSeller && (
                                <span className="px-1.5 py-0.2 text-[9px] bg-amber-50 text-amber-700 rounded font-semibold">
                                  Best Seller
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-neutral-800">{p.category?.name || 'General'}</span>
                        {p.subcategory && (
                          <span className="block text-[11px] text-neutral-400">{p.subcategory.name}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-neutral-900">
                        {formatPrice(p.sellingPrice)}
                      </td>

                      <td className="py-3 px-4 text-right text-neutral-400 line-through">
                        {formatPrice(p.mrp)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-semibold ${
                            totalStock === 0
                              ? 'text-red-600 font-bold'
                              : totalStock <= 10
                              ? 'text-amber-600'
                              : 'text-neutral-800'
                          }`}
                        >
                          {totalStock} units
                        </span>
                        <span className="block text-[10px] text-neutral-400">
                          {p.variants?.length || 0} size options
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            p.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                          }`}
                        >
                          {p.isActive ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete / Unpublish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200 mb-6">
                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5 text-neutral-400 hover:text-black" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded mb-4">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
                {/* 1. Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Handcrafted Anarkali Suit Set"
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Product SKU *</label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono uppercase"
                    />
                  </div>
                </div>

                {/* 2. Category & Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Category *</label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">MRP (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Fabric</label>
                    <input
                      type="text"
                      value={formData.fabric}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                      placeholder="e.g. Pure Chanderi Silk"
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* 3. Description */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter detailed description, embroidery style, lining, and styling notes..."
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                  ></textarea>
                </div>

                {/* 4. Product Image URL */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Primary Product Image URL</label>
                  <input
                    type="text"
                    required
                    value={formData.images[0]?.url || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        images: [{ url: e.target.value, isThumbnail: true, displayOrder: 1 }],
                      })
                    }
                    placeholder="/brand/product-black-suit.png or https://..."
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono"
                  />
                </div>

                {/* 5. Inventory Variants (Size, Color, Stock) */}
                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-neutral-900 text-sm">
                      Inventory Variants (Size, Color, Stock)
                    </h3>
                    <button
                      type="button"
                      onClick={addVariantRow}
                      className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-semibold text-[11px]"
                    >
                      + Add Size Variant
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.variants.map((v, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <select
                          value={v.size}
                          onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[idx].size = e.target.value;
                            setFormData({ ...formData, variants: updated });
                          }}
                          className="border border-neutral-300 rounded px-2.5 py-1.5 text-xs w-28"
                        >
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                          <option value="Free Size">Free Size</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Color (e.g. Noir Black)"
                          value={v.color}
                          onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[idx].color = e.target.value;
                            setFormData({ ...formData, variants: updated });
                          }}
                          className="border border-neutral-300 rounded px-2.5 py-1.5 text-xs flex-1"
                        />

                        <input
                          type="number"
                          placeholder="Stock Qty"
                          value={v.stock}
                          onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[idx].stock = e.target.value;
                            setFormData({ ...formData, variants: updated });
                          }}
                          className="border border-neutral-300 rounded px-2.5 py-1.5 text-xs w-24 font-bold"
                        />

                        {formData.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariantRow(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Status Toggles */}
                <div className="pt-4 border-t border-neutral-200 flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-black focus:ring-black"
                    />
                    <span className="font-semibold text-neutral-800">Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="rounded text-black focus:ring-black"
                    />
                    <span className="font-semibold text-neutral-800">Best Seller Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-black focus:ring-black"
                    />
                    <span className="font-semibold text-neutral-800">Published (Visible in Store)</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-neutral-300 rounded font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving Product...' : editingProduct ? 'Save Changes' : 'Create Product'}
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
