"use client";

import React, { useState, useEffect } from "react";
import { X, Clock, DollarSign, Calendar, MessageSquare } from "lucide-react";
import { PreOrderItem, PreOrderStatus } from "@/types";

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<PreOrderItem, "id" | "refNumber" | "createdAt">,
    editId?: string
  ) => void;
  initialItem?: PreOrderItem | null;
}

export default function PreOrderModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
}: PreOrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [quotedPrice, setQuotedPrice] = useState<number | undefined>(undefined);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [status, setStatus] = useState<PreOrderStatus>("new");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (initialItem) {
      setCustomerName(initialItem.customerName);
      setCustomerPhone(initialItem.customerPhone);
      setCustomerEmail(initialItem.customerEmail);
      setDeliveryAddress(initialItem.deliveryAddress);
      setProductInfo(initialItem.productInfo);
      setReferenceUrl(initialItem.referenceUrl || "");
      setQuotedPrice(initialItem.quotedPrice);
      setDepositAmount(initialItem.depositAmount || 0);
      setEstimatedDeliveryDate(initialItem.estimatedDeliveryDate || "");
      setStatus(initialItem.status);
      setAdminNotes(initialItem.adminNotes || "");
    } else {
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setDeliveryAddress("");
      setProductInfo("");
      setReferenceUrl("");
      setQuotedPrice(undefined);
      setDepositAmount(0);
      setEstimatedDeliveryDate("");
      setStatus("new");
      setAdminNotes("");
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !productInfo) return;

    onSave(
      {
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        productInfo,
        referenceUrl: referenceUrl || undefined,
        isOtpVerified: true,
        quotedPrice: quotedPrice ? Number(quotedPrice) : undefined,
        depositAmount: Number(depositAmount),
        estimatedDeliveryDate: estimatedDeliveryDate || undefined,
        status,
        adminNotes: adminNotes || undefined,
      },
      initialItem?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#121217] border border-[#202028] rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {initialItem ? `Quote Pre-Order #${initialItem.refNumber}` : "New Custom Pre-Order"}
              </h2>
              <p className="text-xs text-zinc-400">
                Direct UK/overseas import pricing and ETA setup
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">
              Custom Gear Request Spec *
            </label>
            <textarea
              required
              rows={3}
              value={productInfo}
              onChange={(e) => setProductInfo(e.target.value)}
              placeholder="e.g., New Balance TC 1260 English Willow Bat (2.7 lbs, 10 grains, thick 41mm edges)..."
              className="w-full bg-[#181820] text-sm text-white rounded-xl p-3 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">
              Reference Catalog URL
            </label>
            <input
              type="url"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Customer Phone (WhatsApp) *
              </label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Customer Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Quoted Price (৳)
              </label>
              <input
                type="number"
                value={quotedPrice || ""}
                onChange={(e) =>
                  setQuotedPrice(e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="e.g. 25000"
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Deposit Received (৳)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Estimated Arrival
              </label>
              <input
                type="date"
                value={estimatedDeliveryDate}
                onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Pre-Order Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PreOrderStatus)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="new">New Request</option>
                <option value="reviewing">Reviewing Spec</option>
                <option value="quoted">Quote Sent</option>
                <option value="deposit_paid">Deposit Paid</option>
                <option value="sourced">Sourced Overseas</option>
                <option value="in_transit">In Transit to BD</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Internal Admin Notes
              </label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g., DHL AWB # 981240..."
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black text-xs font-bold shadow-md shadow-[#84cc16]/15 transition-all"
            >
              Save Pre-Order Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
