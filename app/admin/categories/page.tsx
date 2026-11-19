'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, FolderPlus, ArrowUpDown, Check, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { slugify } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '/brand/product-black-suit.png',
    parentId: '',
    displayOrder: 1,
    isActive: true,
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories?all=true');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = (parentId = '') => {
    setEditingCategory(null);
    setErrorMessage('');
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '/brand/product-black-suit.png',
      parentId,
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setErrorMessage('');
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '/brand/product-black-suit.png',
      parentId: cat.parentId || '',
      displayOrder: cat.displayOrder || 1,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to delete category');
      } else {
        await loadCategories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || slugify(formData.name),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      setIsModalOpen(false);
      await loadCategories();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-light">
            Organize main collections and subcategories. Updates reflect instantly across the storefront.
          </p>
        </div>
        <button
          onClick={() => openAddModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid / Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Subcategories</th>
                <th className="py-3.5 px-4 text-center">Products</th>
                <th className="py-3.5 px-4 text-center">Order</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-400" />
                    <span>Loading categories...</span>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No categories created yet.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <React.Fragment key={cat.id}>
                    <tr className="hover:bg-neutral-50/80 transition-colors font-medium">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
                            {cat.image ? (
                              <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500">
                                {cat.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 text-sm">{cat.name}</span>
                            {cat.description && (
                              <p className="text-[11px] text-neutral-400 line-clamp-1">{cat.description}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-neutral-500">{cat.slug}</td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {cat.subcategories?.map((sub: any) => (
                            <span
                              key={sub.id}
                              className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-[11px]"
                            >
                              {sub.name}
                            </span>
                          ))}
                          <button
                            onClick={() => openAddModal(cat.id)}
                            className="text-[11px] text-blue-600 hover:underline font-semibold ml-1"
                          >
                            + Add Sub
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-neutral-800">
                        {cat._count?.products || 0}
                      </td>

                      <td className="py-3 px-4 text-center font-mono">{cat.displayOrder}</td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                          }`}
                        >
                          {cat.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200 mb-6">
                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5 text-neutral-400 hover:text-black" />
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded mb-4">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Punjabi Suits or Lehengas"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. punjabi-suits"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Parent Category (Leave empty for top-level)
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                  >
                    <option value="">None (Top-Level Category)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Category Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/brand/product-black-suit.png"
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short description for SEO and category headers..."
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      <span className="font-semibold text-neutral-800">Active (Visible in Store)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
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
