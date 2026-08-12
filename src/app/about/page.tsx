"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Wrench, Package, Sparkles, Code, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen p-4 pt-8 pb-24 max-w-4xl mx-auto w-full bg-muted/10">
      <header className="flex items-center mb-8 space-x-3">
        <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">About Digital Register</h1>
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Solving computer repair shop problems</p>
        </div>
      </header>

      <div className="space-y-8">
        {/* Core Mission */}
        <section className="bg-white border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-black text-foreground leading-tight tracking-tight">
            Digitizing Laptop & PC Repair Centers
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Every day, computer repair shop owners deal with the chaos of paper register books, missing device checklists, lost passwords, and untracked pending payments. **Digital Register** was designed to solve these exact problems. We replace messy hand-written registries with a secure, lightning-fast web portal.
          </p>
        </section>

        {/* Problems Solved Cards */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Core Problems We Solve</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 bg-white border border-border rounded-3xl flex gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 h-fit">
                <Wrench size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-foreground text-sm">Messy Service Forms</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">No more writing down serial numbers or passwords on paper. Register jobs with auto-generated Job Numbers, device verification checklist, and send a pre-filled service confirmation on WhatsApp instantly.</p>
              </div>
            </div>

            <div className="p-6 bg-white border border-border rounded-3xl flex gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 h-fit">
                <Package size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-foreground text-sm">Untracked Parts & Sales</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Shop owners can manage spare parts (SSD, RAM, screens) in stock. Log product sales to customers directly, which automatically decrements the stock count and logs cash revenue.</p>
              </div>
            </div>

            <div className="p-6 bg-white border border-border rounded-3xl flex gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0 h-fit">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-foreground text-sm">Leaking Payment Accounts</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Automatically calculates total billing, advance payments, and displays exact unpaid balances on your dashboard. Keeps track of unpaid customer returns cleanly.</p>
              </div>
            </div>

            <div className="p-6 bg-white border border-border rounded-3xl flex gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0 h-fit">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-foreground text-sm">Strict Security & Privacy</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Your data is strictly isolated. Backed by secure cryptographic cookies, no shop keeper can access, view, or modify another shop keeper's register logs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Message from Founder */}
        <section className="bg-white border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-600 uppercase tracking-wider w-fit block">Message from Founder</span>
          <blockquote className="text-base font-medium text-foreground italic leading-relaxed">
            "Running a computer repair shop involves managing dozens of customer details, issue logs, delivery dates, and pending payments. Writing these on paper leads to lost details and payment leaks. Digital Register was created to bring order to this chaos, providing a simple, secure, and fast tool for shop owners to manage their businesses online."
          </blockquote>
          <div className="border-t border-border pt-4">
            <p className="font-bold text-sm text-foreground">National Computer Allahabad</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">Founder & Project Sponsor</p>
          </div>
        </section>

        {/* Developer Section */}
        <section className="bg-[#0a0d18] border border-slate-800 text-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-slate-900/10">
          <div className="w-16 h-16 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center shrink-0 text-xl font-black rotate-3">
            <Code size={28} />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest block">Designed & Developed By</span>
            <h3 className="text-xl font-black text-white">Devraj Singh Tomar</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Devraj is a full-stack software engineer dedicated to building high-performance web applications that solve real-world problems. His work focusing on custom CRM, POS platforms, and registry portals ensures absolute type-safety, database query speed, and fluid UI interfaces.
            </p>
            <a 
              href="https://devrajsinghtomar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-bold text-primary hover:underline mt-2 gap-1.5"
            >
              Visit Developer Portfolio
              <ArrowRight size={12} />
            </a>
          </div>
        </section>
      </div>

      <footer className="mt-16 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
        © 2026 Digital Register • ALL RIGHTS RESERVED
      </footer>
    </main>
  );
}
