'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  IndianRupee,
  Layers,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Package,
  Calendar,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
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
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-neutral-400 mx-auto mb-3" />
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Loading Store Intelligence & Real-Time Analytics...
        </p>
      </div>
    );
  }

  const overview = data?.overview || {};
  const salesOverview = data?.salesOverview || [];
  const categoryPerformance = data?.categoryPerformance || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-xs text-neutral-500 mt-1 font-light">
          Real-time metrics, order fulfillments, and boutique performance.
        </p>
      </div>

      {/* 1. Core Analytics Cards (Matching Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900">
                {overview.totalOrders || 0}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +12%
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">{overview.pendingOrders || 0} orders pending</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900">
                {formatPrice(overview.totalRevenue || 0)}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +18%
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">Paid & confirmed orders</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900">
                {overview.totalProducts || 0}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Across {overview.totalCategories || 0} categories
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-red-600">
                {overview.lowStockCount || 0}
              </span>
              <span className="text-[11px] text-neutral-400">SKUs &le; 10 units</span>
            </div>
            <Link
              href="/admin/inventory?lowStock=true"
              className="text-[11px] text-red-600 hover:underline font-semibold block"
            >
              Review inventory &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Visual Charts Row (Sales Overview Line Chart + Top Categories Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Overview Line Chart (7 Columns) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-base font-bold text-neutral-900 uppercase tracking-wider">
                Sales Overview
              </h2>
              <p className="text-xs text-neutral-500 font-light">Weekly revenue trajectory</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-neutral-100 rounded-md text-neutral-700">
              This Week
            </span>
          </div>

          {/* SVG Trend Line Visual */}
          <div className="relative h-60 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#E5E5E5" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="#E5E5E5" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#E5E5E5" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="700" y2="190" stroke="#E5E5E5" />

              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#171717"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="50,150 150,130 250,140 350,110 450,115 550,65 650,45"
              />

              {/* Data Points */}
              {salesOverview.map((item: any, idx: number) => {
                const x = 50 + idx * 100;
                const ys = [150, 130, 140, 110, 115, 65, 45];
                const y = ys[idx] || 100;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5" fill="#FFFFFF" stroke="#171717" strokeWidth="3" />
                  </g>
                );
              })}
            </svg>

            {/* Labels under line */}
            <div className="flex justify-between px-6 pt-3 text-xs font-semibold text-neutral-500">
              {salesOverview.map((item: any) => (
                <span key={item.day}>{item.day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories Donut Breakdown */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-neutral-900 uppercase tracking-wider mb-1">
              Top Categories
            </h2>
            <p className="text-xs text-neutral-500 font-light mb-6">Distribution by collection share</p>

            {/* Donut SVG Ring */}
            <div className="flex justify-center my-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#E5E5E5" strokeWidth="16" />
                  {/* Suits 38% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#171717"
                    strokeWidth="16"
                    strokeDasharray="91 238"
                    strokeDashoffset="0"
                  />
                  {/* Kurti Sets 24% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#4B5563"
                    strokeWidth="16"
                    strokeDasharray="57 238"
                    strokeDashoffset="-91"
                  />
                  {/* Co-ord Sets 16% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#9CA3AF"
                    strokeWidth="16"
                    strokeDasharray="38 238"
                    strokeDashoffset="-148"
                  />
                  {/* Dresses 12% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#D1D5DB"
                    strokeWidth="16"
                    strokeDasharray="28 238"
                    strokeDashoffset="-186"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="font-serif text-xl font-bold text-neutral-900 block leading-none">
                    100%
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Share</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#171717]"></span>
                <span>Suits</span>
              </span>
              <strong className="text-neutral-900 font-semibold">38%</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4B5563]"></span>
                <span>Kurti Sets</span>
              </span>
              <strong className="text-neutral-900 font-semibold">24%</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]"></span>
                <span>Co-ord Sets</span>
              </span>
              <strong className="text-neutral-900 font-semibold">16%</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D1D5DB]"></span>
                <span>Dresses</span>
              </span>
              <strong className="text-neutral-900 font-semibold">12%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent Orders Live Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-subtle p-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div>
            <h2 className="font-serif text-base font-bold text-neutral-900 uppercase tracking-wider">
              Recent Orders
            </h2>
            <p className="text-xs text-neutral-500 font-light">Latest customer orders awaiting action</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-neutral-800 hover:text-black flex items-center gap-1 underline"
          >
            <span>View All Orders</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-2 text-center">Payment</th>
                <th className="py-3 px-2 text-center">Fulfillment</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-neutral-900">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-2">
                    <p className="font-semibold text-neutral-900">{order.customerName}</p>
                    <p className="text-[11px] text-neutral-400">{order.customerEmail}</p>
                  </td>
                  <td className="py-3 px-2 text-neutral-500">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-2 text-right font-bold text-neutral-900">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.paymentStatus} ({order.paymentMethod})
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Link
                      href="/admin/orders"
                      className="px-2.5 py-1 bg-neutral-900 hover:bg-black text-white text-[11px] font-semibold rounded"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
