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
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const records = getRecords();
    const paid = records.filter(r => r.isPaid).length;
    setStats({
      total: records.length,
      paid: paid,
      unpaid: records.length - paid
    });
    setIsLoading(false);
  }, []);

  return (
    <main className="flex flex-col min-h-screen p-6 pt-10 pb-24">
      {/* Header Section */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back!</h1>
          <p className="text-muted-foreground text-sm">Service Center Dashboard</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20">
          <LayoutDashboard size={24} />
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="col-span-2 p-5 bg-white border border-border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Records</p>
            <p className="text-2xl font-bold text-foreground">{isLoading ? "--" : stats.total}</p>
          </div>
        </div>
        
        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit mb-3">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paid Jobs</p>
          <p className="text-2xl font-bold text-foreground">{isLoading ? "--" : stats.paid}</p>
        </div>

        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-3">
            <Clock size={20} />
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unpaid Jobs</p>
          <p className="text-2xl font-bold text-foreground">{isLoading ? "--" : stats.unpaid}</p>
        </div>
      </div>

      {/* Quick Actions Header */}
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Quick Actions</h3>

      {/* Action Grid */}
      <div className="grid gap-4">
        <Link href="/add" className="group flex items-center justify-between p-5 bg-primary text-primary-foreground rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <PlusCircle size={24} />
            </div>
            <div>
              <p className="font-bold">Add Record</p>
              <p className="text-xs text-primary-foreground/80">New repair entry</p>
            </div>
          </div>
          <ArrowRight size={20} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link href="/records" className="group flex items-center justify-between p-5 bg-white border border-border text-foreground rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-muted rounded-xl">
              <List size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-bold">View Register</p>
              <p className="text-xs text-muted-foreground">Browse all history</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/upload" className="group flex flex-col p-5 bg-white border border-border text-foreground rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Upload size={20} className="text-green-600 mb-3" />
            <p className="font-bold text-sm">Import</p>
            <p className="text-[10px] text-muted-foreground">Excel Upload</p>
          </Link>

          <Link href="/export" className="group flex flex-col p-5 bg-white border border-border text-foreground rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <Download size={20} className="text-blue-600 mb-3" />
            <p className="font-bold text-sm">Export</p>
            <p className="text-[10px] text-muted-foreground">Excel Download</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
