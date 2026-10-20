"use client";

import React, { useState } from "react";
import { X, Tag } from "lucide-react";
import { CouponItem } from "@/types";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (couponData: Omit<CouponItem, "id" | "usedCount">) => void;
}

export default function CouponModal({
  isOpen,
  onClose,
  onSave,
}: CouponModalProps) {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState(10);
  const [minSpend, setMinSpend] = useState(5000);
  const [expiresAt, setExpiresAt] = useState("2026-12-31");
  const [usageLimit, setUsageLimit] = useState(250);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onSave({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      expiresAt,
      usageLimit: Number(usageLimit),
      active: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#121217] border border-[#202028] rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Create Promo Coupon</h2>
              <p className="text-xs text-zinc-400">
                Discount code for online store checkout
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">
              Coupon Code *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. BPL2026 or PLAYZONE15"
              className="w-full bg-[#181820] text-sm font-mono font-bold uppercase text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) =>
                  setDiscountType(e.target.value as "percent" | "fixed")
                }
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="percent">Percentage (% OFF)</option>
                <option value="fixed">Fixed Amount (৳ OFF)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Min. Spend (৳)
              </label>
              <input
                type="number"
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Max Uses Limit
              </label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
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
              Save Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
