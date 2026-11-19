'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Percent } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

export default function CategoryStrip() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
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
    loadCategories();
  }, []);

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal Category Strip */}
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center group flex-shrink-0"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-100 border-2 border-neutral-200 group-hover:border-black p-1 transition-all duration-300 shadow-subtle group-hover:shadow-premium group-hover:scale-105 overflow-hidden flex items-center justify-center relative">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-neutral-200 flex items-center justify-center font-serif text-sm font-bold text-neutral-600">
                    {cat.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="mt-2.5 text-xs sm:text-sm font-medium text-neutral-800 group-hover:text-black transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}

          {/* New Arrivals Quick Circle */}
          <Link
            href="/shop?newArrival=true"
            className="flex flex-col items-center group flex-shrink-0"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-900 border-2 border-neutral-800 group-hover:border-black p-1 transition-all duration-300 shadow-subtle group-hover:scale-105 flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-300 group-hover:text-white" />
            </div>
            <span className="mt-2.5 text-xs sm:text-sm font-medium text-neutral-800 group-hover:text-black transition-colors whitespace-nowrap">
              New Arrivals
            </span>
          </Link>

          {/* Sale Quick Circle */}
          <Link
            href="/shop?sale=true"
            className="flex flex-col items-center group flex-shrink-0"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 border-2 border-red-200 group-hover:border-red-600 p-1 transition-all duration-300 shadow-subtle group-hover:scale-105 flex items-center justify-center text-red-600">
              <Percent className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="mt-2.5 text-xs sm:text-sm font-semibold text-red-600 transition-colors whitespace-nowrap">
              Sale
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
