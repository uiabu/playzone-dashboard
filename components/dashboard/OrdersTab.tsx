"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { Order, OrderStatus, PaymentStatus } from "@/types";

interface OrdersTabProps {
  onViewOrder: (order: Order) => void;
  onOpenAddOrder: () => void;
}

export default function OrdersTab({ onViewOrder, onOpenAddOrder }: OrdersTabProps) {
  const {
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    globalSearch,
    openConfirmModal,
  } = useDashboard();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState<string>("");

  const STATUS_TABS = [
    { id: "all", label: "All Orders", count: orders.length },
    {
      id: "pending",
      label: "Pending",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      id: "confirmed",
      label: "Confirmed",
      count: orders.filter((o) => o.status === "confirmed").length,
    },
    {
      id: "processing",
      label: "Processing",
      count: orders.filter((o) => o.status === "processing").length,
    },
    {
      id: "shipped",
      label: "Shipped",
      count: orders.filter((o) => o.status === "shipped").length,
    },
    {
      id: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.status === "delivered").length,
    },
  ];

  const filteredOrders = useMemo(() => {
    const q = (globalSearch || localSearch).toLowerCase().trim();
    return orders.filter((order) => {
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.toLowerCase().includes(q) ||
        order.city.toLowerCase().includes(q) ||
        order.shippingAddress.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "all" || order.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, globalSearch, localSearch, statusFilter, paymentFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Customer Orders</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              {orders.length} Placed
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track deliveries, confirm bKash payments, and dispatch cricket gear shipments.
          </p>
        </div>

        <button
          onClick={onOpenAddOrder}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black font-bold text-sm shadow-lg shadow-[#84cc16]/15 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>New Manual Order</span>
        </button>
      </div>

      {/* Status Pipeline Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#84cc16] text-black shadow-md shadow-[#84cc16]/15"
                  : "bg-[#141419] text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121217] border border-[#202028] flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search order #, customer phone, city, address..."
            className="w-full bg-[#181820] text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 rounded-xl pl-9 pr-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="bg-[#181820] text-xs text-zinc-300 rounded-xl px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#84cc16]"
        >
          <option value="all">All Payment Methods</option>
          <option value="bkash">bKash</option>
          <option value="cod">Cash on Delivery (COD)</option>
          <option value="nagad">Nagad</option>
          <option value="card">Credit / Debit Card</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#121217] border border-[#202028] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase bg-[#181820]/60 border-b border-zinc-800">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Ordered Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-zinc-900/50 transition-colors group"
                >
                  {/* Order Number & Date */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-white">
                      {order.orderNumber}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  {/* Customer Details */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-zinc-200">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-zinc-400">{order.customerPhone}</div>
                    <div className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                      {order.shippingAddress}, {order.city}
                    </div>
                  </td>

                  {/* Items summary */}
                  <td className="py-3.5 px-4">
                    <div className="text-xs text-zinc-300 font-medium">
                      {order.items.map((it) => it.productName).join(", ").substring(0, 40)}
                      {order.items.length > 1 ? "..." : ""}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      {order.items.reduce((s, it) => s + it.quantity, 0)} item(s) total
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="py-3.5 px-4">
                    <div className="font-black text-white">
                      ৳ {order.totalAmount.toLocaleString()}
                    </div>
                    {order.deliveryFee > 0 && (
                      <div className="text-[11px] text-zinc-500">
                        +৳{order.deliveryFee} shipping
                      </div>
                    )}
                  </td>

                  {/* Payment Info & Quick Toggle */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 inline-block w-max">
                        {order.paymentMethod}
                      </span>
                      <button
                        onClick={() =>
                          updatePaymentStatus(
                            order.id,
                            order.paymentStatus === "paid" ? "unpaid" : "paid"
                          )
                        }
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block w-max transition-colors ${
                          order.paymentStatus === "paid"
                            ? "bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                        title="Click to toggle Paid/Unpaid"
                      >
                        {order.paymentStatus === "paid" ? "● Paid" : "○ Unpaid"}
                      </button>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                        order.status === "delivered"
                          ? "bg-[#84cc16]/10 text-[#84cc16] border-[#84cc16]/30"
                          : order.status === "shipped"
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                          : order.status === "processing"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : order.status === "confirmed"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : order.status === "cancelled"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      <option value="pending" className="bg-[#181820] text-amber-400">
                        Pending
                      </option>
                      <option value="confirmed" className="bg-[#181820] text-blue-400">
                        Confirmed
                      </option>
                      <option value="processing" className="bg-[#181820] text-purple-400">
                        Processing
                      </option>
                      <option value="shipped" className="bg-[#181820] text-cyan-400">
                        Shipped
                      </option>
                      <option value="delivered" className="bg-[#181820] text-[#84cc16]">
                        Delivered
                      </option>
                      <option value="cancelled" className="bg-[#181820] text-red-400">
                        Cancelled
                      </option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-[#84cc16] hover:text-black transition-colors"
                        title="View Full Order Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          openConfirmModal({
                            title: "Delete Order?",
                            message: `Are you sure you want to delete order ${order.orderNumber} placed by ${order.customerName}?`,
                            confirmText: "Delete Order",
                            type: "danger",
                            onConfirm: () => deleteOrder(order.id),
                          });
                        }}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 text-sm">
                    No orders match your active filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
