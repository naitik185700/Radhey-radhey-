'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, RefreshCw } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings || {});
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-neutral-400 mx-auto mb-2" />
        <p className="text-xs text-neutral-500">Loading boutique configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Store & Business Configuration
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-light">
            Update store information, WhatsApp contact, shipping rules, and policies.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. General Business Profile */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle space-y-4">
          <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
            Business Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.site_name || 'Radhey Radhey Girls Point'}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline || 'Trendy • Ethnic • Daily Wear | Suits | Co-ords | Palazzo | Kurtis'}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Official WhatsApp Number *</label>
              <input
                type="text"
                value={settings.whatsapp_number || '918950729243'}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="e.g. 918950729243 (Country code + 10 digits)"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono font-semibold"
              />
              <p className="text-[10px] text-neutral-400 mt-1">Used for 1-click WhatsApp customer concierge buttons</p>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.contact_email || 'contact@radheygirlspoint.com'}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">Boutique Physical Address</label>
              <input
                type="text"
                value={settings.store_address || 'Near Sach Jewellers, Pul Teliyan, Hisar, Haryana'}
                onChange={(e) => handleChange('store_address', e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* 2. Shipping & Thresholds */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle space-y-4">
          <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
            Shipping Rules & Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.shipping_fee || '99'}
                onChange={(e) => handleChange('shipping_fee', e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={settings.free_shipping_threshold || '999'}
                onChange={(e) => handleChange('free_shipping_threshold', e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Return Window (Days)</label>
              <input
                type="number"
                value={settings.return_window_days || '7'}
                onChange={(e) => handleChange('return_window_days', e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3. Promotional Announcement Bar */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle space-y-4">
          <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
            Storefront Announcement Bar
          </h2>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Announcement Message</label>
            <input
              type="text"
              value={settings.announcement_bar || 'Free Shipping on Orders Above ₹999 | Easy 7-Day Returns | 100% Authentic Handcrafted Wear'}
              onChange={(e) => handleChange('announcement_bar', e.target.value)}
              className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
