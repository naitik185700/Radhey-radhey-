import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
      <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-neutral-900 mb-6">
        Privacy & Cookie Policy
      </h1>
      <p>
        At Radhey Radhey Girls Point, we prioritize the confidentiality and security of our customers&#39; personal information.
        This Privacy Policy explains how we collect, store, and protect your data.
      </p>
      <h2 className="font-serif text-base font-bold text-neutral-900 pt-4">Data Security & Encryption</h2>
      <p>
        We do not store complete payment credentials or debit/credit card numbers on our servers.
        All online payment processing is handled through PCI-DSS compliant secure gateways (Razorpay).
      </p>
      <h2 className="font-serif text-base font-bold text-neutral-900 pt-4">Contact Information</h2>
      <p>
        Your phone number and email address are solely used to communicate order status updates, delivery tracking,
        and essential customer service notifications.
      </p>
    </div>
  );
}
