"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  PlusCircle, 
  List, 
  ArrowRight, 
  Download, 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  FileText,
  Upload
} from "lucide-react";
import { getRecords, RecordItem } from "@/lib/data";

export default function Home() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load stats
    const records = getRecords();
    const paid = records.filter(r => r.isPaid).length;
    setStats({
      total: records.length,
      paid: paid,
      unpaid: records.length - paid
    });
    setIsLoading(false);
  }, []);

  if (!user && !isLoading) {
    return (
      <main className="flex flex-col min-h-screen bg-white">
        {/* Hero Section */}
        <section className="px-6 pt-16 pb-12 text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-sm">
            <LayoutDashboard size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Digital Register <br/>
            <span className="text-primary text-3xl font-bold opacity-90">for Repair Shops</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xs mx-auto font-medium leading-relaxed">
            Manage your jobs, track payments, and export data in seconds.
          </p>
          <div className="pt-4">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center w-full max-w-xs py-4 px-8 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl active:scale-[0.98] transition-all gap-2"
            >
              Get Started Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-10 space-y-8 pb-32">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] text-center mb-6">Key Features</h3>
          
          <div className="grid gap-6">
            <div className="flex items-start gap-4 p-5 bg-muted/30 rounded-2xl border border-border/50">
              <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-border/50">
                <List size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Record Management</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">Keep a digital log of all repair jobs, customer info, and laptop passwords.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-muted/30 rounded-2xl border border-border/50">
              <div className="p-3 bg-white text-green-600 rounded-xl shadow-sm border border-border/50">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Payment Tracking</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">Easily track paid and unpaid jobs. Never miss a payment again.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-muted/30 rounded-2xl border border-border/50">
              <div className="p-3 bg-white text-purple-600 rounded-xl shadow-sm border border-border/50">
                <Download size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Excel Export/Import</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">Export your data to Excel for backups or printouts in one tap.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen p-6 pt-10 pb-24">
      {/* Header Section */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {user ? `Welcome, ${user.name.split(" ")[0]}!` : "Welcome Back!"}
          </h1>
          <p className="text-muted-foreground text-sm">
            Service Center Dashboard
          </p>
        </div>
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20 shadow-sm">
          <LayoutDashboard size={24} />
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="col-span-2 p-5 bg-white border border-border rounded-[2rem] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Total Records</p>
            <p className="text-3xl font-black text-foreground leading-none mt-1">{isLoading ? "--" : stats.total}</p>
          </div>
        </div>
        
        <div className="p-5 bg-white border border-border rounded-[2rem] shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-2xl w-fit mb-3">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Paid Jobs</p>
          <p className="text-2xl font-black text-foreground leading-none mt-1">{isLoading ? "--" : stats.paid}</p>
        </div>

        <div className="p-5 bg-white border border-border rounded-[2rem] shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-3">
            <Clock size={20} />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Unpaid Jobs</p>
          <p className="text-2xl font-black text-foreground leading-none mt-1">{isLoading ? "--" : stats.unpaid}</p>
        </div>
      </div>

      {/* Quick Actions Header */}
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-2">Quick Actions</h3>

      {/* Action Grid */}
      <div className="grid gap-4">
        <Link href="/add" className="group flex items-center justify-between p-6 bg-primary text-primary-foreground rounded-[2rem] shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <PlusCircle size={24} />
            </div>
            <div>
              <p className="font-bold text-lg">Add Record</p>
              <p className="text-xs text-primary-foreground/80 font-medium">Create new repair entry</p>
            </div>
          </div>
          <ArrowRight size={24} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link href="/records" className="group flex items-center justify-between p-6 bg-white border border-border text-foreground rounded-[2rem] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-muted rounded-2xl text-primary">
              <List size={24} />
            </div>
            <div>
              <p className="font-bold text-lg">View Register</p>
              <p className="text-xs text-muted-foreground font-medium">Browse job history</p>
            </div>
          </div>
          <ArrowRight size={24} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/upload" className="group flex flex-col p-5 bg-white border border-border text-foreground rounded-[2rem] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl w-fit mb-3">
              <Upload size={20} />
            </div>
            <p className="font-bold">Import</p>
            <p className="text-[10px] text-muted-foreground font-bold">Excel Upload</p>
          </Link>

          <Link href="/export" className="group flex flex-col p-5 bg-white border border-border text-foreground rounded-[2rem] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-3">
              <Download size={20} />
            </div>
            <p className="font-bold">Export</p>
            <p className="text-[10px] text-muted-foreground font-bold">Excel Download</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

