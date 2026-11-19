'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import Logo from '@/components/shared/Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-brand-dark text-white border-t border-neutral-800">
      {/* Brand Trust Strip */}
      <div className="border-b border-neutral-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">✨</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase text-neutral-200">100% Handcrafted</h4>
              <p className="text-xs text-neutral-400">Authentic artisan craftsmanship</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🚚</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase text-neutral-200">Express Delivery</h4>
              <p className="text-xs text-neutral-400">Free shipping on orders ₹999+</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🔄</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase text-neutral-200">Easy 7-Day Returns</h4>
              <p className="text-xs text-neutral-400">Hassle-free doorstep exchanges</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase text-neutral-200">Secure Payments</h4>
              <p className="text-xs text-neutral-400">Razorpay, UPI & Cash on Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand Logo & Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-start">
              <Logo size="md" variant="light" href="/" />
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm font-light">
              <span className="block text-white font-medium mb-1">✨ Trendy • Ethnic • Daily Wear</span>
              Specializing in premium Suits, Co-ord sets, Palazzo suits, Kurtis, and festive ensembles. Visit our boutique near Sach Jewellers, Pul Teliyan, Hisar.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-white hover:text-black flex items-center justify-center text-neutral-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-white hover:text-black flex items-center justify-center text-neutral-300 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h3 className="font-serif text-sm font-bold tracking-widest uppercase text-white mb-4">
              Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/category/suits" className="hover:text-white transition-colors">
                  Ethnic Suits
                </Link>
              </li>
              <li>
                <Link href="/category/kurti-sets" className="hover:text-white transition-colors">
                  Designer Kurti Sets
                </Link>
              </li>
              <li>
                <Link href="/category/co-ord-sets" className="hover:text-white transition-colors">
                  Fusion Co-ord Sets
                </Link>
              </li>
              <li>
                <Link href="/category/dresses" className="hover:text-white transition-colors">
                  Festive Dresses
                </Link>
              </li>
              <li>
                <Link href="/category/lehengas" className="hover:text-white transition-colors">
                  Royal Lehengas
                </Link>
              </li>
              <li>
                <Link href="/category/dupattas" className="hover:text-white transition-colors">
                  Banarasi Dupattas
                </Link>
              </li>
              <li>
                <Link href="/shop?sale=true" className="text-red-400 hover:text-red-300 font-semibold">
                  Sale & Discounts %
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="font-serif text-sm font-bold tracking-widest uppercase text-white mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-and-returns" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/shipping-and-returns" className="hover:text-white transition-colors">
                  Return & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Flagship Store */}
          <div>
            <h3 className="font-serif text-sm font-bold tracking-widest uppercase text-white mb-4">
              Privilege Club
            </h3>
            <p className="text-xs text-neutral-400 font-light mb-3">
              Subscribe to receive private previews of new collections and exclusive festive coupon codes.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 text-xs px-3 py-2.5 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1.5 bg-white text-black rounded hover:bg-neutral-200 transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Thank you for joining our privilege circle!
                </p>
              )}
            </form>

            <div className="mt-6 pt-4 border-t border-neutral-800 text-xs text-neutral-400 space-y-1.5">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" />
                <span>Near Sach Jewellers, Pul Teliyan, Hisar, Haryana</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                <a href="https://wa.me/918950729243" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +91 89507 29243 (DM / WhatsApp)
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment icons */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Radhey Radhey Girls Point. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-300">
              Razorpay Verified
            </span>
            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-300">
              UPI
            </span>
            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-300">
              Cash on Delivery
            </span>
            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-300">
              Visa / Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
