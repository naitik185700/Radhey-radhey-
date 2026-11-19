'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

const fallbackBanners: Banner[] = [
  {
    id: 'hero-1',
    title: 'LUXURY PUNJABI SUITS & DUPATTAS',
    subtitle: 'Ivory & Resham Handcrafted Festive Edit',
    badge: 'Spring / Summer 2026',
    ctaText: 'Shop The Campaign',
    ctaLink: '/category/suits',
    imageUrl: '/campaign/hero-banner.jpg',
  },
  {
    id: 'hero-2',
    title: 'ROYAL ANARKALI & FESTIVE WEAR',
    subtitle: 'Intricate Zardozi & Resham Embroidery on Pure Silk',
    badge: 'Festive Spotlight',
    ctaText: 'Explore Anarkalis',
    ctaLink: '/category/suits?subcategory=anarkali-suits',
    imageUrl: '/campaign/anarkali-suits.jpg',
  },
  {
    id: 'hero-3',
    title: 'NEW ARRIVALS: CONTEMPORARY ETHNICS',
    subtitle: 'Curated Pastel Kurti Sets & Co-ord Ensembles',
    badge: 'Trending Now',
    ctaText: 'View New In',
    ctaLink: '/shop?newArrival=true',
    imageUrl: '/campaign/new-arrivals-banner.jpg',
  },
  {
    id: 'hero-4',
    title: 'MIDNIGHT PARTY WEAR SUITS',
    subtitle: 'Regal Black & Silver Zardozi Salwar Suits',
    badge: 'Evening Exclusive',
    ctaText: 'Shop Party Wear',
    ctaLink: '/category/suits',
    imageUrl: '/campaign/party-wear.jpg',
  },
];

export default function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadBanners() {
      try {
        const res = await fetch('/api/banners');
        if (res.ok) {
          const data = await res.json();
          if (data.banners && data.banners.length > 0) {
            setBanners(data.banners);
          }
        }
      } catch (err) {
        console.error('Failed to load hero banners', err);
      }
    }
    loadBanners();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const currentBanner = banners[currentIndex] || fallbackBanners[0];

  return (
    <section className="relative overflow-hidden bg-[#ECE8E1] border-b border-brand-border">
      {/* Background Soft Aesthetic Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F0ECE5] via-[#E8E2D9] to-[#DFD8CD] opacity-90"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left z-10">
            {currentBanner.badge && (
              <div className="inline-flex items-center gap-2">
                <span className="font-serif italic text-xs sm:text-sm tracking-widest text-neutral-600">
                  {currentBanner.badge}
                </span>
                <span className="h-[1px] w-8 bg-neutral-400"></span>
              </div>
            )}

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-dark leading-[1.1] uppercase">
              {currentBanner.title}
            </h1>

            {currentBanner.subtitle && (
              <p className="font-sans text-sm sm:text-base lg:text-lg text-neutral-600 max-w-md font-light tracking-wide">
                {currentBanner.subtitle}
              </p>
            )}

            <div className="pt-2">
              <Link
                href={currentBanner.ctaLink}
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-dark hover:bg-black text-white text-xs sm:text-sm font-semibold uppercase tracking-widest rounded-md shadow-premium transition-all duration-300 group"
              >
                <span>{currentBanner.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Fashion Image Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-72 sm:w-80 lg:w-96 h-[340px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden shadow-elevated border-4 border-white">
              <Image
                src={currentBanner.imageUrl}
                alt={currentBanner.title}
                fill
                priority
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/70 hover:bg-white text-neutral-800 shadow-subtle backdrop-blur-sm transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/70 hover:bg-white text-neutral-800 shadow-subtle backdrop-blur-sm transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-6 bg-black' : 'w-2 bg-neutral-400 hover:bg-neutral-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
