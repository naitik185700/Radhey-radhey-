'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, MessageCircle } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-brand-black text-white py-2 px-4 text-xs font-sans border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left / Center: Value propositions */}
        <div className="flex items-center justify-center w-full md:w-auto gap-6 sm:gap-8 mx-auto md:mx-0 overflow-x-auto text-[11px] sm:text-xs tracking-wider">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Truck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Free Shipping on Orders Above ₹999</span>
          </div>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <div className="flex items-center gap-1.5 whitespace-nowrap hidden sm:flex">
            <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Easy 7-Day Returns</span>
          </div>
          <span className="hidden md:inline text-neutral-600">|</span>
          <div className="flex items-center gap-1.5 whitespace-nowrap hidden md:flex">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>100% Authentic Handcrafted Wear</span>
          </div>
        </div>

        {/* Right: WhatsApp direct assistance */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href="https://wa.me/919876543210?text=Hello%20Radhey%20Radhey%20Girls%20Point%2C%20I%20have%20an%20inquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors tracking-wide"
          >
            <MessageCircle className="w-3.5 h-3.5 text-green-400" />
            <span>WhatsApp Support: +91 98765 43210</span>
          </a>
        </div>
      </div>
    </div>
  );
}
