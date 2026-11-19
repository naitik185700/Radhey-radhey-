import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Star, ShieldCheck, HeartHandshake } from 'lucide-react';
import HeroSlider from '@/components/storefront/HeroSlider';
import CategoryStrip from '@/components/storefront/CategoryStrip';
import ProductCard from '@/components/storefront/ProductCard';
import prisma from '@/lib/prisma';

export const revalidate = 0; // Dynamic server rendering to always reflect database updates

async function getHomePageData() {
  const [featuredProducts, newArrivals, bestSellers, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
        category: true,
      },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isActive: true, isNewArrival: true },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
        category: true,
      },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isActive: true, isBestSeller: true },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
        category: true,
      },
      take: 8,
    }),
    prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return { featuredProducts, newArrivals, bestSellers, categories };
}

export default async function HomePage() {
  const { featuredProducts, newArrivals, bestSellers } = await getHomePageData();

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Banner Slider */}
      <HeroSlider />

      {/* 2. Circular Category Strip */}
      <CategoryStrip />

      {/* 3. Featured Collection (Matching the Reference Image exactly!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 justify-center mb-2">
            <span className="h-[1px] w-8 sm:w-12 bg-neutral-300"></span>
            <span className="font-serif italic text-xs sm:text-sm tracking-widest text-neutral-500 uppercase">
              Curated Masterpieces
            </span>
            <span className="h-[1px] w-8 sm:w-12 bg-neutral-300"></span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 uppercase">
            Featured Collection
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto font-light">
            Each ensemble is handpicked and tailored with pure artisan fabrics, rich thread work, and flattering cuts.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-black text-black hover:bg-black hover:text-white text-xs font-semibold uppercase tracking-widest rounded-md transition-all duration-300 group"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* 4. Luxury Brand Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-brand-dark text-white p-8 sm:p-12 lg:p-16 shadow-elevated">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/brand/hero-banner-source.png"
              alt="Artisanal Texture"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 text-[11px] font-semibold uppercase tracking-widest bg-white/10 backdrop-blur-md rounded-full text-brand-gold border border-white/10">
              The Jaipur Heritage Craft
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Regal Anarkalis & Zari Embellished Suits
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Designed in the royal heritage pink city of Jaipur, our pieces feature pure modal satin,
              fine Chanderi silks, hand block prints, and intricate gota patti hand embroidery.
            </p>
            <div className="pt-2">
              <Link
                href="/category/suits"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-neutral-100 text-xs font-semibold uppercase tracking-widest rounded shadow-md transition-all"
              >
                <span>Shop The Royal Edit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
          <div>
            <span className="font-serif italic text-xs tracking-widest text-neutral-500 uppercase">
              Customer Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1 uppercase tracking-tight">
              Most Loved Styles
            </h2>
          </div>
          <Link
            href="/shop?bestSeller=true"
            className="mt-2 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:text-black flex items-center gap-1 group"
          >
            <span>Explore Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </section>

      {/* 6. Client Testimonials */}
      <section className="bg-neutral-100 py-14 sm:py-18 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="font-serif italic text-xs tracking-widest text-neutral-500 uppercase">
              Client Testimonials
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1 uppercase">
              Words From Our Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-subtle border border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <h4 className="font-serif font-semibold text-neutral-900 text-sm mb-2">
                  &ldquo;Breathtaking fabric & royal packaging!&rdquo;
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  I ordered the embroidered lavender suit set for my sister&#39;s sangeet. The finishing,
                  soft mulmul lining, and sheer organza dupatta exceeded all expectations.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <p className="text-xs font-semibold text-neutral-900">Pooja Sharma</p>
                <p className="text-[11px] text-neutral-400">Jaipur, Rajasthan</p>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-subtle border border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <h4 className="font-serif font-semibold text-neutral-900 text-sm mb-2">
                  &ldquo;Perfect fitting on first try!&rdquo;
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  Finding ready-to-wear suits with precise tailoring is so rare. Radhey Radhey Girls Point
                  got the sizing spot on. The black modal suit got me endless compliments.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <p className="text-xs font-semibold text-neutral-900">Ananya Verma</p>
                <p className="text-[11px] text-neutral-400">Bengaluru, Karnataka</p>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-subtle border border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <h4 className="font-serif font-semibold text-neutral-900 text-sm mb-2">
                  &ldquo;Super fast delivery & prompt WhatsApp help&rdquo;
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  Needed an outfit urgently for Diwali puja. I contacted their WhatsApp team and they dispatched
                  my order on the same day. 10/10 service and pure luxury feel.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <p className="text-xs font-semibold text-neutral-900">Meera Rajput</p>
                <p className="text-[11px] text-neutral-400">Jodhpur, Rajasthan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Instagram Styled Boutique Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="font-serif italic text-xs tracking-widest text-neutral-500 uppercase">
            #RadheyRadheyGirlsPoint
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1 uppercase">
            Follow Our Festive Journey
          </h2>
          <p className="text-xs text-neutral-500 mt-1">Tag @radheygirlspoint on Instagram to be featured</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative aspect-square rounded-lg overflow-hidden group">
            <Image
              src="/brand/product-black-suit.png"
              alt="Customer look"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              View Style &rarr;
            </div>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden group">
            <Image
              src="/brand/product-pink-kurti.png"
              alt="Customer look"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              View Style &rarr;
            </div>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden group">
            <Image
              src="/brand/product-lavender-suit.png"
              alt="Customer look"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              View Style &rarr;
            </div>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden group">
            <Image
              src="/brand/product-cream-coord.png"
              alt="Customer look"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              View Style &rarr;
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
