"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Clock,
  Search,
  ExternalLink,
  CheckCircle,
  Phone,
  MessageSquare,
  DollarSign,
  Truck,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Send,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { PreOrderItem, PreOrderStatus } from "@/types";

interface PreOrdersTabProps {
  onOpenAddPreOrder: () => void;
  onEditPreOrder: (item: PreOrderItem) => void;
}

export default function PreOrdersTab({
  onOpenAddPreOrder,
  onEditPreOrder,
}: PreOrdersTabProps) {
  const {
    preOrders,
    updatePreOrderStatus,
    deletePreOrder,
    globalSearch,
    openConfirmModal,
  } = useDashboard();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState<string>("" );

  const STATUS_LABELS: { [key in PreOrderStatus]: { label: string; color: string } } = {
    new: { label: "New Request", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    reviewing: { label: "Reviewing Spec", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    quoted: { label: "Quote Sent", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    deposit_paid: { label: "Deposit Received", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    sourced: { label: "Sourced Overseas", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
    in_transit: { label: "In Transit to BD", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
    delivered: { label: "Delivered to Player", color: "bg-[#84cc16]/10 text-[#84cc16] border-[#84cc16]/20" },
    cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  };

  const filteredPreOrders = useMemo(() => {
    const q = (globalSearch || localSearch).toLowerCase().trim();
    return preOrders.filter((item) => {
      const matchesSearch =
        !q ||
        item.refNumber.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.customerPhone.toLowerCase().includes(q) ||
        item.productInfo.toLowerCase().includes(q) ||
        item.deliveryAddress.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [preOrders, globalSearch, localSearch, statusFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Custom Pre-Orders & Direct Imports</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20 font-bold">
              {preOrders.length} In System
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage custom cricket bats, bespoke weight requests, and overseas gear imports from UK, India & Australia.
          </p>
        </div>

        <button
          onClick={onOpenAddPreOrder}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black font-bold text-sm shadow-lg shadow-[#84cc16]/15 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>New Pre-Order Request</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121217] border border-[#202028] flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search ref #, customer phone, requested bat model..."
            className="w-full bg-[#181820] text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 rounded-xl pl-9 pr-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#181820] text-xs text-zinc-300 rounded-xl px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#84cc16]"
        >
          <option value="all">All Stages</option>
          <option value="new">New Requests</option>
          <option value="reviewing">Reviewing Spec</option>
          <option value="quoted">Quoted</option>
          <option value="deposit_paid">Deposit Paid</option>
          <option value="sourced">Sourced Overseas</option>
          <option value="in_transit">In Transit to BD</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Pre-Orders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPreOrders.map((item) => {
          const statusConfig = STATUS_LABELS[item.status] || STATUS_LABELS.new;
          const cleanPhone = item.customerPhone.replace(/[^0-9]/g, "");

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#121217] border border-[#202028] hover:border-[#84cc16]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Ref number, OTP badge, Status */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">
                      #{item.refNumber}
                    </span>
                    {item.isOtpVerified ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20">
                        <CheckCircle className="w-3 h-3" />
                        <span>OTP Verified</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                        Unverified
                      </span>
                    )}
                  </div>

                  <select
                    value={item.status}
                    onChange={(e) =>
                      updatePreOrderStatus(item.id, e.target.value as PreOrderStatus)
                    }
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${statusConfig.color}`}
                  >
                    <option value="new" className="bg-[#181820] text-amber-400">
                      New Request
                    </option>
                    <option value="reviewing" className="bg-[#181820] text-blue-400">
                      Reviewing Spec
                    </option>
                    <option value="quoted" className="bg-[#181820] text-purple-400">
                      Quote Sent
                    </option>
                    <option value="deposit_paid" className="bg-[#181820] text-emerald-400">
                      Deposit Received
                    </option>
                    <option value="sourced" className="bg-[#181820] text-indigo-400">
                      Sourced Overseas
                    </option>
                    <option value="in_transit" className="bg-[#181820] text-cyan-400">
                      In Transit
                    </option>
                    <option value="delivered" className="bg-[#181820] text-[#84cc16]">
                      Delivered
                    </option>
                    <option value="cancelled" className="bg-[#181820] text-red-400">
                      Cancelled
                    </option>
                  </select>
                </div>

                {/* Requested Product Info */}
                <div className="mt-4">
                  <h3 className="font-bold text-zinc-100 text-sm leading-snug">
                    {item.productInfo}
                  </h3>
                  {item.referenceUrl && (
                    <a
                      href={item.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#84cc16] hover:underline mt-1.5 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Reference Spec Link</span>
                    </a>
                  )}
                </div>

                {/* Financials & ETA */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                      Quoted Price
                    </span>
                    <span className="text-sm font-black text-white">
                      {item.quotedPrice ? `৳ ${item.quotedPrice.toLocaleString()}` : "Awaiting Quote"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                      Advance Deposit
                    </span>
                    <span className="text-sm font-bold text-[#84cc16]">
                      {item.depositAmount && item.depositAmount > 0
                        ? `৳ ${item.depositAmount.toLocaleString()}`
                        : "৳ 0"}
                    </span>
                  </div>
                  {item.estimatedDeliveryDate && (
                    <div className="col-span-2 pt-2 border-t border-zinc-800 flex items-center gap-1.5 text-xs text-zinc-300">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Estimated Arrival: {item.estimatedDeliveryDate}</span>
                    </div>
                  )}
                </div>

                {/* Customer Details */}
                <div className="mt-3 text-xs text-zinc-400 space-y-1">
                  <div>
                    <span className="text-zinc-500">Customer:</span>{" "}
                    <span className="font-semibold text-zinc-200">{item.customerName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Contact:</span>{" "}
                    <span className="text-zinc-300">{item.customerPhone} • {item.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Delivery Address:</span>{" "}
                    <span className="text-zinc-300">{item.deliveryAddress}</span>
                  </div>
                  {item.adminNotes && (
                    <div className="p-2 rounded-lg bg-zinc-800/60 text-[11px] text-zinc-300 mt-2">
                      <span className="font-bold text-amber-400">Admin Note:</span> {item.adminNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Contact Buttons */}
              <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditPreOrder(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#84cc16] hover:bg-[#a3e635] text-black text-xs font-bold transition-colors"
                  >
                    Assign Quote & ETA
                  </button>
                  <button
                    onClick={() => {
                      openConfirmModal({
                        title: "Delete Pre-Order?",
                        message: `Are you sure you want to delete pre-order #${item.refNumber} for "${item.productInfo}"?`,
                        confirmText: "Delete Pre-Order",
                        type: "danger",
                        onConfirm: () => deletePreOrder(item.id),
                      });
                    }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete Request"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPreOrders.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 text-sm rounded-2xl bg-[#121217] border border-[#202028]">
            No custom pre-orders found.
          </div>
        )}
      </div>
    </div>
  );
}
