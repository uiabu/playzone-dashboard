"use client";

import React, { useState, useEffect } from "react";
import { X, BookOpen } from "lucide-react";
import { BlogPost } from "@/types";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (postData: Omit<BlogPost, "id">, editId?: string) => void;
  initialPost?: BlogPost | null;
}

export default function BlogModal({
  isOpen,
  onClose,
  onSave,
  initialPost,
}: BlogModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Bat Care & Prep");
  const [readTime, setReadTime] = useState("5 min read");
  const [author, setAuthor] = useState("Mahmudul Hasan (Master Bat-Maker)");
  const [excerpt, setExcerpt] = useState("");
  const [imageSrc, setImageSrc] = useState("/images/products/bats/sg_bat.png");
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title);
      setCategory(initialPost.category);
      setReadTime(initialPost.readTime);
      setAuthor(initialPost.author);
      setExcerpt(initialPost.excerpt);
      setImageSrc(initialPost.imageSrc);
      setIsPublished(initialPost.isPublished);
    } else {
      setTitle("");
      setCategory("Bat Care & Prep");
      setReadTime("5 min read");
      setAuthor("Mahmudul Hasan (Master Bat-Maker)");
      setExcerpt("");
      setImageSrc("/images/products/bats/sg_bat.png");
      setIsPublished(true);
    }
  }, [initialPost, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const date = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });

    onSave(
      {
        slug,
        title,
        category,
        readTime,
        date,
        author,
        imageSrc,
        excerpt,
        isPublished,
      },
      initialPost?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#121217] border border-[#202028] rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {initialPost ? "Edit Blog Article" : "Write Cricket Article"}
              </h2>
              <p className="text-xs text-zinc-400">
                Equipment guides and tutorials published to /blog
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
              Article Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How to Properly Knock-in an English Willow Bat in Bangladesh"
              className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="Bat Care & Prep">Bat Care & Prep</option>
                <option value="Gear Advice">Gear Advice</option>
                <option value="Smart Buying">Smart Buying</option>
                <option value="Coaching & Drills">Coaching & Drills</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 6 min read"
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Featured Cover Image
              </label>
              <select
                value={imageSrc}
                onChange={(e) => setImageSrc(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="/images/products/bats/sg_bat.png">SG Bat Cover</option>
                <option value="/images/products/bats/ss_ton.png">SS TON Cover</option>
                <option value="/images/products/shoes_bags/adidas_spikes.png">Adidas Spikes Cover</option>
                <option value="/images/experts/sidearm_thrower.png">Sidearm Drill Cover</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">
              Article Excerpt / Summary *
            </label>
            <textarea
              required
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief overview that hooks the reader on the blog listing page..."
              className="w-full bg-[#181820] text-sm text-white rounded-xl p-3 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="publish-check"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 accent-[#84cc16] rounded"
            />
            <label htmlFor="publish-check" className="text-xs font-bold text-zinc-200 cursor-pointer">
              Publish immediately on live store blog
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
              Save Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
