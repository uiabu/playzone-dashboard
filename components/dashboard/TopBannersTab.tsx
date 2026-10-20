"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Eye,
  Globe,
  AlertCircle,
  Play,
  Pause,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { BannerItem } from "@/types";

interface TopBannersTabProps {
  onOpenAddBanner: () => void;
  onEditBanner: (banner: BannerItem) => void;
}

export default function TopBannersTab({
  onOpenAddBanner,
  onEditBanner,
}: TopBannersTabProps) {
  const { banners, toggleBanner, deleteBanner, openConfirmModal } = useDashboard();

  // Filter hero banners specifically
  const heroBanners = banners.filter((b) => b.type === "hero");
  const activeHeroBanners = heroBanners.filter((b) => b.active);

  // Live Preview state
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "hidden">("all");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredBanners = heroBanners.filter((b) => {
    if (filter === "active") return b.active;
    if (filter === "hidden") return !b.active;
    return true;
  });

  const totalHero = heroBanners.length;
  const currentSlideIdx = totalHero > 0 ? (previewIndex % totalHero + totalHero) % totalHero : 0;
  const currentPreviewBanner = totalHero > 0 ? heroBanners[currentSlideIdx] : null;

  const handleNextPreview = useCallback(() => {
    if (totalHero > 0) {
      setPreviewIndex((prev) => (prev + 1) % totalHero);
    }
  }, [totalHero]);

  const handlePrevPreview = useCallback(() => {
    if (totalHero > 0) {
      setPreviewIndex((prev) => (prev - 1 + totalHero) % totalHero);
    }
  }, [totalHero]);

  // Autoplay slider (5 seconds)
  useEffect(() => {
    if (!isAutoplay || totalHero <= 1) return;
    const timer = setInterval(() => {
      handleNextPreview();
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoplay, totalHero, handleNextPreview]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-white">
              Website Top Hero Banners
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20 font-bold">
              {totalHero} Slides ({activeHeroBanners.length} Live)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage the rotating hero slider at the very top of the Playzone homepage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-colors border border-zinc-700/60"
          >
            <Globe className="w-4 h-4 text-[#84cc16]" />
            <span className="hidden sm:inline">View Website</span>
          </a>

          <button
            onClick={onOpenAddBanner}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black text-xs font-bold shadow-lg shadow-[#84cc16]/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Banner Slide</span>
          </button>
        </div>
      </div>

      {/* 2. REAL-TIME INTERACTIVE HERO SLIDER PREVIEW (1:1 with Storefront) */}
      <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028] shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#84cc16]" />
            <h3 className="text-xs sm:text-sm font-black text-white tracking-wider uppercase">
              Live Website Top Banner Preview
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
              1:1 Storefront View
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoplay((prev) => !prev)}
              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                isAutoplay
                  ? "bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/30"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
              title="Toggle Autoplay Preview"
            >
              {isAutoplay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAutoplay ? "Autoplay ON" : "Autoplay OFF"}</span>
            </button>

            <span className="text-xs text-zinc-400 font-mono">
              Slide {totalHero > 0 ? currentSlideIdx + 1 : 0} of {totalHero}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevPreview}
                disabled={totalHero <= 1}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40 transition-colors"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPreview}
                disabled={totalHero <= 1}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40 transition-colors"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {currentPreviewBanner ? (
          <div className="space-y-4">
            {/* The Pure Hero Banner Slider Container (No text/gradient overlays over the graphic!) */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800/80 bg-[#0a0c10] aspect-[16/9] sm:aspect-[1.95/1] group shadow-2xl select-none">
              {/* Clean Image */}
              {!failedImages[currentPreviewBanner.id] ? (
                <Image
                  src={currentPreviewBanner.imageSrc}
                  alt={currentPreviewBanner.title}
                  fill
                  priority
                  className="object-cover object-center transition-all duration-500"
                  onError={() =>
                    setFailedImages((prev) => ({
                      ...prev,
                      [currentPreviewBanner.id]: true,
                    }))
                  }
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950 text-zinc-400">
                  <AlertCircle className="w-10 h-10 text-amber-500 mb-2" />
                  <h4 className="text-sm font-bold text-white">Banner Image Not Found</h4>
                  <p className="text-xs text-zinc-400 font-mono mt-1 max-w-md break-all">
                    {currentPreviewBanner.imageSrc}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-2">
                    Click &apos;Edit Slide&apos; below to pick a valid preset or upload a new banner image.
                  </p>
                  <button
                    onClick={() => onEditBanner(currentPreviewBanner)}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-[#84cc16] text-black text-xs font-bold hover:bg-[#a3e635]"
                  >
                    Change Image
                  </button>
                </div>
              )}

              {/* Navigation Controls: Left Arrow (<) matching website */}
              <button
                type="button"
                onClick={handlePrevPreview}
                aria-label="Previous Slide"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-zinc-900 shadow-xl flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Navigation Controls: Right Arrow (>) matching website */}
              <button
                type="button"
                onClick={handleNextPreview}
                aria-label="Next Slide"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-zinc-900 shadow-xl flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Bottom Indicator Pills matching website */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {heroBanners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 transition-all duration-300 rounded-full ${
                      idx === currentSlideIdx
                        ? "w-8 bg-[#84cc16] shadow-[0_0_8px_rgba(132,204,22,0.8)]"
                        : "w-3 bg-white/70 hover:bg-white"
                    }`}
                  />
                ))}
              </div>

              {/* Status Badge in Corner */}
              <div className="absolute top-3 right-3 z-20">
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg ${
                    currentPreviewBanner.active
                      ? "bg-[#84cc16] text-black"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                  }`}
                >
                  {currentPreviewBanner.active ? "● Live on Website" : "○ Draft / Hidden"}
                </span>
              </div>
            </div>

            {/* Slide Information & Quick Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#181820] border border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#84cc16]/10 text-[#84cc16] flex items-center justify-center font-bold text-xs shrink-0">
                  #{currentSlideIdx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {currentPreviewBanner.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span>Click Target:</span>
                    <a
                      href={`http://localhost:3001${currentPreviewBanner.buttonLink || "/category/cricket-bats"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[#84cc16] hover:underline flex items-center gap-1"
                    >
                      <span>{currentPreviewBanner.buttonLink || "/category/cricket-bats"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => toggleBanner(currentPreviewBanner.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentPreviewBanner.active
                      ? "bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20 hover:bg-[#84cc16]/20"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {currentPreviewBanner.active ? "Visible on Store" : "Hidden from Store"}
                </button>

                <button
                  onClick={() => onEditBanner(currentPreviewBanner)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-[#84cc16] text-zinc-200 hover:text-black text-xs font-bold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Slide</span>
                </button>

                <button
                  onClick={() => {
                    openConfirmModal({
                      title: "Delete Top Banner Slide?",
                      message: `Are you sure you want to delete slide "${currentPreviewBanner.title}"?`,
                      confirmText: "Delete Slide",
                      type: "danger",
                      onConfirm: () => deleteBanner(currentPreviewBanner.id),
                    });
                  }}
                  className="p-1.5 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-zinc-500 rounded-2xl bg-zinc-950/50 border border-zinc-800">
            No top hero banners available to preview.
          </div>
        )}
      </div>

      {/* 3. ALL TOP BANNERS GRID & CRUD CONTROLS */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">All Top Hero Slides</h3>
            <div className="flex items-center gap-1 bg-[#181820] p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  filter === "all"
                    ? "bg-[#84cc16] text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All ({heroBanners.length})
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  filter === "active"
                    ? "bg-[#84cc16] text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Active ({activeHeroBanners.length})
              </button>
              <button
                onClick={() => setFilter("hidden")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  filter === "hidden"
                    ? "bg-[#84cc16] text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Hidden ({heroBanners.length - activeHeroBanners.length})
              </button>
            </div>
          </div>

          <span className="text-xs text-zinc-400">
            Click 👁️ Preview to test any slide in the live preview box above.
          </span>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`p-4 rounded-3xl bg-[#121217] border transition-all flex flex-col justify-between group shadow-xl ${
                currentPreviewBanner?.id === banner.id
                  ? "border-[#84cc16]/50 shadow-[0_0_20px_rgba(132,204,22,0.1)]"
                  : "border-[#202028] hover:border-zinc-700"
              }`}
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 w-full rounded-2xl bg-zinc-950 border border-zinc-800/80 overflow-hidden mb-3.5 group-hover:border-zinc-700 transition-colors">
                  <Image
                    src={banner.imageSrc}
                    alt={banner.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-sm text-zinc-300 border border-white/10">
                    Slide #{index + 1}
                  </span>

                  <span
                    className={`absolute top-2.5 right-2.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg shadow-md ${
                      banner.active
                        ? "bg-[#84cc16] text-black"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}
                  >
                    {banner.active ? "Live" : "Hidden"}
                  </span>
                </div>

                {/* Banner Content */}
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                  <span className="text-zinc-500 uppercase tracking-wider font-sans font-bold">
                    Target:
                  </span>
                  <span className="truncate max-w-[180px] text-[#84cc16]" title={banner.buttonLink}>
                    {banner.buttonLink || "/category/cricket-bats"}
                  </span>
                </div>

                <h4 className="font-black text-base text-white mt-1 leading-snug">
                  {banner.title}
                </h4>
              </div>

              {/* Card Actions */}
              <div className="pt-3.5 mt-3.5 border-t border-zinc-800/80 flex items-center justify-between gap-2">
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
                    onClick={() => {
                      const idx = heroBanners.findIndex((b) => b.id === banner.id);
                      if (idx !== -1) setPreviewIndex(idx);
                    }}
                    className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                      currentPreviewBanner?.id === banner.id
                        ? "bg-[#84cc16] text-black"
                        : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                    title="Preview This Slide"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onEditBanner(banner)}
                    className="p-2 rounded-xl bg-zinc-800/80 hover:bg-[#84cc16] text-zinc-300 hover:text-black transition-colors"
                    title="Edit Banner Slide"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      openConfirmModal({
                        title: "Delete Top Banner Slide?",
                        message: `Are you sure you want to delete slide "${banner.title}" from the homepage top slider?`,
                        confirmText: "Delete Slide",
                        type: "danger",
                        onConfirm: () => deleteBanner(banner.id),
                      });
                    }}
                    className="p-2 rounded-xl bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredBanners.length === 0 && (
            <div className="col-span-full p-12 text-center rounded-3xl bg-[#121217] border border-dashed border-zinc-800">
              <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">No top hero banners found</p>
              <p className="text-xs text-zinc-500 mt-1">
                Add a new hero slider banner to appear at the top of the website.
              </p>
              <button
                onClick={onOpenAddBanner}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black text-xs font-bold transition-all"
              >
                + Add First Top Banner
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
