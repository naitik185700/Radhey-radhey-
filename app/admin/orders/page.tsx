'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  Truck,
  Printer,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  X,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Status Update State
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [updateMessage, setUpdateMessage] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const openOrderModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || '');
    setCourierName(order.courierName || 'BlueDart Express');
    setUpdateMessage('');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    setUpdateMessage('');

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newStatus,
          trackingNumber: trackingNumber || null,
          courierName: courierName || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update order');
      }

      setUpdateMessage(data.message || 'Order updated successfully!');
      await loadOrders();
      setTimeout(() => setIsModalOpen(false), 1500);
    } catch (err: any) {
      setUpdateMessage(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const statuses = [
    'ALL',
    'CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'RETURNED',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Order Fulfillment & Invoices
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-light">
            Review live orders, update statuses, assign shipping tracking, and print tax invoices.
          </p>
        </div>
      </div>

      {/* Filter Strip & Search */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-subtle flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search order #, customer, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Payment</th>
                <th className="py-3.5 px-4 text-center">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-400" />
                    <span>Loading orders...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      {o.orderNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-neutral-900">{o.customerName}</p>
                      <p className="text-[11px] text-neutral-500">{o.customerEmail}</p>
                      <p className="text-[11px] text-neutral-400">{o.customerPhone}</p>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-500">{formatDate(o.createdAt)}</td>

                    <td className="py-3.5 px-4 text-right font-bold text-neutral-900">
                      {formatPrice(o.totalAmount)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.paymentStatus} ({o.paymentMethod})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          o.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.orderStatus === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : o.orderStatus === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openOrderModal(o)}
                        className="px-3 py-1.5 bg-neutral-900 text-white rounded font-semibold text-[11px] hover:bg-black"
                      >
                        Manage
                      </button>
                      <Link
                        href={`/order-success/${o.orderNumber}`}
                        target="_blank"
                        className="p-1.5 text-neutral-500 hover:text-black inline-block"
                        title="Print Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Management Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto text-xs space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                <div>
                  <h2 className="font-serif text-lg font-bold text-neutral-900">
                    Order Details: {selectedOrder.orderNumber}
                  </h2>
                  <p className="text-[11px] text-neutral-500">Placed on {formatDate(selectedOrder.createdAt)}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5 text-neutral-400 hover:text-black" />
                </button>
              </div>

              {updateMessage && (
                <div className="p-3 bg-neutral-100 border border-neutral-300 text-neutral-800 rounded font-medium">
                  {updateMessage}
                </div>
              )}

              {/* Customer & Address */}
              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div>
                  <strong className="block text-neutral-900 mb-1">Customer:</strong>
                  <p className="font-semibold text-neutral-900">{selectedOrder.customerName}</p>
                  <p className="text-neutral-500">{selectedOrder.customerEmail}</p>
                  <p className="text-neutral-500">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <strong className="block text-neutral-900 mb-1">Shipping Address:</strong>
                  <p className="text-neutral-700">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Items Ordered */}
              <div>
                <strong className="block text-neutral-900 mb-2">Order Line Items:</strong>
                <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="p-3 flex justify-between items-center bg-white">
                      <div>
                        <p className="font-semibold text-neutral-900">{item.productName}</p>
                        <p className="text-[11px] text-neutral-500">{item.variantDetails}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-neutral-900">{formatPrice(item.totalPrice)}</p>
                        <p className="text-[11px] text-neutral-400">Qty: {item.quantity} &times; {formatPrice(item.unitPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleUpdateStatus} className="space-y-4 pt-4 border-t border-neutral-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Fulfillment Status *</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-semibold"
                    >
                      <option value="CONFIRMED">CONFIRMED (Awaiting Packing)</option>
                      <option value="PROCESSING">PROCESSING (Tailoring / Stitching)</option>
                      <option value="PACKED">PACKED (Ready for Pickup)</option>
                      <option value="SHIPPED">SHIPPED (In Transit)</option>
                      <option value="DELIVERED">DELIVERED (Fulfilled)</option>
                      <option value="CANCELLED">CANCELLED (Restores Stock Automatically)</option>
                      <option value="RETURNED">RETURNED (Reverse Pickup Received)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Courier Service</label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. BlueDart, DTDC, Delhivery"
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-700 mb-1">Tracking Number / AWB</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. BD-8829104712"
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <Link
                    href={`/order-success/${selectedOrder.orderNumber}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black underline"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Official Receipt</span>
                  </Link>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                      {isUpdating ? 'Saving...' : 'Update Status'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
