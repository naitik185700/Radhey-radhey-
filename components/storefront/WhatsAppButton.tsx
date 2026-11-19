'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const whatsappNumber = '918950729243';
  const defaultMessage = encodeURIComponent(
    'Hello Radhey Radhey Girls Point! I am looking for trendy & ethnic suits, kurtis, and co-ords. Please help me with sizing and orders.'
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:p-4 rounded-full shadow-elevated hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-sans text-xs font-semibold px-0 group-hover:pl-2">
        WhatsApp Us
      </span>
    </a>
  );
}
