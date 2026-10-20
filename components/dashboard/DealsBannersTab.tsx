"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Tag,
  Plus,
  Sparkles,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Calendar,
  Percent,
  Sliders,
  Megaphone,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { BannerItem, CouponItem } from "@/types";

interface DealsBannersTabProps {
  onOpenAddCoupon: () => void;
  onOpenAddBanner: () => void;
  onEditBanner: (banner: BannerItem) => void;
}

export default function DealsBannersTab({
  onOpenAddCoupon,
  onOpenAddBanner,
  onEditBanner,
}: DealsBannersTabProps) {
  const {
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBanner,
    coupons,
    toggleCoupon,
    deleteCoupon,
    settings,
    updateSettings,
    openConfirmModal,
  } = useDashboard();

  const [announcementText, setAnnouncementText] = useState(settings.announcementText);

  const handleSaveAnnouncement = () => {
    updateSettings({ announcementText });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Deals, Banners & Promo Codes</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/20 font-bold">
              Marketing Hub
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Control homepage carousel slides, top notification bar announcements, and discount coupons.
          </p>
        </div>

        <button
          onClick={onOpenAddCoupon}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black font-bold text-sm shadow-lg shadow-[#84cc16]/15 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Create Promo Coupon</span>
        </button>
      </div>

      {/* 1. TOP ANNOUNCEMENT BAR CONTROLLER */}
      <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Top Website Announcement Bar</h3>
              <p className="text-xs text-zinc-400">
                Displays marquee text across the very top of Playzone website
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              updateSettings({ announcementActive: !settings.announcementActive })
            }
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              settings.announcementActive
                ? "bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {settings.announcementActive ? "Active on Website" : "Hidden"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="e.g., ⚡ FREE Express Delivery across Dhaka on orders over ৳5000..."
            className="flex-1 bg-[#181820] text-sm text-zinc-100 placeholder-zinc-500 rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
          />
          <button
            onClick={handleSaveAnnouncement}
            className="px-5 py-2.5 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black font-bold text-xs transition-colors whitespace-nowrap"
          >
            Save Announcement
          </button>
        </div>
      </div>

      {/* 2. PROMO COUPONS TABLE */}
      <div className="rounded-2xl bg-[#121217] border border-[#202028] overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#84cc16]" />
              <span>Discount Promo Codes</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Coupons applied by customers at checkout
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-400">
            {coupons.length} Active Codes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase bg-[#181820]/60 border-b border-zinc-800">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Spend</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4">Usage Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-zinc-800 text-amber-400 border border-amber-400/20">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {c.discountType === "percent"
                      ? `${c.discountValue}% OFF`
                      : `৳${c.discountValue} FLAT OFF`}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    ৳ {c.minSpend.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-zinc-400">
                    {c.expiresAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-bold text-zinc-300">
                      {c.usedCount} / {c.usageLimit}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleCoupon(c.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                        c.active
                          ? "bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {c.active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        openConfirmModal({
                          title: "Delete Coupon?",
                          message: `Are you sure you want to delete promo coupon code "${c.code}" (${c.discountValue}${c.discountType === "percent" ? "%" : "৳"} OFF)?`,
                          confirmText: "Delete Coupon",
                          type: "danger",
                          onConfirm: () => deleteCoupon(c.id),
                        });
                      }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. HOMEPAGE BANNERS & CAROUSEL CARDS */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Store Banners & Sliders</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20 font-bold">
                {banners.length} Banners
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Control the visual hero sliders, mid-page promo banners, and CTA graphics on the website.
            </p>
          </div>

          <button
            onClick={onOpenAddBanner}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black text-xs font-bold shadow-md shadow-[#84cc16]/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="p-5 rounded-3xl bg-[#121217] border border-[#202028] hover:border-zinc-700/80 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="relative h-36 w-full rounded-2xl bg-zinc-950 border border-zinc-800/80 overflow-hidden mb-3.5 group-hover:border-zinc-700 transition-colors">
                  <Image
                    src={banner.imageSrc}
                    alt={banner.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  {banner.badgeText && (
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-amber-400 text-black shadow-md">
                      {banner.badgeText}
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-sm text-zinc-300 border border-white/10">
                    {banner.type.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                  <span className="text-zinc-500 uppercase tracking-wider font-sans font-bold">
                    Button: <span className="text-zinc-300">{banner.buttonText}</span>
                  </span>
                  <span className="truncate max-w-[140px] text-zinc-500" title={banner.buttonLink}>
                    {banner.buttonLink}
                  </span>
                </div>

                <h4 className="font-black text-sm text-white mt-1 leading-snug">
                  {banner.title}
                </h4>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {banner.subtitle || "No description provided."}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleBanner(banner.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    banner.active
                      ? "bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20 hover:bg-[#84cc16]/20"
                      : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {banner.active ? "● Live / Active" : "○ Hidden"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditBanner(banner)}
                    className="p-2 rounded-xl bg-zinc-800/80 hover:bg-[#84cc16] text-zinc-300 hover:text-black transition-colors"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      openConfirmModal({
                        title: "Delete Banner?",
                        message: `Are you sure you want to delete banner "${banner.title}"? This cannot be undone.`,
                        confirmText: "Delete Banner",
                        type: "danger",
                        onConfirm: () => deleteBanner(banner.id),
                      });
                    }}
                    className="p-2 rounded-xl bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {banners.length === 0 && (
            <div className="col-span-full p-12 text-center rounded-3xl bg-[#121217] border border-dashed border-zinc-800">
              <p className="text-sm font-bold text-zinc-400">No banners created yet.</p>
              <button
                onClick={onOpenAddBanner}
                className="mt-3 px-4 py-2 rounded-xl bg-[#84cc16] text-black text-xs font-bold"
              >
                Create Your First Banner
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
