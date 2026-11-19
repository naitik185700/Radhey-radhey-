'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Package,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReportData() {
      try {
        const res = await fetch('/api/reports');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, []);

  const handleExportCsv = () => {
    window.location.href = '/api/reports?export=csv';
  };

  const overview = data?.overview || {};
  const categoryPerformance = data?.categoryPerformance || [];
  const topProducts = data?.topProducts || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Financial Reports & Analytics
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-light">
            Comprehensive business performance, inventory valuation, and sales breakdown.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Sales CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle space-y-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Net Realized Revenue
          </span>
          <p className="text-3xl font-bold font-serif text-neutral-900">
            {formatPrice(overview.totalRevenue || 0)}
          </p>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>High retail margin across ethnic categories</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle space-y-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Total Inventory Valuation
          </span>
          <p className="text-3xl font-bold font-serif text-neutral-900">
            {formatPrice(overview.inventoryValuation || 0)}
          </p>
          <p className="text-xs text-neutral-500">
            Based on {overview.totalInventoryUnits || 0} active physical warehouse units
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle space-y-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Average Order Value (AOV)
          </span>
          <p className="text-3xl font-bold font-serif text-neutral-900">
            {formatPrice(
              overview.totalOrders > 0
                ? Math.round((overview.totalRevenue || 0) / overview.totalOrders)
                : 0
            )}
          </p>
          <p className="text-xs text-neutral-500">Across all completed checkouts</p>
        </div>
      </div>

      {/* Category Performance Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-subtle p-6 space-y-4">
        <h2 className="font-serif text-base font-bold text-neutral-900 uppercase tracking-wider">
          Category Sales Performance
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4 text-center">Active Styles</th>
                <th className="py-3 px-4 text-center">Units Sold</th>
                <th className="py-3 px-4 text-right">Revenue Contributed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categoryPerformance.map((cat: any) => (
                <tr key={cat.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-neutral-900 text-sm">{cat.name}</td>
                  <td className="py-3 px-4 text-center">{cat.productCount} styles</td>
                  <td className="py-3 px-4 text-center font-bold text-neutral-800">{cat.salesCount}</td>
                  <td className="py-3 px-4 text-right font-bold text-neutral-900">
                    {formatPrice(cat.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Best Sellers Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-subtle p-6 space-y-4">
        <h2 className="font-serif text-base font-bold text-neutral-900 uppercase tracking-wider">
          Top Performing Best Seller Styles
        </h2>

        <div className="divide-y divide-neutral-100 text-xs">
          {topProducts.map((p: any, idx: number) => (
            <div key={p.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-600 font-mono text-[11px]">
                  0{idx + 1}
                </span>
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{p.name}</p>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    SKU: {p.sku} &bull; {p.category?.name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-neutral-900 text-sm block">
                  {formatPrice(p.sellingPrice)}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">In High Demand</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
