'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Customer Directory & VIP Patrons
        </h1>
        <p className="text-xs text-neutral-500 mt-1 font-light">
          Customer profiles, purchase histories, registered addresses, and lifetime values.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-subtle flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadCustomers()}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
        <span className="text-xs text-neutral-500">
          Total Registered: <strong className="text-neutral-900">{customers.length}</strong>
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">City / Region</th>
                <th className="py-3.5 px-4 text-center">Total Orders</th>
                <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                <th className="py-3.5 px-4 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-400" />
                    <span>Loading customers...</span>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-neutral-700">
                          {c.name ? c.name[0] : 'C'}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 text-sm">{c.name}</p>
                          <p className="text-[11px] text-neutral-400">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600 font-mono">
                      {c.phone || '-'}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-700 font-medium">
                      {c.address}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-neutral-900">
                      {c.totalOrders}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-neutral-900">
                      {formatPrice(c.totalSpend)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-neutral-500">
                      {formatDate(c.registeredAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
