'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, Calendar, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING':
      case 'CONFIRMED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8 pb-4 border-b border-neutral-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900">
            My Orders
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track your delivery status, view invoices, and order history.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-neutral-400 mx-auto mb-2" />
          <p className="text-xs text-neutral-500">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-neutral-200 p-8">
          <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-neutral-800">No Orders Placed Yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto my-3">
            Explore our handcrafted luxury ethnic suit sets, anarkalis, and kurti sets.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-neutral-200 shadow-subtle overflow-hidden"
            >
              {/* Order Card Header */}
              <div className="bg-neutral-50 p-4 sm:p-5 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Order Number</span>
                    <strong className="text-neutral-900 font-semibold">{order.orderNumber}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Date Placed</span>
                    <span className="text-neutral-800">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Total Amount</span>
                    <strong className="text-neutral-900 font-bold">{formatPrice(order.totalAmount)}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                  <Link
                    href={`/order-success/${order.orderNumber}`}
                    className="p-1.5 text-neutral-500 hover:text-black transition-colors"
                    title="View & Print Invoice"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Items in this order */}
              <div className="p-4 sm:p-6 divide-y divide-neutral-100">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image
                        src={item.product?.images[0]?.url || '/brand/product-black-suit.png'}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <h4 className="font-serif font-semibold text-neutral-900 text-sm">
                          {item.productName}
                        </h4>
                        <p className="text-neutral-500 mt-0.5">{item.variantDetails}</p>
                        <p className="text-neutral-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-neutral-900">{formatPrice(item.totalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Courier Tracking Status Bar if available */}
              {order.trackingNumber && (
                <div className="bg-neutral-100/70 p-3 px-6 text-xs text-neutral-700 border-t border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-neutral-500" />
                    <span>
                      Carrier: <strong>{order.courierName || 'BlueDart'}</strong> &bull; Tracking ID:{' '}
                      <strong>{order.trackingNumber}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
