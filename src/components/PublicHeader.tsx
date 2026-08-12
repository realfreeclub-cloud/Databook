"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function PublicHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [pathname]);

  // Public header only renders on public pages if NOT logged in
  const publicRoutes = ["/", "/about", "/support"];
  if (!publicRoutes.includes(pathname) || isLoggedIn) return null;

  return (
    <header className="sticky top-0 z-50 bg-[#0a0d18] border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-6 transition-transform">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="font-black text-base text-white tracking-tight block">Digital Register</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-0.5 block">Repair registry</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
              pathname === "/" ? "text-primary" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
              pathname === "/about" ? "text-primary" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            About Us
          </Link>
          <Link 
            href="/support" 
            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
              pathname === "/support" ? "text-primary" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="bg-primary text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/10 hover:shadow-xl hover:translate-y-[-1px] transition-all active:translate-y-0"
          >
            Register Shop
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0a0d18] px-6 py-5 space-y-5 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className={`text-xs font-bold uppercase tracking-wider ${pathname === "/" ? "text-primary" : "text-slate-400"}`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsOpen(false)}
              className={`text-xs font-bold uppercase tracking-wider ${pathname === "/about" ? "text-primary" : "text-slate-400"}`}
            >
              About Us
            </Link>
            <Link 
              href="/support" 
              onClick={() => setIsOpen(false)}
              className={`text-xs font-bold uppercase tracking-wider ${pathname === "/support" ? "text-primary" : "text-slate-400"}`}
            >
              Contact Us
            </Link>
          </nav>
          
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold uppercase tracking-wider text-slate-400 py-2.5 text-center"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              onClick={() => setIsOpen(false)}
              className="bg-primary text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center"
            >
              Register Shop
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
