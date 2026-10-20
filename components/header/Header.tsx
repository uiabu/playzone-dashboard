"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  Plus,
  RefreshCw,
  ShoppingBag,
  Clock,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

interface HeaderProps {
  onMenuClick: () => void;
  onOpenAddProduct: () => void;
  onOpenAddPreOrder: () => void;
  onOpenAddCoupon: () => void;
  onOpenAddBanner?: () => void;
}

export default function Header({
  onMenuClick,
  onOpenAddProduct,
  onOpenAddPreOrder,
  onOpenAddCoupon,
  onOpenAddBanner,
}: HeaderProps) {
  const {
    globalSearch,
    setGlobalSearch,
    orders,
    preOrders,
    expertBookings,
    setActiveTab,
    resetToDefaults,
    openConfirmModal,
    refreshData,
    showToast,
  } = useDashboard();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncDatabase = async () => {
    setIsSyncing(true);
    await refreshData();
    showToast("Synced latest data from MongoDB database!", "success");
    setTimeout(() => setIsSyncing(false), 800);
  };

  // Unread/action items
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const newPreOrders = preOrders.filter((p) => p.status === "new");
  const pendingBookings = expertBookings.filter((b) => b.status === "pending");

  const totalNotifications =
    pendingOrders.length + newPreOrders.length + pendingBookings.length;

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#09090b]/90 backdrop-blur-md border-b border-[#1f1f26] px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#181820] lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search bats, orders, customers, pre-orders, experts..."
            className="w-full bg-[#121217] text-sm text-zinc-100 placeholder-zinc-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#22222a] focus:border-[#84cc16] focus:outline-none transition-all"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white px-1.5 py-0.5 rounded bg-zinc-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick actions, notifications, currency */}
      <div className="flex items-center gap-3">
        {/* Quick Add Menu */}
        <div className="relative">
          <button
            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black font-semibold text-xs sm:text-sm shadow-md shadow-[#84cc16]/10 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>

          {quickActionsOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setQuickActionsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#14141a] border border-zinc-800 shadow-2xl p-2 z-40 space-y-1">
                <button
                  onClick={() => {
                    setQuickActionsOpen(false);
                    onOpenAddProduct();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-black hover:bg-[#84cc16] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => {
                    setQuickActionsOpen(false);
                    onOpenAddPreOrder();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-black hover:bg-[#84cc16] transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span>Create Pre-Order Quote</span>
                </button>
                <button
                  onClick={() => {
                    setQuickActionsOpen(false);
                    onOpenAddCoupon();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-black hover:bg-[#84cc16] transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Promo Coupon</span>
                </button>
                {onOpenAddBanner && (
                  <button
                    onClick={() => {
                      setQuickActionsOpen(false);
                      onOpenAddBanner();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-black hover:bg-[#84cc16] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Top Hero Banner</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl bg-[#141419] border border-[#22222a] text-zinc-300 hover:text-white hover:bg-[#1b1b22] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {totalNotifications}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#14141a] border border-zinc-800 shadow-2xl p-4 z-40">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Pending Alerts ({totalNotifications})
                  </h4>
                  <span className="text-[10px] text-zinc-500">Live Updates</span>
                </div>

                <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                  {pendingOrders.length > 0 && (
                    <div
                      onClick={() => {
                        setActiveTab("orders");
                        setNotificationsOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 cursor-pointer hover:bg-amber-500/20 transition-colors"
                    >
                      <div className="text-xs font-bold text-amber-400">
                        {pendingOrders.length} New Orders Awaiting Action
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Latest: #{pendingOrders[0]?.orderNumber} from {pendingOrders[0]?.customerName}
                      </p>
                    </div>
                  )}

                  {newPreOrders.length > 0 && (
                    <div
                      onClick={() => {
                        setActiveTab("pre-orders");
                        setNotificationsOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#84cc16]/10 border border-[#84cc16]/20 cursor-pointer hover:bg-[#84cc16]/20 transition-colors"
                    >
                      <div className="text-xs font-bold text-[#84cc16]">
                        {newPreOrders.length} Custom Pre-Orders to Quote
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Latest: #{newPreOrders[0]?.refNumber} - {newPreOrders[0]?.customerName}
                      </p>
                    </div>
                  )}

                  {pendingBookings.length > 0 && (
                    <div
                      onClick={() => {
                        setActiveTab("experts");
                        setNotificationsOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 cursor-pointer hover:bg-blue-500/20 transition-colors"
                    >
                      <div className="text-xs font-bold text-blue-400">
                        {pendingBookings.length} Expert Session Requests
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {pendingBookings[0]?.expertName} - {pendingBookings[0]?.date}
                      </p>
                    </div>
                  )}

                  {totalNotifications === 0 && (
                    <div className="text-center py-6 text-zinc-500 text-xs flex flex-col items-center gap-1.5">
                      <CheckCircle className="w-5 h-5 text-[#84cc16]" />
                      <span>All caught up! No pending alerts.</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Currency Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141419] border border-[#22222a] text-xs font-bold text-zinc-300">
          <span className="text-[#84cc16]">৳</span>
          <span>BDT Store</span>
        </div>

        {/* Sync with MongoDB Database */}
        <button
          onClick={handleSyncDatabase}
          disabled={isSyncing}
          title="Sync with live database"
          className="p-2.5 rounded-xl bg-[#141419] border border-[#22222a] text-zinc-400 hover:text-[#84cc16] hover:bg-[#1b1b22] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-[#84cc16]" : ""}`} />
        </button>
      </div>
    </header>
  );
}
