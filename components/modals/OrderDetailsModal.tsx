"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  Printer,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Package,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { useDashboard } from "@/context/DashboardContext";

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  onClose,
}: OrderDetailsModalProps) {
  const { updateOrderStatus, updatePaymentStatus, settings } = useDashboard();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#121217] border border-[#202028] rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Actions Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 bg-[#16161c]">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-base text-white">
              Order #{order.orderNumber}
            </span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                order.status === "delivered"
                  ? "bg-[#84cc16]/10 text-[#84cc16]"
                  : order.status === "cancelled"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4 text-[#84cc16]" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Invoice Store Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <div className="relative h-8 w-36 mb-2">
                <Image
                  src="/images/playzone-logo-transparent-white.png"
                  alt="Playzone"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-xs text-zinc-400">
                {settings.tagline}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {settings.dhakaAddress}
              </p>
              <p className="text-xs text-zinc-500">
                Hotline: {settings.phone} • WhatsApp: {settings.whatsapp}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs uppercase font-bold text-zinc-500 block">
                Official Tax Invoice
              </span>
              <span className="font-mono font-black text-lg text-white">
                {order.orderNumber}
              </span>
              <p className="text-xs text-zinc-400 mt-1">
                Date:{" "}
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                Customer Name
              </span>
              <span className="font-bold text-sm text-zinc-200">
                {order.customerName}
              </span>
              <div className="text-xs text-zinc-400 mt-1">
                Phone: {order.customerPhone}
              </div>
              {order.customerEmail && (
                <div className="text-xs text-zinc-400">
                  Email: {order.customerEmail}
                </div>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                Delivery Address
              </span>
              <span className="text-xs text-zinc-300 font-medium leading-relaxed block">
                {order.shippingAddress}, {order.city}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  Payment: {order.paymentMethod}
                </span>
                <span
                  className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                    order.paymentStatus === "paid"
                      ? "bg-[#84cc16]/10 text-[#84cc16]"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Itemized Gear List
            </h4>
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-zinc-900/80 text-zinc-400 uppercase border-b border-zinc-800">
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {order.items.map((it, idx) => (
                    <tr key={idx} className="text-zinc-200">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{it.productName}</div>
                        {(it.selectedSize || it.selectedWeight) && (
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            {it.selectedSize} {it.selectedWeight && `• ${it.selectedWeight}`}
                          </div>
                        )}
                        {it.selectedServices && it.selectedServices.length > 0 && (
                          <div className="text-[10px] font-semibold text-[#84cc16] mt-0.5">
                            + Includes Professional Machine Knocking & Prep
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-bold">{it.quantity}</td>
                      <td className="py-3 px-3 text-right">
                        ৳ {it.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-white">
                        ৳ {(it.price * it.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Gear Subtotal:</span>
                <span className="font-bold text-zinc-200">
                  ৳ {order.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Delivery Courier:</span>
                <span className="font-bold text-zinc-200">
                  {order.deliveryFee > 0 ? `৳ ${order.deliveryFee}` : "FREE (Promo)"}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#84cc16]">
                  <span>Discount Applied:</span>
                  <span className="font-bold">- ৳ {order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                <span>Total Amount:</span>
                <span className="text-[#84cc16]">
                  ৳ {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300">
              <span className="font-bold text-amber-400">Customer Note:</span> {order.notes}
            </div>
          )}

          {/* Quick Status Adjuster inside Modal */}
          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400">Set Status:</span>
              {(["pending", "confirmed", "processing", "shipped", "delivered"] as OrderStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => updateOrderStatus(order.id, st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                      order.status === st
                        ? "bg-[#84cc16] text-black"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                updatePaymentStatus(
                  order.id,
                  order.paymentStatus === "paid" ? "unpaid" : "paid"
                )
              }
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                order.paymentStatus === "paid"
                  ? "bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              Mark {order.paymentStatus === "paid" ? "Unpaid" : "Paid"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
