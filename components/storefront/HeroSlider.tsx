'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  {
    id: 'hero-5',
    title: 'THE JAIPUR HERITAGE CRAFT',
    subtitle: 'Pure Modal Satin, Fine Chanderi Silks & Hand Block Prints',
    badge: 'Artisanal Edit',
    ctaText: 'Discover Collection',
    ctaLink: '/shop',
    imageUrl: '/campaign/promo-banner.jpg',
  },
];

export default function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-play slideshow every 6 seconds, pauses on hover
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, banners.length, nextSlide]);

  const currentBanner = banners[currentIndex] || fallbackBanners[0];

  return (
    <section
      className="relative w-full h-[520px] sm:h-[620px] lg:h-[720px] xl:h-[760px] overflow-hidden select-none bg-neutral-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero Fashion Banner"
    >
      {/* 1. Full-Bleed Background Images (Cross-Fading Slides) */}
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={banner.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              priority={index === 0}
              className="object-cover object-right md:object-center transform scale-100 transition-transform duration-7000 ease-out"
              sizes="100vw"
              quality={90}
            />

            {/* Premium Cinematic Vignette & Gradient Scrim Overlay for Typography Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20 sm:from-black/80 sm:via-black/45 sm:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          </div>
        );
      })}

      {/* 2. Overlaid Campaign Editorial Content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-6 text-left py-12">
          {/* Campaign Badge */}
          {currentBanner.badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-serif italic text-xs sm:text-sm tracking-widest uppercase font-medium">
                {currentBanner.badge}
              </span>
            </div>
          )}

          {/* Main Hero Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] uppercase drop-shadow-md animate-in fade-in slide-in-from-bottom-3 duration-700">
            {currentBanner.title}
          </h1>

          {/* Subtitle */}
          {currentBanner.subtitle && (
            <p className="font-sans text-xs sm:text-base lg:text-lg text-neutral-200 max-w-xl font-light tracking-wide leading-relaxed drop-shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              {currentBanner.subtitle}
            </p>
          )}

          {/* CTA Action Buttons */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <Link
              href={currentBanner.ctaLink}
              className="inline-flex items-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 bg-white text-black hover:bg-neutral-100 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-md shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <span>{currentBanner.ctaText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/shop?sale=true"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-md text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-md transition-all duration-300"
            >
              <span>Festive Offers %</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Navigation Arrows (Left & Right) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/40 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white shadow-lg backdrop-blur-md transition-all duration-300 focus:outline-none"
            aria-label="Previous campaign slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/40 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white shadow-lg backdrop-blur-md transition-all duration-300 focus:outline-none"
            aria-label="Next campaign slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* 4. Slide Pagination Indicator Dots & Progress */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 sm:gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
