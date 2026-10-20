"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";
import { BannerItem } from "@/types";

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<BannerItem, "id">, editId?: string) => void;
  initialBanner?: BannerItem | null;
}

const PRESET_IMAGES = [
  { label: "Build Your Kit", src: "/images/hero/build_your_kits.png" },
  { label: "Cricket Bats", src: "/images/hero/hero_cricket_bats.png" },
  { label: "Cricket Helmets", src: "/images/hero/hero_cricket_bats_helmets.png" },
  { label: "Cricket Pads", src: "/images/hero/hero_cricket_bats_pads.png" },
  { label: "Cricket Shoes", src: "/images/hero/hero_cricket_bats_shoes.png" },
  { label: "Pre-Owned Banner", src: "/images/banners/pre_owned_cta_banner.png" },
  { label: "Pre-Owned Picks", src: "/images/hero/pre_owned_pick.png" },
  { label: "Hire Experts", src: "/images/hero/experts.png" },
];

const PRESET_LINKS = [
  { label: "Cricket Bats", path: "/category/cricket-bats" },
  { label: "Shop All Cricket", path: "/category/shop-cricket" },
  { label: "Batting Protection", path: "/category/batting" },
  { label: "Cricket Shoes", path: "/category/shoes" },
  { label: "Pre-Owned Gear", path: "/category/pre-owned-gear" },
  { label: "Hire Experts", path: "/hire-experts" },
  { label: "Custom Pre-Order", path: "/pre-order" },
];

export default function BannerModal({
  isOpen,
  onClose,
  onSave,
  initialBanner,
}: BannerModalProps) {
  const [title, setTitle] = useState("");
  const [buttonLink, setButtonLink] = useState("/category/cricket-bats");
  const [imageSrc, setImageSrc] = useState("/images/hero/build_your_kits.png");
  const [type, setType] = useState<"hero" | "cta" | "promo">("hero");
  const [active, setActive] = useState(true);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialBanner) {
      setTitle(initialBanner.title || "");
      setButtonLink(initialBanner.buttonLink || "/category/cricket-bats");
      setImageSrc(initialBanner.imageSrc || "/images/hero/build_your_kits.png");
      setType(initialBanner.type || "hero");
      setActive(initialBanner.active !== undefined ? initialBanner.active : true);
      setImageError(false);
    } else {
      setTitle("");
      setButtonLink("/category/cricket-bats");
      setImageSrc("/images/hero/build_your_kits.png");
      setType("hero");
      setActive(true);
      setImageError(false);
    }
  }, [initialBanner, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Image file size should be less than 8MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageSrc(reader.result);
        setImageError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(
      {
        title: title.trim(),
        subtitle: initialBanner?.subtitle || "",
        buttonText: initialBanner?.buttonText || "SHOP NOW →",
        buttonLink: buttonLink.trim() || "/category/cricket-bats",
        imageSrc: imageSrc.trim() || "/images/hero/build_your_kits.png",
        type,
        active,
      },
      initialBanner?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121217] border border-[#202028] rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#84cc16]/10 text-[#84cc16] flex items-center justify-center border border-[#84cc16]/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {initialBanner ? "Edit Top Banner Slide" : "Add New Top Banner Slide"}
              </h2>
              <p className="text-xs text-zinc-400">
                Configure banner image, link target, and active status for the homepage slider
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. CLEAN BANNER IMAGE PREVIEW (No fake text overlays!) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#84cc16]" />
                Banner Graphic Preview
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  active
                    ? "bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {active ? "● Live / Active" : "○ Draft / Hidden"}
              </span>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-[#0a0c10] aspect-[16/9] sm:aspect-[2/1] shadow-inner flex items-center justify-center">
              {!imageError && imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={title || "Banner Preview"}
                  fill
                  className="object-cover object-center"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="p-6 text-center text-zinc-500">
                  <AlertCircle className="w-8 h-8 mx-auto text-amber-500/80 mb-2" />
                  <p className="text-xs font-bold text-white">Image could not be loaded</p>
                  <p className="text-[11px] text-zinc-500 mt-1 font-mono break-all max-w-sm">
                    {imageSrc || "No image provided"}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-2">
                    Please select a preset below or upload a valid image file.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. Banner Title */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">
              Slide Name / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. BUILD YOUR KIT or CRICKET BATS"
              className="w-full bg-[#181820] text-sm font-bold text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Used to identify the slide in dashboard & for image accessibility (alt tag).
            </span>
          </div>

          {/* 3. Image Selection & Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-300">
                Banner Graphic Source *
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-bold text-[#84cc16] hover:text-[#a3e635] transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Computer</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <input
              type="text"
              required
              value={imageSrc}
              onChange={(e) => {
                setImageSrc(e.target.value);
                setImageError(false);
              }}
              placeholder="/images/hero/build_your_kits.png"
              className="w-full bg-[#181820] text-xs font-mono text-zinc-200 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-bold text-zinc-400 block mb-1.5">
                Or choose from store hero banners:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.src}
                    type="button"
                    onClick={() => {
                      setImageSrc(preset.src);
                      setImageError(false);
                      if (!title) setTitle(preset.label.toUpperCase());
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-left border transition-all ${
                      imageSrc === preset.src
                        ? "bg-[#84cc16]/10 text-[#84cc16] border-[#84cc16]/40 shadow-sm"
                        : "bg-[#181820] text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    {imageSrc === preset.src && <Check className="w-3.5 h-3.5 shrink-0" />}
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Click Destination Link */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">
              Click Destination Link (Where slide redirects to) *
            </label>
            <input
              type="text"
              required
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="/category/cricket-bats"
              className="w-full bg-[#181820] text-xs font-mono text-zinc-200 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-zinc-500 font-bold self-center mr-1">
                Presets:
              </span>
              {PRESET_LINKS.map((preset) => (
                <button
                  key={preset.path}
                  type="button"
                  onClick={() => setButtonLink(preset.path)}
                  className={`text-[10px] px-2 py-1 rounded-lg transition-colors ${
                    buttonLink === preset.path
                      ? "bg-[#84cc16] text-black font-bold"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Live Active Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none p-3.5 rounded-2xl bg-[#181820] border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded text-[#84cc16] bg-zinc-900 border-zinc-700 focus:ring-0"
              />
              <div>
                <span className="text-xs font-bold text-white block">
                  Show in Homepage Top Slider
                </span>
                <span className="text-[11px] text-zinc-400 block">
                  When enabled, this banner immediately appears on the website.
                </span>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black text-xs font-bold shadow-lg shadow-[#84cc16]/20 transition-all active:scale-[0.98]"
            >
              {initialBanner ? "Update Banner Slide" : "Add Slide to Website"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
