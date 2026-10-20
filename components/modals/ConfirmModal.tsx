"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2, RefreshCw, Info, X } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <Trash2 className="w-6 h-6 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-amber-400" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  const getBadgeBg = () => {
    switch (type) {
      case "danger":
        return "bg-red-500/10 border-red-500/20";
      case "warning":
        return "bg-amber-500/10 border-amber-500/20";
      case "info":
        return "bg-blue-500/10 border-blue-500/20";
    }
  };

  const getConfirmButtonClasses = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20";
      case "warning":
        return "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 font-black";
      case "info":
        return "bg-[#84cc16] hover:bg-[#a3e635] text-black shadow-lg shadow-[#84cc16]/20 font-bold";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#141419] border border-[#272732] rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Decorative Top Accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            type === "danger"
              ? "bg-gradient-to-r from-red-600 via-rose-500 to-red-600"
              : type === "warning"
              ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"
              : "bg-gradient-to-r from-[#84cc16] via-[#a3e635] to-[#74d600]"
          }`}
        />

        {/* Close 'X' button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="flex flex-col items-center text-center mt-2">
          {/* Icon Badge */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-4 ${getBadgeBg()}`}
          >
            {getIcon()}
          </div>

          {/* Title */}
          <h3 className="text-lg font-black text-white tracking-tight">
            {title}
          </h3>

          {/* Message */}
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed max-w-xs">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-colors border border-zinc-700/60"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${getConfirmButtonClasses()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
