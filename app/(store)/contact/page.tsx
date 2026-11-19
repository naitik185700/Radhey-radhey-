'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Check, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="font-serif italic text-xs tracking-widest text-neutral-500 uppercase">
          Client Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1 uppercase">
          Contact Radhey Radhey Girls Point
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-light mt-2">
          We would love to assist you with style consultations, custom sizing, bridal orders, or delivery queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Boutique Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-2xl shadow-premium space-y-6">
            <h2 className="font-serif text-xl font-bold uppercase tracking-wider">
              Flagship Boutique
            </h2>
            <div className="space-y-4 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Boutique Address:</strong>
                  <span>Near Sach Jewellers, Pul Teliyan, Hisar, Haryana</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">DM / WhatsApp Orders:</strong>
                  <a href="https://wa.me/918950729243" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                    +91 89507 29243 (wa.me/918950729243)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Collections:</strong>
                  <span>Suits | Co-ords | Palazzo | Kurtis | Daily & Festive Wear</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Working Hours:</strong>
                  <span>Monday - Sunday: 10:00 AM - 8:30 PM IST</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <a
                href="https://wa.me/918950729243?text=Hello%20Radhey%20Radhey%20Girls%20Point%2C%20I%20want%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Order Directly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Message Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-neutral-200 shadow-subtle">
          <h2 className="font-serif text-xl font-bold text-neutral-900 mb-2">
            Send Us A Message
          </h2>
          <p className="text-xs text-neutral-500 mb-6 font-light">
            Fill out the form below and our styling team will respond within 4 hours.
          </p>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Thank you! Your message has been received. Our team will contact you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Pooja Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="pooja@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                placeholder="+91 89507 29243"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Message / Inquiry *</label>
              <textarea
                rows={4}
                required
                placeholder="Tell us about the styles, sizes, or custom requirements you are looking for..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-black"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest rounded shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
