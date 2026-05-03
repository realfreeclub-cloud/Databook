"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap, FileSpreadsheet, WifiOff, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen p-6 pt-10 pb-24">
      <header className="flex items-center mb-10 space-x-3">
        <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">About App</h1>
      </header>

      <div className="space-y-10">
        {/* Purpose Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
            Your Digital Register for Modern Repair Shops.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Digital Register is built specifically for mobile and laptop repair service centers. We've replaced the traditional paper-based entry books with a sleek, lightning-fast digital solution that lives on your phone.
          </p>
        </section>

        {/* Features Section */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Key Features</h3>
          
          <div className="grid gap-4">
            <div className="p-5 bg-white border border-border rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 h-fit">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-1">Fast Management</h4>
                <p className="text-sm text-muted-foreground">Add, search, and update repair records in seconds with our optimized mobile UI.</p>
              </div>
            </div>

            <div className="p-5 bg-white border border-border rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0 h-fit">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-1">Excel Sync</h4>
                <p className="text-sm text-muted-foreground">Bulk import existing data or export your register for backups and accounting.</p>
              </div>
            </div>

            <div className="p-5 bg-white border border-border rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0 h-fit">
                <WifiOff size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-1">Offline Support</h4>
                <p className="text-sm text-muted-foreground">All data is stored locally on your device, ensuring it works even without internet.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="bg-muted/30 border border-border rounded-3xl p-8 text-center animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
          <div className="flex justify-center mb-4">
            <CheckCircle2 size={40} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Built for Reliability</h3>
          <p className="text-sm text-muted-foreground">
            Version 1.0.0 • Developed with focus on data integrity and speed for National Computer Allahabad.
          </p>
        </section>
      </div>

      <footer className="mt-auto pt-10 text-center">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">
          © 2024 Digital Register App
        </p>
      </footer>
    </main>
  );
}
