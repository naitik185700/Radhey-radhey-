'use client';

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  History,
  Plus,
  Minus,
  RefreshCw,
  Search,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<'variants' | 'transactions'>('variants');
  const [variants, setVariants] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Stock Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [changeQty, setChangeQty] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('RESTOCK');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory?lowStock=${lowStockFilter}`);
      if (res.ok) {
        const data = await res.json();
        setVariants(data.variants || []);
        setSummary(data.summary || {});
      }

      const txRes = await fetch('/api/inventory/transactions?limit=50');
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [lowStockFilter]);

  const openAdjustModal = (v: any) => {
    setSelectedVariant(v);
    setChangeQty('10');
    setAdjustmentType('RESTOCK');
    setReason('Warehouse restock replenishment');
    setErrorMsg('');
    setIsAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const qtyNumber = parseInt(changeQty);
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          changeQuantity: qtyNumber,
          adjustmentType,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update stock');
      }

      setIsAdjustModalOpen(false);
      await loadInventory();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVariants = variants.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.sku.toLowerCase().includes(q) ||
      v.product?.name.toLowerCase().includes(q) ||
      v.size.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-light">
            Real-time warehouse stock, variant SKUs, alerts, and complete transaction history.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-white border border-neutral-200 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab('variants')}
            className={`px-4 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'variants' ? 'bg-black text-white shadow-sm' : 'text-neutral-600 hover:text-black'
            }`}
          >
            Variant Stock
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'transactions' ? 'bg-black text-white shadow-sm' : 'text-neutral-600 hover:text-black'
            }`}
          >
            Audit Log / History
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase">Total Units</span>
          <p className="text-2xl font-bold font-serif text-neutral-900 mt-1">
            {summary.totalStock || 0}
          </p>
          <span className="text-[10px] text-neutral-400">Across {summary.totalSkus || 0} active SKUs</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase">Low Stock Alerts</span>
          <p className="text-2xl font-bold font-serif text-amber-600 mt-1">
            {summary.lowStockCount || 0}
          </p>
          <button
            onClick={() => setLowStockFilter(!lowStockFilter)}
            className="text-[10px] font-semibold text-amber-700 underline"
          >
            {lowStockFilter ? 'Show all' : 'Filter &le; 10 units'}
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase">Out of Stock</span>
          <p className="text-2xl font-bold font-serif text-red-600 mt-1">
            {summary.outOfStockCount || 0}
          </p>
          <span className="text-[10px] text-neutral-400">Needs urgent restocking</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-subtle">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase">Audit Records</span>
          <p className="text-2xl font-bold font-serif text-neutral-900 mt-1">
            {transactions.length}
          </p>
          <span className="text-[10px] text-neutral-400">Full tamper-evident logs</span>
        </div>
      </div>

      {/* Tab 1: Variant Stock Table */}
      {activeTab === 'variants' && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-subtle overflow-hidden">
          {/* Table Search */}
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search SKU or product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
            {lowStockFilter && (
              <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                Showing Low Stock Items Only
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Variant SKU</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Color</th>
                  <th className="py-3 px-4 text-center">Stock Level</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-400" />
                      <span>Loading inventory records...</span>
                    </td>
                  </tr>
                ) : filteredVariants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500">
                      No matching inventory records.
                    </td>
                  </tr>
                ) : (
                  filteredVariants.map((v) => (
                    <tr key={v.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-neutral-900">{v.sku}</td>
                      <td className="py-3 px-4 font-medium text-neutral-800">
                        {v.product?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 font-bold">{v.size}</td>
                      <td className="py-3 px-4 text-neutral-600">{v.color}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-bold px-2 py-0.5 rounded ${
                            v.stock === 0
                              ? 'bg-red-100 text-red-700'
                              : v.stock <= 10
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {v.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openAdjustModal(v)}
                          className="px-3 py-1 bg-black text-white text-[11px] font-semibold rounded hover:bg-neutral-800 transition-colors"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory Transaction Audit Log */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
              Inventory Transaction Audit History
            </h2>
            <span className="text-xs text-neutral-500">Last 50 transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Product / SKU</th>
                  <th className="py-3 px-4 text-center">Adjustment Type</th>
                  <th className="py-3 px-4 text-center">Previous</th>
                  <th className="py-3 px-4 text-center">Change</th>
                  <th className="py-3 px-4 text-center">New Balance</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4 text-neutral-500">{formatDate(tx.createdAt)}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-neutral-900">{tx.product?.name}</p>
                      <p className="text-[11px] font-mono text-neutral-400">
                        {tx.variant?.sku || tx.product?.sku}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-neutral-600">
                      {tx.previousStock}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span className={tx.changeQuantity > 0 ? 'text-emerald-600' : 'text-red-600'}>
                        {tx.changeQuantity > 0 ? `+${tx.changeQuantity}` : tx.changeQuantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-neutral-900">
                      {tx.newStock}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">{tx.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && selectedVariant && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAdjustModalOpen(false)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200 mb-4">
                <h2 className="font-serif text-lg font-bold text-neutral-900">
                  Stock Adjustment
                </h2>
                <button onClick={() => setIsAdjustModalOpen(false)}>
                  <X className="w-5 h-5 text-neutral-400 hover:text-black" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded mb-4">
                  {errorMsg}
                </div>
              )}

              <div className="mb-4 bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs space-y-1">
                <p><strong className="text-neutral-900">Product:</strong> {selectedVariant.product?.name}</p>
                <p><strong className="text-neutral-900">SKU:</strong> {selectedVariant.sku}</p>
                <p><strong className="text-neutral-900">Current Stock:</strong> <span className="font-bold text-black">{selectedVariant.stock} units</span></p>
              </div>

              <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Adjustment Type *</label>
                  <select
                    value={adjustmentType}
                    onChange={(e) => setAdjustmentType(e.target.value)}
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                  >
                    <option value="RESTOCK">RESTOCK (Warehouse Inward Batch)</option>
                    <option value="DAMAGED">DAMAGED (Damaged Goods Write-off)</option>
                    <option value="CORRECTION">CORRECTION (Physical Stock Count Audit)</option>
                    <option value="RETURN">CUSTOMER RETURN (Returned Unit to Stock)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Quantity Adjustment (use negative to reduce, e.g. -5) *
                  </label>
                  <input
                    type="number"
                    required
                    value={changeQty}
                    onChange={(e) => setChangeQty(e.target.value)}
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-bold font-mono"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    New Stock will be: {Math.max(0, selectedVariant.stock + (parseInt(changeQty) || 0))} units
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Reason / Reference *</label>
                  <input
                    type="text"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Inward consignment #INV-8821"
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAdjustModalOpen(false)}
                    className="px-4 py-2 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmitting ? 'Recording...' : 'Record Adjustment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
