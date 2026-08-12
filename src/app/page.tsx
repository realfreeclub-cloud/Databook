"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Database,
  Wrench,
  Package,
  AlertTriangle,
  CreditCard,
  UserCheck
} from "lucide-react";
import { getRecordsFromDB, getCurrentUser } from "@/lib/actions";
import { logoutUser } from "@/app/login/actions";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentUser: any = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
          
          // Role redirect
          if (currentUser.role === "SUPER_ADMIN") {
            router.push("/admin");
            return;
          }

          // Fetch dashboard stats only if subscription is active
          if (currentUser.subscriptionActive) {
            const records = await getRecordsFromDB();
            const paid = records.filter(r => r.isPaid).length;
            setStats({
              total: records.length,
              paid: paid,
              unpaid: records.length - paid
            });
          }
        } else {
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
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium animate-pulse">Initializing Portal...</p>
      </main>
    );
  }

  // 1. PUBLIC WEBSITE HOMEPAGE (If user is not logged in)
  if (!user) {
    return (
      <main className="flex flex-col min-h-screen bg-[#060813] text-slate-100 overflow-x-hidden pb-24">
        {/* Glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-primary-foreground/90 backdrop-blur-md mb-2 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Service Dashboard System
          </div>
          
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 rotate-3 border border-white/10">
            <LayoutDashboard size={32} strokeWidth={1.5} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
            Digital Register Book <br/>
            <span className="text-primary font-black opacity-95">for Laptop Repair Shops</span>
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto font-medium leading-relaxed">
            Replace your legacy paper registry notebook with a secure, cloud-backed service portal. Instantly record repairs, track parts inventory, log client sales, and automatically send WhatsApp alerts.
          </p>
          
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center py-4 px-8 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-xl shadow-primary/10 hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] gap-2 text-sm border border-white/10"
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
            
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center py-4 px-8 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] gap-2 text-sm border border-white/10"
            >
              Sign In to Store
            </Link>
          </div>
        </section>

        {/* Highlight Grid */}
        <section className="max-w-5xl mx-auto px-6 py-12 grid gap-6 md:grid-cols-3 relative z-10">
          <div className="p-6 bg-white/[0.02] hover:bg-white/[0.04] rounded-3xl border border-white/5 transition-all space-y-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 w-fit">
              <PlusCircle size={20} />
            </div>
            <h3 className="font-extrabold text-lg text-white">Laptop Repair Sheets</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Register devices with auto-generated unique Job Numbers, customer info, issues list, and accessories checklist. Easily print or share.
            </p>
          </div>

          <div className="p-6 bg-white/[0.02] hover:bg-white/[0.04] rounded-3xl border border-white/5 transition-all space-y-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 w-fit">
              <Package size={20} />
            </div>
            <h3 className="font-extrabold text-lg text-white">Spare Parts Inventory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage shop spare parts (RAM, SSD, screen replacements). Check stock counts, track item pricing, and log product sales to clients.
            </p>
          </div>

          <div className="p-6 bg-white/[0.02] hover:bg-white/[0.04] rounded-3xl border border-white/5 transition-all space-y-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 w-fit">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-extrabold text-lg text-white">Smart Payment Balance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ditch manual ledger calculations. Our system automatically computes unpaid job values, pending advance offsets, and overall revenue status.
            </p>
          </div>
        </section>

        {/* Detailed Solutions Section */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-8 relative z-10 border-t border-slate-900 mt-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Application Mission</span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Solving Real Retail Laptop Repair Problems</h2>
          </div>

          <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="space-y-4 flex-1">
              <p className="text-xs text-slate-400 leading-relaxed">
                Before Digital Register, shop owners faced major database issues:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Lost paper receipts and phone numbers.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Untracked client laptop delivery deadlines.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Unrecorded sales of expensive spare parts.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Security gaps where user data leaked between accounts.
                </li>
              </ul>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our application solves these by introducing **cryptographic HTTP-only sessions**, **user-to-user database privacy bounds**, **auto-generated unique job numbers**, and **integrated inventory logs**.
              </p>
            </div>
            
            {/* Quote block */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:w-80 shrink-0 space-y-4">
              <p className="text-xs font-semibold text-slate-300 italic leading-relaxed">
                "Running a computer repair shop involves managing dozens of customer details, issue logs, delivery dates, and pending payments. Writing these on paper leads to lost details and payment leaks. Digital Register was created to bring order to this chaos."
              </p>
              <div className="border-t border-slate-900 pt-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[11px] text-white">National Computer</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5"> Allahabad</p>
                </div>
                <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded font-black uppercase">Founder</span>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Info Footer */}
        <section className="max-w-4xl mx-auto px-6 py-8 border-t border-slate-900 mt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-slate-400 font-semibold">
                Designed & Developed with Passion by <a href="https://devrajsinghtomar.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Devraj Singh Tomar</a>
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Full-stack software architect building reliable enterprise SaaS tools.</p>
            </div>
            <Link 
              href="/about" 
              className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Read More About Us
              <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // 2. SUBSCRIPTION INACTIVE LOCKOUT WALL (If user is logged in but subscription is expired)
  if (user && !user.subscriptionActive) {
    return (
      <main className="flex flex-col min-h-[85vh] justify-center p-6 bg-muted/20">
        <div className="max-w-md mx-auto w-full text-center space-y-6 bg-white border border-border rounded-[2.5rem] p-8 shadow-md animate-in fade-in slide-in-from-bottom-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-red-200 shadow-inner">
            <AlertTriangle size={32} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground">License Inactive</h1>
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest leading-none">Subscription Expired / Suspended</p>
          </div>
          
          <p className="text-xs text-muted-foreground leading-relaxed px-2">
            Your store's repair register license is currently inactive. You cannot view database records or register new laptop entries. Select a license plan below to activate your registry.
          </p>

          <div className="p-4 bg-muted/20 border border-border rounded-2xl text-left space-y-3">
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Available License Plans:</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-muted-foreground">1 Month Access:</span>
                <span className="font-bold text-foreground">₹21</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-muted-foreground">Quarterly (3 Months):</span>
                <span className="font-bold text-foreground">₹60</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-muted-foreground">Half-Yearly (6 Months):</span>
                <span className="font-bold text-foreground">₹120</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link 
              href="/subscription"
              className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
            >
              <CreditCard size={16} />
              View Subscription Options
            </Link>
            
            <button
              onClick={async () => {
                await logoutUser();
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="w-full py-4 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-2xl text-xs transition-colors"
            >
              Logout Account
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 3. REGULAR STORE DASHBOARD PANEL (If user is logged in and subscription is active)
  return (
    <main className="flex flex-col min-h-screen p-4 pt-8 pb-24 bg-muted/10 md:p-6 lg:p-8">
      {/* Header Section */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {user ? `Welcome, ${user.name.split(" ")[0]}!` : "Welcome Back!"}
          </h1>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold mt-1">
            <UserCheck size={14} className="text-emerald-500 animate-pulse" />
            <span>License Status: Active ({user.subscriptionPlan || "Standard"})</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
          <LayoutDashboard size={24} />
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="col-span-2 p-6 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Records</p>
            <p className="text-3xl font-black text-foreground mt-0.5">{stats.total}</p>
          </div>
        </div>
        
        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-2xl w-fit mb-3">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Paid Jobs</p>
          <p className="text-2xl font-black text-foreground mt-0.5">{stats.paid}</p>
        </div>

        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-3">
            <Clock size={20} />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unpaid Jobs</p>
          <p className="text-2xl font-black text-foreground mt-0.5">{stats.unpaid}</p>
        </div>
      </div>

      {/* Quick Actions Header */}
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-2">Quick Actions</h3>

      {/* Action Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/add" className="group flex items-center justify-between p-6 bg-primary text-primary-foreground rounded-[2rem] shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <PlusCircle size={24} />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">Add Entry</p>
              <p className="text-xs text-primary-foreground/80 font-medium mt-1">Create repair job or inventory item</p>
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
              <p className="font-bold text-lg leading-tight">Repair Records</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Manage jobs, print checklists & billing</p>
            </div>
          </div>
          <ArrowRight size={24} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link href="/inventory" className="group flex items-center justify-between p-6 bg-white border border-border text-foreground rounded-[2rem] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
              <Database size={24} />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">Shop Inventory</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Parts stock levels, pricing & log sales</p>
            </div>
          </div>
          <ArrowRight size={24} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link href="/subscription" className="group flex items-center justify-between p-6 bg-white border border-border text-foreground rounded-[2rem] shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">License System</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">View active plan, extend access</p>
            </div>
          </div>
          <ArrowRight size={24} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </main>
  );
}
