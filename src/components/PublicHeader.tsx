"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Cpu, 
  Menu, 
  X, 
  ExternalLink, 
  Sparkles, 
  ArrowRight,
  PhoneCall,
  Wrench,
  ShieldCheck,
  Send
} from "lucide-react";
import { useState, useEffect } from "react";
import LaunchSoftwareModal from "./LaunchSoftwareModal";

export default function PublicHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleOpenModal = () => setIsModalOpen(true);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("open-software-modal", handleOpenModal);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("open-software-modal", handleOpenModal);
    };
  }, [pathname]);

  // Public header only renders on public routes if NOT logged in as active dashboard user
  const publicRoutes = ["/", "/about", "/support", "/track", "/cx-login"];
  if (!publicRoutes.includes(pathname) || isLoggedIn) return null;

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "Business Websites", href: "/#business-web" },
    { name: "Repair & IT Hub", href: "/#hardware-it" },
    { name: "Cyber Cafe", href: "/#cyber-cafe", badge: "Services" },
    { name: "SaaS Software", href: "/#software", badge: "SaaS" },
    { name: "Track Repair", href: "/track" },
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-md shadow-slate-900/5" 
            : "bg-white/90 backdrop-blur-sm border-b border-slate-200/70"
        } text-slate-800`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo with Circuit / Tech Icon */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25 ring-1 ring-blue-500/20 group-hover:scale-105 transition-all">
              <Cpu size={22} className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                National Computer
              </span>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest">Allahabad</span>
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-500 font-semibold">IT Studio & Lab</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors relative py-1 flex items-center gap-1.5 group"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200 rounded-md uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* Sister Hardware Store Link (Refurhub.com) */}
            <a
              href="https://refurhub.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-full font-bold"
              title="Shop Refurbished Laptops & Hardware on Refurhub.com"
            >
              <span>Hardware Store</span>
              <ExternalLink size={12} className="text-emerald-600" />
            </a>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Secondary CTA: Launch Software */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all shadow-sm active:scale-95"
            >
              <Sparkles size={14} className="text-blue-600" />
              <span>Launch Software</span>
            </button>

            {/* Primary CTA: Start a Project */}
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <span>Start a Project</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-6 space-y-6 animate-in slide-in-from-top-4 duration-200 shadow-xl">
            <nav className="flex flex-col gap-3.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-bold text-slate-700 hover:text-blue-600 py-2 flex items-center justify-between border-b border-slate-100"
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              <a
                href="https://refurhub.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold text-emerald-700 py-2 flex items-center justify-between border-b border-slate-100"
              >
                <span className="flex items-center gap-2">
                  <span>Hardware Store (Refurhub.com)</span>
                </span>
                <ExternalLink size={14} />
              </a>

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-blue-600 py-2 flex items-center justify-between border-b border-slate-100"
              >
                <span>About National Computer</span>
              </Link>
            </nav>

            {/* Mobile CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-200"
              >
                <Sparkles size={15} className="text-blue-600" />
                Launch Software (SaaS Demo & Login)
              </button>

              <Link
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 text-center shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <span>Start a Project / Request Quote</span>
                <ArrowRight size={15} />
              </Link>

              <a
                href="https://wa.me/917860130721?text=Hello%20National%20Computer%20Allahabad,%20I%20want%20to%20inquire%20about%20your%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-center font-bold text-emerald-700 hover:text-emerald-800 py-2 inline-flex items-center justify-center gap-1.5"
              >
                <PhoneCall size={14} />
                <span>Chat on WhatsApp: +91 7860130721</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Interactive Launch Software Modal */}
      <LaunchSoftwareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
