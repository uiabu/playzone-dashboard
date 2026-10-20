"use client";

import React, { useState, useEffect } from "react";
import { X, Users, ShieldCheck } from "lucide-react";
import { Expert } from "@/types";

interface ExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expertData: Omit<Expert, "id">, editId?: string) => void;
  initialExpert?: Expert | null;
}

export default function ExpertModal({
  isOpen,
  onClose,
  onSave,
  initialExpert,
}: ExpertModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Batting Coach (BCB Certified)");
  const [category, setCategory] = useState<Expert["category"]>("coaching");
  const [location, setLocation] = useState("Dhaka");
  const [price, setPrice] = useState(2000);
  const [priceUnit, setPriceUnit] = useState<Expert["priceUnit"]>("/hour");
  const [experienceLabel, setExperienceLabel] = useState("5 - 10 years");
  const [experienceYears, setExperienceYears] = useState(7);
  const [verified, setVerified] = useState(true);
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState("Coaching, Batting Technique, Power Hitting");
  const [imageSrc, setImageSrc] = useState("/images/experts/head_coach.png");

  useEffect(() => {
    if (initialExpert) {
      setName(initialExpert.name);
      setRole(initialExpert.role);
      setCategory(initialExpert.category);
      setLocation(initialExpert.location);
      setPrice(initialExpert.price);
      setPriceUnit(initialExpert.priceUnit);
      setExperienceLabel(initialExpert.experienceLabel);
      setExperienceYears(initialExpert.experienceYears);
      setVerified(initialExpert.verified);
      setBio(initialExpert.bio);
      setTags(initialExpert.tags.join(", "));
      setImageSrc(initialExpert.imageSrc);
    } else {
      setName("");
      setRole("Batting Coach (BCB Certified)");
      setCategory("coaching");
      setLocation("Dhaka");
      setPrice(2000);
      setPriceUnit("/hour");
      setExperienceLabel("5 - 10 years");
      setExperienceYears(7);
      setVerified(true);
      setBio("");
      setTags("Coaching, Batting Technique, Power Hitting");
      setImageSrc("/images/experts/head_coach.png");
    }
  }, [initialExpert, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name,
        role,
        category,
        location,
        price: Number(price),
        priceUnit,
        experienceLabel,
        experienceYears: Number(experienceYears),
        verified,
        bio: bio || `Professional cricket ${category} specialist based in ${location}.`,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        imageSrc,
        rating: initialExpert ? initialExpert.rating : 4.9,
        reviewsCount: initialExpert ? initialExpert.reviewsCount : 5,
        serviceModes: ["ground", "home", "online"],
        fullBio:
          bio ||
          "Certified coach with years of premier league and academy experience.",
        certifications: ["BCB Certified", "ICC High Performance"],
        availableDays: ["Everyday", "Weekends"],
      },
      initialExpert?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#121217] border border-[#202028] rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {initialExpert ? "Edit Expert Profile" : "Register New Cricket Expert"}
              </h2>
              <p className="text-xs text-zinc-400">
                Coaches, sidearm throwdown specialists, analysts, and bat craft experts
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Coach Mahmudul Hasan"
              className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Designation / Role
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Sidearm Throwdown Specialist"
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Expert["category"])
                }
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="coaching">Coaching</option>
                <option value="practice">Practice & Throwdown</option>
                <option value="analysis">Video & Performance Analysis</option>
                <option value="officials">Match Official / Umpire</option>
                <option value="equipment">Bat Craft & Equipment Repair</option>
                <option value="fitness">Fitness & Rehab</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Rate (৳)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Rate Unit
              </label>
              <select
                value={priceUnit}
                onChange={(e) =>
                  setPriceUnit(e.target.value as Expert["priceUnit"])
                }
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="/hour">/hour</option>
                <option value="/session">/session</option>
                <option value="/match">/match</option>
                <option value="/service">/service</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">
              Expert Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Throwdown, 140+ km/h, Batting Technique"
              className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">
              Short Professional Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Experience summary and key specializations..."
              className="w-full bg-[#181820] text-sm text-white rounded-xl p-3 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="verified-checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              className="w-4 h-4 accent-[#84cc16] rounded"
            />
            <label htmlFor="verified-checkbox" className="text-xs font-bold text-zinc-200 cursor-pointer">
              Mark as Verified Expert (BCB / PLAYZONE Official Accreditation)
            </label>
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
              Save Expert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
