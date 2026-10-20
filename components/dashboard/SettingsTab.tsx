"use client";

import React, { useState } from "react";
import {
  Settings,
  Store,
  Truck,
  Phone,
  Mail,
  MapPin,
  Save,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { StoreSettings } from "@/types";

export default function SettingsTab() {
  const { settings, updateSettings, resetToDefaults, showToast, openConfirmModal } =
    useDashboard();

  const [form, setForm] = useState<StoreSettings>({ ...settings });

  const handleChange = (
    field: keyof StoreSettings,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
  };

  // Export JSON backup
  const handleExportData = () => {
    if (typeof window === "undefined") return;
    const backup: Record<string, unknown> = {};
    const keys = [
      "products",
      "orders",
      "pre_orders",
      "experts",
      "bookings",
      "banners",
      "coupons",
      "blogs",
      "reviews",
      "video_testimonials",
      "settings",
    ];
    keys.forEach((k) => {
      const data = window.localStorage.getItem(`playzone_${k}`);
      if (data) backup[k] = JSON.parse(data);
    });

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `playzone_store_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Store backup exported successfully!");
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>Store & Brand Settings</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-bold">
            Configuration
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Manage Playzone contact hotlines, delivery rates across Bangladesh, and operational features.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. BRAND IDENTITY & CONTACT */}
        <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Store className="w-5 h-5 text-[#84cc16]" />
            <h3 className="text-base font-bold text-white">Brand Profile & Contact</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => handleChange("storeName", e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Customer Support Hotline
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                WhatsApp Order Support Number
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Official Support Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={form.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Dhaka Flagship Outlet Address
              </label>
              <input
                type="text"
                value={form.dhakaAddress}
                onChange={(e) => handleChange("dhakaAddress", e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Chittagong Branch Address
              </label>
              <input
                type="text"
                value={form.chittagongAddress}
                onChange={(e) => handleChange("chittagongAddress", e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. SHIPPING & DELIVERY RATES */}
        <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Truck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Shipping & Courier Charges (BDT ৳)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Inside Dhaka Regular (৳)
              </label>
              <input
                type="number"
                value={form.deliveryInsideDhaka}
                onChange={(e) =>
                  handleChange("deliveryInsideDhaka", Number(e.target.value))
                }
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Inside Dhaka Express (৳)
              </label>
              <input
                type="number"
                value={form.deliveryExpressDhaka}
                onChange={(e) =>
                  handleChange("deliveryExpressDhaka", Number(e.target.value))
                }
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Outside Dhaka Courier (৳)
              </label>
              <input
                type="number"
                value={form.deliveryOutsideDhaka}
                onChange={(e) =>
                  handleChange("deliveryOutsideDhaka", Number(e.target.value))
                }
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Free Delivery Above (৳)
              </label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) =>
                  handleChange("freeShippingThreshold", Number(e.target.value))
                }
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. STORE TOGGLES */}
        <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Payment & Widget Toggles</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Cash on Delivery</div>
                <div className="text-[11px] text-zinc-500">Allow pay upon receiving</div>
              </div>
              <input
                type="checkbox"
                checked={form.cashOnDeliveryEnabled}
                onChange={(e) =>
                  handleChange("cashOnDeliveryEnabled", e.target.checked)
                }
                className="w-5 h-5 accent-[#84cc16] rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">bKash Online Payment</div>
                <div className="text-[11px] text-zinc-500">Instant merchant gateway</div>
              </div>
              <input
                type="checkbox"
                checked={form.bkashPaymentEnabled}
                onChange={(e) =>
                  handleChange("bkashPaymentEnabled", e.target.checked)
                }
                className="w-5 h-5 accent-[#84cc16] rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">WhatsApp Chat Widget</div>
                <div className="text-[11px] text-zinc-500">Floating icon on website</div>
              </div>
              <input
                type="checkbox"
                checked={form.whatsappWidgetActive}
                onChange={(e) =>
                  handleChange("whatsappWidgetActive", e.target.checked)
                }
                className="w-5 h-5 accent-[#84cc16] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black font-bold text-sm shadow-lg shadow-[#84cc16]/15 transition-all"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>

      {/* 4. BACKUP & MAINTENANCE */}
      <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028]">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white">Data Backup & Maintenance</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Export store database as JSON or reset to default cricket store state
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-[#84cc16]" />
            <span>Export Store Data (.JSON)</span>
          </button>

          <button
            onClick={() => {
              openConfirmModal({
                title: "Factory Reset Store Data?",
                message:
                  "Are you sure you want to reset all products, orders, coupons, blogs, and experts back to initial sample store data? All customizations will be reset.",
                confirmText: "Factory Reset",
                type: "warning",
                onConfirm: () => resetToDefaults(),
              });
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Factory Reset Dashboard Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
