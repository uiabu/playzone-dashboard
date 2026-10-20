"use client";

import React from "react";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Package,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Users,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { Order, OrderStatus } from "@/types";

interface OverviewTabProps {
  onViewOrder: (order: Order) => void;
  onOpenAddProduct: () => void;
  onOpenAddPreOrder: () => void;
}

export default function OverviewTab({
  onViewOrder,
  onOpenAddProduct,
  onOpenAddPreOrder,
}: OverviewTabProps) {
  const {
    products,
    orders,
    preOrders,
    expertBookings,
    setActiveTab,
    updateOrderStatus,
  } = useDashboard();

  // Financial calculations
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing");
  const lowStockProducts = products.filter((p) => p.stockCount <= 5);
  const activePreOrders = preOrders.filter((p) => p.status !== "delivered" && p.status !== "cancelled");

  // Status badge helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>;
      case "confirmed":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Confirmed</span>;
      case "processing":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Processing</span>;
      case "shipped":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Shipped</span>;
      case "delivered":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20">Delivered</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Cancelled</span>;
    }
  };

  // Mock weekly sales chart data
  const weeklySales = [
    { day: "Sat", amount: 48500, orders: 4 },
    { day: "Sun", amount: 62000, orders: 5 },
    { day: "Mon", amount: 39000, orders: 3 },
    { day: "Tue", amount: 84000, orders: 7 },
    { day: "Wed", amount: 55000, orders: 4 },
    { day: "Thu", amount: 92500, orders: 8 },
    { day: "Fri", amount: 115000, orders: 11 }, // Match days have highest cricket sales
  ];

  const maxSale = Math.max(...weeklySales.map((d) => d.amount));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. TOP HERO GREETING & QUICK SHORTCUTS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#14141a] via-[#111116] to-[#0d0d12] border border-[#22222a]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#84cc16]">
            <span>Official Operations Center</span>
            <span>•</span>
            <span>Dhaka, Bangladesh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Playzone Store Command
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time management for cricket gear, international pre-orders, and expert coaching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black font-bold text-xs shadow-md transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={onOpenAddPreOrder}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-all"
          >
            <Clock className="w-4 h-4 text-[#84cc16]" />
            <span>New Pre-Order Quote</span>
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#121217] border border-[#202028] hover:border-[#84cc16]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-[#84cc16]/10 text-[#84cc16] flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-white">
              ৳ {totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#84cc16]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-[#121217] border border-[#202028] hover:border-amber-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-white">{orders.length}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400">
              <span>{pendingOrders.length} pending fulfillment</span>
            </div>
          </div>
        </div>

        {/* Custom Pre-Orders */}
        <div className="p-5 rounded-2xl bg-[#121217] border border-[#202028] hover:border-blue-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Custom Pre-Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-white">{activePreOrders.length}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-400">
              <span>UK & Overseas direct imports</span>
            </div>
          </div>
        </div>

        {/* Expert Bookings */}
        <div className="p-5 rounded-2xl bg-[#121217] border border-[#202028] hover:border-purple-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Expert Sessions</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-white">{expertBookings.length}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-400">
              <span>Coaches & Throwdown sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SALES REVENUE CHART & URGENT ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#121217] border border-[#202028]">
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white">Revenue & Orders Activity</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Weekly match-day gear performance in BDT (৳)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#84cc16]"></span>
              <span className="text-xs text-zinc-400 font-medium">Sales Volume</span>
            </div>
          </div>

          {/* Custom Visual Bar Chart */}
          <div className="mt-6 h-52 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklySales.map((item) => {
              const heightPct = Math.round((item.amount / maxSale) * 100);
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded shadow">
                    ৳{(item.amount / 1000).toFixed(0)}k
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-zinc-800 to-[#84cc16] group-hover:to-[#a3e635] transition-all relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors">
                    {item.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock & Action Alerts */}
        <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Stock Warnings</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                {lowStockProducts.length} low
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {lowStockProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-zinc-200 truncate">{p.name}</div>
                    <div className="text-[11px] text-zinc-500">{p.brand} • {p.category}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {p.stockCount} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab("products")}
            className="w-full mt-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Manage All Inventory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. RECENT ORDERS TABLE */}
      <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Store Orders</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live orders from Playzone online checkout
            </p>
          </div>
          <button
            onClick={() => setActiveTab("orders")}
            className="text-xs font-bold text-[#84cc16] hover:underline flex items-center gap-1"
          >
            <span>View All Orders ({orders.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800/80">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-white">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-zinc-200">{order.customerName}</div>
                    <div className="text-xs text-zinc-500">{order.city} • {order.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-3 text-zinc-400 text-xs">
                    {order.items.length} gear item(s)
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white">
                    ৳ {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-xs font-medium uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === "pending" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "confirmed")}
                          className="px-2.5 py-1 rounded-lg bg-[#84cc16] hover:bg-[#a3e635] text-black text-xs font-bold transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
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
