"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  Clock,
  Calendar,
  User,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  FileText,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { BlogPost } from "@/types";

interface BlogTabProps {
  onOpenAddBlog: () => void;
  onEditBlog: (post: BlogPost) => void;
}

export default function BlogTab({ onOpenAddBlog, onEditBlog }: BlogTabProps) {
  const { blogPosts, toggleBlogPublish, deleteBlogPost, openConfirmModal } =
    useDashboard();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Cricket Blog & Equipment Advice</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {blogPosts.length} Articles
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Publish bat care guides, pitch analyses, and gear reviews for the Bangladesh cricket community.
          </p>
        </div>

        <button
          onClick={onOpenAddBlog}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black font-bold text-sm shadow-lg shadow-[#84cc16]/15 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl bg-[#121217] border border-[#202028] hover:border-[#84cc16]/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0">
                  <Image
                    src={post.imageSrc}
                    alt={post.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-amber-400">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-white text-sm sm:text-base mt-1.5 line-clamp-2 group-hover:text-[#84cc16] transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-zinc-400" />
                      {post.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mt-4 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => toggleBlogPublish(post.id)}
                className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                  post.isPublished
                    ? "bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {post.isPublished ? "Published Live" : "Draft Only"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditBlog(post)}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-[#84cc16] hover:text-black transition-colors"
                  title="Edit Article"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    openConfirmModal({
                      title: "Delete Article?",
                      message: `Are you sure you want to delete "${post.title}"? This cannot be undone.`,
                      confirmText: "Delete Article",
                      type: "danger",
                      onConfirm: () => deleteBlogPost(post.id),
                    });
                  }}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
