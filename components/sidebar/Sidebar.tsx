"use client";

import React from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Clock,
  Users,
  Tag,
  BookOpen,
  Star,
  Settings,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { TabType } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const {
    activeTab,
    setActiveTab,
    orders,
    preOrders,
    products,
    expertBookings,
    reviews,
    banners,
  } = useDashboard();

  // Badges calculations
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const activePreOrders = preOrders.filter((p) => p.status === "new" || p.status === "reviewing").length;
  const pendingBookings = expertBookings.filter((b) => b.status === "pending").length;
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;
  const heroBanners = banners.filter((b) => b.type === "hero");

  const NAV_ITEMS: {
    id: TabType;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "top-banners",
      label: "Top Banners",
      icon: ImageIcon,
      badge: heroBanners.length,
      badgeColor: "bg-[#84cc16] text-black",
    },
    { id: "products", label: "Products & Stock", icon: Package, badge: products.length },
    {
      id: "orders",
      label: "Customer Orders",
      icon: ShoppingCart,
      badge: pendingOrders > 0 ? pendingOrders : undefined,
      badgeColor: "bg-amber-500 text-black",
    },
    {
      id: "pre-orders",
      label: "Custom Pre-Orders",
      icon: Clock,
      badge: activePreOrders > 0 ? activePreOrders : undefined,
      badgeColor: "bg-[#84cc16] text-black",
    },
    {
      id: "experts",
      label: "Hire Experts",
      icon: Users,
      badge: pendingBookings > 0 ? pendingBookings : undefined,
      badgeColor: "bg-blue-500 text-white",
    },
    { id: "deals", label: "Deals & Coupons", icon: Tag },
    { id: "blog", label: "Cricket Blog", icon: BookOpen },
    {
      id: "reviews",
      label: "Customer Reviews",
      icon: Star,
      badge: pendingReviews > 0 ? pendingReviews : undefined,
      badgeColor: "bg-purple-500 text-white",
    },
    { id: "settings", label: "Store Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0c0c0f] border-r border-[#1f1f26] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Brand Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#1f1f26]">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-40">
              <Image
                src="/images/playzone-logo-transparent-white.png"
                alt="Playzone"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Control Center
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? "bg-[#84cc16] text-black font-semibold shadow-lg shadow-[#84cc16]/20"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-[#181820]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? "text-black" : "text-zinc-400 group-hover:text-[#84cc16]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-black/20 text-black"
                          : item.badgeColor || "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-black" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Storefront Link & Admin Profile */}
        <div className="p-4 border-t border-[#1f1f26] bg-[#0f0f13] space-y-3">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2.5 bg-gradient-to-r from-zinc-900 to-[#181820] border border-zinc-800 hover:border-[#84cc16]/50 rounded-xl text-xs font-semibold text-zinc-200 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#84cc16]">🏏</span>
              <span>View Live Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#84cc16] transition-colors" />
          </a>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#84cc16] to-[#a3e635] flex items-center justify-center text-black font-black text-sm">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-xs font-bold text-white truncate">
                <span>Shamim Ahsan</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#84cc16]" />
              </div>
              <p className="text-[11px] text-zinc-400 truncate">Store Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
