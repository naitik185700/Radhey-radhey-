'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintInvoiceButton({ orderNumber }: { orderNumber: string }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
    >
      <Printer className="w-4 h-4" />
      <span>Print Official Receipt</span>
    </button>
  );
}
