'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, ChevronDown, X, RefreshCw } from 'lucide-react';
import ProductCard from '@/components/storefront/ProductCard';

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: { id: string; name: string; slug: string }[];
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [selectedFabric, setSelectedFabric] = useState(searchParams.get('fabric') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const searchQuery = searchParams.get('search') || '';

  const fabrics = ['Chanderi Silk', 'Mulmul Cotton', 'Modal Satin', 'Georgette', 'Katan Silk', 'Linen'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

  // Load Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchCategories();
  }, []);

  // Fetch Products based on filters
  useEffect(() => {
    async function loadFilteredProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (selectedSize) params.set('size', selectedSize);
        if (selectedFabric) params.set('fabric', selectedFabric);
        if (sortBy) params.set('sort', sortBy);
        if (searchQuery) params.set('search', searchQuery);
        if (searchParams.get('newArrival')) params.set('newArrival', 'true');
        if (searchParams.get('bestSeller')) params.set('bestSeller', 'true');
        if (searchParams.get('featured')) params.set('featured', 'true');

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadFilteredProducts();
  }, [
    selectedCategory,
    selectedSubcategory,
    minPrice,
    maxPrice,
    selectedSize,
    selectedFabric,
    sortBy,
    searchQuery,
    searchParams,
  ]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSize('');
    setSelectedFabric('');
    setSortBy('newest');
    router.push('/shop');
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedSubcategory,
    minPrice,
    maxPrice,
    selectedSize,
    selectedFabric,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header & Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? `${selectedCategory.toUpperCase()} COLLECTION` : 'All Products & Collections'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Showing {products.length} handcrafted luxury styles
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-md text-xs font-semibold uppercase tracking-wider"
          >
            <Filter className="w-4 h-4" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-neutral-300 rounded-md py-2 px-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="newest">Newest First</option>
              <option value="popularity">Popularity / Best Sellers</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <span className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
              Filter By
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-neutral-500 hover:text-black underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2.5">
              Categories
            </h3>
            <div className="space-y-1.5 text-xs text-neutral-600">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSubcategory('');
                }}
                className={`block w-full text-left py-1 hover:text-black transition-colors ${
                  !selectedCategory ? 'font-bold text-black' : ''
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <div key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setSelectedSubcategory('');
                    }}
                    className={`block w-full text-left py-1 hover:text-black transition-colors ${
                      selectedCategory === cat.slug ? 'font-bold text-black' : ''
                    }`}
                  >
                    {cat.name}
                  </button>
                  {selectedCategory === cat.slug && cat.subcategories && (
                    <div className="pl-3 py-1 space-y-1 border-l-2 border-neutral-200 ml-1">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedSubcategory(sub.slug)}
                          className={`block w-full text-left text-[11px] py-0.5 hover:text-black ${
                            selectedSubcategory === sub.slug ? 'font-bold text-black' : 'text-neutral-500'
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2.5">
              Price Range (₹)
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-xs"
              />
              <span className="text-neutral-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>

          {/* Size Filter */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2.5">
              Available Sizes
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                  className={`px-3 py-1.5 text-xs rounded border transition-all ${
                    selectedSize === s
                      ? 'bg-black text-white border-black font-semibold'
                      : 'border-neutral-200 hover:border-black text-neutral-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Filter */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2.5">
              Fabric
            </h3>
            <div className="space-y-1.5 text-xs text-neutral-600">
              {fabrics.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer hover:text-black">
                  <input
                    type="checkbox"
                    checked={selectedFabric === f}
                    onChange={() => setSelectedFabric(selectedFabric === f ? '' : f)}
                    className="rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span>{f}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
              <p className="text-xs text-neutral-500 uppercase tracking-widest">
                Fetching handcrafted collection...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-xl border border-neutral-200 p-8">
              <h3 className="font-serif text-lg font-semibold text-neutral-800 mb-2">
                No matching products found
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
                Try clearing selected filters or searching for another keyword to discover more styles.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-xl flex flex-col justify-between p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <h2 className="font-serif text-base font-bold uppercase tracking-wider">
                    Filters
                  </h2>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
                    Categories
                  </h3>
                  <div className="space-y-1 text-xs">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCategory(c.slug);
                          setIsMobileFilterOpen(false);
                        }}
                        className={`block w-full text-left py-1 ${
                          selectedCategory === c.slug ? 'font-bold text-black' : 'text-neutral-600'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
                    Sizes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                        className={`px-3 py-1 text-xs border rounded ${
                          selectedSize === s ? 'bg-black text-white' : 'border-neutral-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200 space-y-2">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 border border-neutral-300 text-xs font-semibold uppercase tracking-wider rounded text-neutral-600"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-neutral-400 mx-auto mb-2" />
          <p className="text-xs text-neutral-500 uppercase tracking-widest">
            Loading boutique styles...
          </p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
