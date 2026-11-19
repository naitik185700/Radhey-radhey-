import React from 'react';
import { Truck, RotateCcw, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ShippingAndReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-neutral-900">
          Shipping & Return Policies
        </h1>
        <p className="text-xs text-neutral-500 mt-2 font-light">
          Transparent, reliable, and customer-first shopping guidelines.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed">
        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 text-neutral-900 font-bold font-serif text-base">
            <Truck className="w-5 h-5 text-neutral-700" />
            <h2>Domestic Shipping Across India</h2>
          </div>
          <p>
            We offer <strong>Free Standard Shipping</strong> on all domestic orders across India above
            ₹999. For orders below ₹999, a nominal flat shipping fee of ₹99 is applicable.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li>Orders are processed and dispatched within 24-48 business hours.</li>
            <li>Metro cities delivery: 2-4 business days.</li>
            <li>Rest of India delivery: 4-6 business days.</li>
            <li>Full live tracking number is provided via SMS, WhatsApp, and Email.</li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 text-neutral-900 font-bold font-serif text-base">
            <RotateCcw className="w-5 h-5 text-neutral-700" />
            <h2>7-Day Easy Return & Exchange Guarantee</h2>
          </div>
          <p>
            We take pride in our artisan craftsmanship. If you face any sizing or fitting issues, you may
            request an exchange or return within <strong>7 days of delivery</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li>Items must be unused, unwashed, and in original condition with intact brand tags.</li>
            <li>Free reverse doorstep pickup is arranged by our courier partner.</li>
            <li>Refunds for Prepaid orders are credited back to the source account in 3-5 business days.</li>
            <li>Cash on Delivery refunds are credited via direct UPI or bank transfer.</li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 text-neutral-900 font-bold font-serif text-base">
            <ShieldCheck className="w-5 h-5 text-neutral-700" />
            <h2>Damaged or Defective Deliveries</h2>
          </div>
          <p>
            In the rare event that an item arrives damaged or flawed, please WhatsApp our support line at
            +91 98765 43210 within 48 hours of delivery with photos of the parcel. We will immediately
            dispatch an urgent free replacement.
          </p>
        </div>
      </div>
    </div>
  );
}
