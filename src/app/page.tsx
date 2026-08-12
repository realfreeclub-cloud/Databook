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
  Upload,
  ShieldAlert,
  Server,
  Lock,
  ChevronRight,
  Database
} from "lucide-react";
import { getRecordsFromDB, getCurrentUser } from "@/lib/actions";

export default function Home() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
          
          const records = await getRecordsFromDB();
          const paid = records.filter(r => r.isPaid).length;
          setStats({
            total: records.length,
            paid: paid,
            unpaid: records.length - paid
          });
        } else {
          // If no server session, clear localStorage display info
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user and dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium animate-pulse">Initializing Portal...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex flex-col min-h-screen bg-[#0c0f1d] text-slate-100 overflow-x-hidden pb-24">
        {/* Glow effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[60%] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-20%] w-[60%] h-[50%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Section */}
        <section className="px-6 pt-20 pb-16 text-center space-y-6 max-w-lg mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-primary-foreground/90 backdrop-blur-md mb-2 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            V1.0.0 Now Fully Secure
          </div>
          
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-violet-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 rotate-6 hover:rotate-0 transition-transform duration-300 border border-white/15">
            <LayoutDashboard size={40} strokeWidth={1.5} />
          </div>
          
          <h1 className="text-4xl font-black tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
            Digital Register <br/>
            <span className="text-primary text-3xl font-extrabold opacity-95">for Repair Professionals</span>
          </h1>
          
          <p className="text-slate-400 text-base max-w-sm mx-auto font-medium leading-relaxed">
            A premium, multi-user web portal to securely manage client jobs, track technician workflow, monitor payment states, and download reports.
          </p>
          
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center py-4 px-8 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-xl shadow-primary/10 hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] gap-2 text-base border border-white/10"
            >
              Register Shop Account
              <ArrowRight size={18} />
            </Link>
            
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center py-4 px-8 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] gap-2 text-base border border-white/10"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Security Alert Section */}
        <section className="px-6 max-w-md mx-auto mb-10">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-5 rounded-3xl flex gap-4 backdrop-blur-md shadow-lg shadow-emerald-950/20">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl h-fit border border-emerald-500/30">
              <Lock size={22} />
            </div>
            <div>
              <h4 className="font-bold text-emerald-300 text-sm">Strict User-to-User Isolation</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Your registers are 100% private. Secured by HTTP-Only session cookies and isolated database query boundaries, preventing data leakage or conflict between users.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-10 space-y-6 max-w-md mx-auto relative z-10">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.25em] text-center mb-6">Designed for Excellence</h3>
          
          <div className="grid gap-5">
            <div className="flex items-start gap-4 p-5 bg-white/[0.02] hover:bg-white/[0.04] rounded-3xl border border-white/5 transition-all">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shadow-sm">
                <List size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-100">Job Record Sheets</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">Log brand details, hardware check verification, expected delivery dates, accessories collection, and customer passwords securely.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white/[0.02] hover:bg-white/[0.04] rounded-3xl border border-white/5 transition-all">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shadow-sm">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-100">Smart Payment Balance</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">Mark full payments or compute pending advance values automatically to track outstanding center balances.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white/[0.02] hover:bg-white/[0.04] rounded-3xl border border-white/5 transition-all">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 shadow-sm">
                <Download size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-100">Excel Backups & Import</h4>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">Export formatted worksheets in one click or import legacy customer lists directly into the system database.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Logged In Dashboard
  return (
    <main className="flex flex-col min-h-screen p-6 pt-10 pb-24 bg-muted/20">
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
            <p className="text-3xl font-black text-foreground leading-none mt-1">{stats.total}</p>
          </div>
        </div>
        
        <div className="p-5 bg-white border border-border rounded-[2rem] shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-2xl w-fit mb-3">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Paid Jobs</p>
          <p className="text-2xl font-black text-foreground leading-none mt-1">{stats.paid}</p>
        </div>

        <div className="p-5 bg-white border border-border rounded-[2rem] shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-3">
            <Clock size={20} />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Unpaid Jobs</p>
          <p className="text-2xl font-black text-foreground leading-none mt-1">{stats.unpaid}</p>
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
