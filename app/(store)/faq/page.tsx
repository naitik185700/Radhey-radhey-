import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Are your fabrics pure and authentic?',
      a: 'Yes, absolutely. We source pure Chanderi silk, fine Mulmul cotton, modal satin, and organza directly from traditional artisan weavers in Jaipur and Rajasthan. Each piece has complete fabric disclosures in the product specifications.',
    },
    {
      q: 'How do I choose the right size?',
      a: 'Each product page includes an exact measurement chart in inches and centimeters (Bust, Waist, Hip, Kurta Length). For comfortable daily wear, we recommend selecting a garment size that is approximately 2 inches larger than your snug body measurement.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across all serviceable Indian pincodes. You can inspect the tamper-proof packaging and pay upon arrival.',
    },
    {
      q: 'How can I track my order once dispatched?',
      a: 'Once your parcel is handed over to our courier partner (BlueDart or DTDC), an SMS and email with a live tracking link will be sent to your registered contact number. You can also track it under My Orders in your account.',
    },
    {
      q: 'Can I order directly on WhatsApp or DM?',
      a: 'Yes! We offer direct WhatsApp ordering (+91 89507 29243 / wa.me/918950729243). Simply tap the WhatsApp button on any design to DM our boutique stylist, confirm sizing, and process your order with Cash on Delivery or UPI.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-neutral-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-neutral-500 mt-2 font-light">
          Everything you need to know about our boutique collections, sizing, and deliveries.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle">
            <h3 className="font-serif font-bold text-sm sm:text-base text-neutral-900 mb-2 flex items-start gap-2.5">
              <span className="text-neutral-400 font-mono text-xs mt-0.5">0{idx + 1}.</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 pl-6 font-light leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
