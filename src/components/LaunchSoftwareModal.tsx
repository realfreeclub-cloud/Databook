"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  X, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Laptop, 
  Database, 
  ExternalLink 
} from "lucide-react";

interface LaunchSoftwareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LaunchSoftwareModal({ isOpen, onClose }: LaunchSoftwareModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 md:p-8 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-3">
            <Sparkles size={12} className="text-blue-300" />
            National Computer SaaS Suite
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            Launch Repair & Inventory Software
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 font-medium leading-relaxed">
            Choose your access route. Open to computer & mobile repair shops, hardware retailers, and authorized service partners.
          </p>
        </div>

        {/* Options List */}
        <div className="p-6 md:p-8 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Option 1: Live Sign In */}
          <Link
            href="/login"
            onClick={onClose}
            className="group flex items-center justify-between p-4.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-2xl transition-all p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <LogIn size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  Store Keeper / Manager Sign In
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Log in to your active shop dashboard to manage records & inventory.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

          {/* Option 2: Register New Shop */}
          <Link
            href="/register"
            onClick={onClose}
            className="group flex items-center justify-between p-4.5 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 hover:from-emerald-50 hover:to-teal-50 border border-emerald-200 rounded-2xl transition-all p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <UserPlus size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    Create Free Shop Account
                  </h4>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase">
                    Free Forever
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Start digitizing your repair shop in under 60 seconds. Zero setup fee.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

          {/* Option 3: Super Admin Desk */}
          <Link
            href="/admin-login"
            onClick={onClose}
            className="group flex items-center justify-between p-4.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl transition-all p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-slate-800 transition-colors">
                  Super Admin Management Portal
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Administrative console for master control & subscription activations.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

          {/* Quick Perks Bar */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-semibold px-1">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              Automated WhatsApp Reminders
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              Excel Data Backups
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              Multi-Device Cloud Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
