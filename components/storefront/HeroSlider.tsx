'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

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
    subtitle: 'Ivory & Resham Handcrafted Festive Edit with Intricate Embroidery',
    badge: 'Spring / Summer 2026',
    ctaText: 'Shop The Campaign',
    ctaLink: '/category/suits',
    imageUrl: '/campaign/hero-banner.jpg',
  },
  {
    id: 'hero-2',
    title: 'NEW ARRIVALS: CONTEMPORARY ETHNICS',
    subtitle: 'Curated Pastel Kurti Sets, Co-ord Ensembles & Silk Suits',
    badge: 'Trending Now',
    ctaText: 'Explore New In',
    ctaLink: '/shop?newArrival=true',
    imageUrl: '/campaign/new-arrivals-banner.jpg',
  },
  {
    id: 'hero-3',
    title: 'ROYAL ANARKALI & FESTIVE WEAR',
    subtitle: 'Intricate Zardozi & Resham Embroidery on Pure Heritage Silk',
    badge: 'Festive Spotlight',
    ctaText: 'Explore Anarkalis',
    ctaLink: '/category/suits?subcategory=anarkali-suits',
    imageUrl: '/campaign/anarkali-suits.jpg',
  },
  {
    id: 'hero-4',
    title: 'MIDNIGHT PARTY WEAR SUITS',
    subtitle: 'Regal Black & Silver Zardozi Salwar Suits for Grand Occasions',
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
    <section
      className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] lg:h-[500px] xl:h-[520px] overflow-hidden select-none bg-neutral-900"
      aria-label="Hero Fashion Banner"
    >
      {/* 1. Still Full-Bleed Background Campaign Image */}
      <div className="absolute inset-0">
        <Image
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          fill
          priority
          className="object-cover object-right sm:object-center"
          sizes="100vw"
          quality={90}
        />

        {/* Cinematic Vignette & Left Gradient Overlay for crisp typography readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10 sm:from-black/80 sm:via-black/40 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* 2. Overlaid Campaign Editorial Content (Perfect Viewport Fit - No Scrolling Needed) */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-md sm:max-w-lg lg:max-w-xl space-y-3 sm:space-y-4 text-left py-4">
          {/* Campaign Badge */}
          {currentBanner.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span className="font-serif italic text-[11px] sm:text-xs tracking-widest uppercase font-medium">
                {currentBanner.badge}
              </span>
            </div>
          )}

          {/* Main Hero Headline - Clean 2-Line Editorial Size */}
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight uppercase drop-shadow-md">
            {currentBanner.title}
          </h1>

          {/* Subtitle */}
          {currentBanner.subtitle && (
            <p className="font-sans text-xs sm:text-sm lg:text-base text-neutral-200 font-light tracking-wide leading-relaxed drop-shadow-sm line-clamp-2">
              {currentBanner.subtitle}
            </p>
          )}

          {/* Action CTA Buttons (Always fully visible above the fold) */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={currentBanner.ctaLink}
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 bg-white text-black hover:bg-neutral-100 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-md shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <span>{currentBanner.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/shop?sale=true"
              className="inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-md text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-300"
            >
              <span>Festive Offers %</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Manual Slide Navigation (Still by default; no automatic jumping) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white shadow-md backdrop-blur-md transition-all duration-200 focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white shadow-md backdrop-blur-md transition-all duration-200 focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Discreet Bottom Dots Indicator */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-6 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
