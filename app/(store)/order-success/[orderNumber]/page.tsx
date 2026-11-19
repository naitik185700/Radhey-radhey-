import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CheckCircle2, Printer, ArrowRight, Package, Truck, Calendar, MapPin } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import PrintInvoiceButton from './PrintInvoiceButton';

interface OrderSuccessProps {
  params: { orderNumber: string };
}

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  const order = await prisma.order.findFirst({
    where: { orderNumber: params.orderNumber },
    include: {
      items: {
        include: {
          product: {
            include: { images: { take: 1 } },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Success Badge */}
      <div className="text-center space-y-3 mb-10">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-subtle animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order Successfully Placed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
          Thank You For Shopping With Us!
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto font-light">
          We have received your order <strong>{order.orderNumber}</strong>. A confirmation details
          summary has been sent to <strong>{order.customerEmail}</strong>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <PrintInvoiceButton orderNumber={order.orderNumber} />
          <Link
            href="/shop"
            className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div id="printable-invoice" className="bg-white rounded-xl border border-neutral-200 shadow-premium p-6 sm:p-10 space-y-8">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-neutral-200 gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-neutral-900">
              Radhey Radhey Girls Point
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Heritage Fashion Market, Jaipur, Rajasthan</p>
            <p className="text-xs text-neutral-500">GSTIN / Invoice Registration Verified</p>
          </div>

          <div className="sm:text-right text-xs text-neutral-600 space-y-1">
            <p><span className="font-semibold text-neutral-900">Invoice / Order #:</span> {order.orderNumber}</p>
            <p><span className="font-semibold text-neutral-900">Date:</span> {formatDate(order.createdAt)}</p>
            <p><span className="font-semibold text-neutral-900">Payment Method:</span> {order.paymentMethod}</p>
            <p>
              <span className="font-semibold text-neutral-900">Payment Status:</span>{' '}
              <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {order.paymentStatus}
              </span>
            </p>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-700 bg-neutral-50 p-4 rounded-lg">
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-neutral-900 mb-1.5 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-neutral-500" />
              <span>Customer Details</span>
            </h3>
            <p className="font-medium text-neutral-900">{order.customerName}</p>
            <p>{order.customerEmail}</p>
            <p>{order.customerPhone}</p>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-neutral-900 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              <span>Delivery Address</span>
            </h3>
            <p className="font-medium text-neutral-900">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 pb-2 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5">Item</th>
                <th className="py-2.5">Details</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 font-medium text-neutral-900 flex items-center gap-3">
                    {item.product?.images[0] && (
                      <div className="relative w-10 h-12 rounded overflow-hidden bg-neutral-100 flex-shrink-0">
                        <Image
                          src={item.product.images[0].url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span>{item.productName}</span>
                  </td>
                  <td className="py-3 text-neutral-500">{item.variantDetails || 'Standard'}</td>
                  <td className="py-3 text-center font-medium">{item.quantity}</td>
                  <td className="py-3 text-right">{formatPrice(item.unitPrice)}</td>
                  <td className="py-3 text-right font-bold text-neutral-900">
                    {formatPrice(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="border-t border-neutral-200 pt-4 flex justify-end">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-medium text-neutral-900">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({order.couponCode || 'Coupon'}):</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Shipping Fee:</span>
              <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-sm text-neutral-900">
              <span>Total Paid/Due:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
