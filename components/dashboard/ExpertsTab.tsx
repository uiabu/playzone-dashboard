"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Users,
  Plus,
  Star,
  MapPin,
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Edit2,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { Expert, ExpertBooking } from "@/types";

interface ExpertsTabProps {
  onOpenAddExpert: () => void;
  onEditExpert: (expert: Expert) => void;
}

export default function ExpertsTab({
  onOpenAddExpert,
  onEditExpert,
}: ExpertsTabProps) {
  const {
    experts,
    deleteExpert,
    updateExpert,
    expertBookings,
    updateBookingStatus,
    openConfirmModal,
  } = useDashboard();

  const [activeSubTab, setActiveSubTab] = useState<"experts" | "bookings">("experts");

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Hire Cricket Experts</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
              {experts.length} Professionals
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage BCB accredited coaches, sidearm throwdown specialists, performance analysts, and bat craft experts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddExpert}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black font-bold text-sm shadow-lg shadow-[#84cc16]/15 transition-all"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Register New Expert</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Experts Directory vs Booking Requests */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveSubTab("experts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "experts"
              ? "bg-[#84cc16] text-black shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Experts Directory ({experts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("bookings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "bookings"
              ? "bg-[#84cc16] text-black shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Client Bookings ({expertBookings.length})</span>
        </button>
      </div>

      {/* VIEW 1: EXPERTS DIRECTORY */}
      {activeSubTab === "experts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {experts.map((expert) => (
            <div
              key={expert.id}
              className="p-5 rounded-2xl bg-[#121217] border border-[#202028] hover:border-[#84cc16]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Role */}
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0">
                    <Image
                      src={expert.imageSrc}
                      alt={expert.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-white text-base truncate">
                        {expert.name}
                      </h3>
                      {expert.verified && (
                        <span title="Verified Professional" className="inline-flex">
                          <ShieldCheck className="w-4 h-4 text-[#84cc16] flex-shrink-0" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#84cc16] font-semibold mt-0.5">
                      {expert.role}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {expert.rating}
                      </span>
                      <span>({expert.reviewsCount} reviews)</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        {expert.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-zinc-400 mt-3.5 line-clamp-2 leading-relaxed">
                  {expert.bio}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {expert.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Rate & Modes */}
                <div className="mt-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                      Fee Rate
                    </span>
                    <span className="text-sm font-black text-white">
                      ৳ {expert.price.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-zinc-400">
                        {expert.priceUnit}
                      </span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                      Modes
                    </span>
                    <div className="flex items-center gap-1 text-xs text-zinc-300 font-medium">
                      {expert.serviceModes.join(", ")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() =>
                    updateExpert(expert.id, { verified: !expert.verified })
                  }
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                    expert.verified
                      ? "bg-[#84cc16]/10 text-[#84cc16]"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {expert.verified ? "Verified ✓" : "Unverified"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditExpert(expert)}
                    className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-[#84cc16] hover:text-black transition-colors"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      openConfirmModal({
                        title: "Remove Expert?",
                        message: `Are you sure you want to remove expert consultant ${expert.name} (${expert.role})?`,
                        confirmText: "Remove Expert",
                        type: "danger",
                        onConfirm: () => deleteExpert(expert.id),
                      });
                    }}
                    className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete Expert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: CLIENT BOOKINGS */}
      {activeSubTab === "bookings" && (
        <div className="rounded-2xl bg-[#121217] border border-[#202028] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-zinc-400 text-xs uppercase bg-[#181820]/60 border-b border-zinc-800">
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Expert Requested</th>
                  <th className="py-3.5 px-4">Client Contact</th>
                  <th className="py-3.5 px-4">Session Date & Time</th>
                  <th className="py-3.5 px-4">Ground / Location</th>
                  <th className="py-3.5 px-4">Total Fee</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {expertBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      #{b.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-zinc-100">
                      {b.expertName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-zinc-200">
                        {b.customerName}
                      </div>
                      <div className="text-xs text-zinc-400">{b.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-bold text-zinc-200">{b.date}</div>
                      <div className="text-[11px] text-zinc-500">{b.timeSlot}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-zinc-300">
                      {b.locationDetails} ({b.serviceMode})
                    </td>
                    <td className="py-3.5 px-4 font-black text-white">
                      ৳ {b.totalFee.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={b.status}
                        onChange={(e) =>
                          updateBookingStatus(
                            b.id,
                            e.target.value as ExpertBooking["status"]
                          )
                        }
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          b.status === "completed"
                            ? "bg-[#84cc16]/10 text-[#84cc16] border-[#84cc16]/20"
                            : b.status === "confirmed"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : b.status === "cancelled"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        <option value="pending" className="bg-[#181820] text-amber-400">
                          Pending
                        </option>
                        <option value="confirmed" className="bg-[#181820] text-blue-400">
                          Confirmed
                        </option>
                        <option value="completed" className="bg-[#181820] text-[#84cc16]">
                          Completed
                        </option>
                        <option value="cancelled" className="bg-[#181820] text-red-400">
                          Cancelled
                        </option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors inline-block"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
