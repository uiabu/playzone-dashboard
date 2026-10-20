"use client";

import React from "react";
import Image from "next/image";
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Video,
  ExternalLink,
  ShieldCheck,
  User,
  ThumbsUp,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { CustomerReview } from "@/types";

export default function ReviewsTab() {
  const {
    reviews,
    updateReviewStatus,
    deleteReview,
    videoTestimonials,
    toggleFeaturedVideo,
    openConfirmModal,
  } = useDashboard();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>Customer Reviews & Cricketer Endorsements</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
            Social Proof
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Moderate verified purchaser equipment reviews and feature Bangladesh national player video endorsements.
        </p>
      </div>

      {/* 1. NATIONAL CRICKETER VIDEO TESTIMONIALS */}
      <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028]">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-[#84cc16]" />
              <span>National Player Video Endorsements</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Featured on the homepage &quot;Trusted by Bangladesh&apos;s Top Cricketers&quot; section
            </p>
          </div>
          <span className="text-xs font-bold text-[#84cc16]">
            {videoTestimonials.filter((v) => v.isFeatured).length} Active on Homepage
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {videoTestimonials.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full rounded-xl bg-black border border-zinc-800 overflow-hidden mb-3">
                  <Image
                    src={v.thumbnailSrc}
                    alt={v.cricketerName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {v.cricketerName}
                    </span>
                    <span className="flex items-center text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> 5.0
                    </span>
                  </div>
                </div>

                <div className="text-xs font-bold text-[#84cc16]">{v.role}</div>
                <div className="text-xs text-zinc-400 mt-1">
                  <span className="text-zinc-500">Gear Used:</span> {v.batUsed}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <a
                  href={v.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Preview Video</span>
                </a>

                <button
                  onClick={() => toggleFeaturedVideo(v.id)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                    v.isFeatured
                      ? "bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {v.isFeatured ? "Featured" : "Hidden"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CUSTOMER PRODUCT REVIEWS MODERATION */}
      <div className="rounded-2xl bg-[#121217] border border-[#202028] overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Customer Equipment Reviews</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Review feedback submitted on individual product pages
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-400">
            {reviews.length} Total Submissions
          </span>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-5 hover:bg-zinc-900/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? "fill-amber-400" : "text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-sm text-white">{r.title}</h4>
                </div>

                <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-500 mt-2">
                  <span className="font-semibold text-zinc-400 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {r.author}
                  </span>
                  {r.verified && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#84cc16]/10 text-[#84cc16]">
                      Verified Buyer
                    </span>
                  )}
                  <span>•</span>
                  <span>{r.location}</span>
                  <span>•</span>
                  <span>{r.date}</span>
                  <span>•</span>
                  <span className="text-[#84cc16] font-medium">{r.productName}</span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <select
                  value={r.status}
                  onChange={(e) =>
                    updateReviewStatus(
                      r.id,
                      e.target.value as CustomerReview["status"]
                    )
                  }
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                    r.status === "approved"
                      ? "bg-[#84cc16]/10 text-[#84cc16] border-[#84cc16]/20"
                      : r.status === "pending"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  <option value="approved" className="bg-[#181820] text-[#84cc16]">
                    Approved & Live
                  </option>
                  <option value="pending" className="bg-[#181820] text-amber-400">
                    Pending Approval
                  </option>
                  <option value="rejected" className="bg-[#181820] text-red-400">
                    Hidden / Rejected
                  </option>
                </select>

                <button
                  onClick={() => {
                    openConfirmModal({
                      title: "Delete Review?",
                      message: `Are you sure you want to delete the review by "${r.author}"?`,
                      confirmText: "Delete Review",
                      type: "danger",
                      onConfirm: () => deleteReview(r.id),
                    });
                  }}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
