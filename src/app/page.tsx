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
  Lock,
  Database,
  Wrench,
  Package,
  AlertTriangle,
  CreditCard,
  UserCheck,
  ChevronDown,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  Cpu,
  RefreshCw,
  Zap
} from "lucide-react";
import { getRecordsFromDB, getCurrentUser } from "@/lib/actions";
import { logoutUser } from "@/app/login/actions";

// Mockup Data for CSS Preview
const MOCK_RECORDS = [
  { job: "JOB-1024", name: "Ramesh Sharma", device: "Dell Inspiron 15", issue: "Motherboard repair", status: "Done", payment: "Paid", amt: "₹4,500" },
  { job: "JOB-1025", name: "Amit Patel", device: "HP Pavilion", issue: "Screen Replacement", status: "Pending", payment: "Unpaid", amt: "₹3,200" },
  { job: "JOB-1026", name: "Vikram Singh", device: "MacBook Air M1", issue: "Liquid damage clean", status: "Non Repair", payment: "Unpaid", amt: "₹8,500" },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
      <main className="flex flex-col min-h-screen bg-[#070a13] text-slate-100 overflow-x-hidden">
        {/* Decorative Grid & Blur */}
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary/10 to-transparent blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-16 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-xs font-bold text-slate-300 backdrop-blur-md shadow-inner animate-fade-in">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Designed Specially for Laptop & PC Repair Stores
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] max-w-4xl mx-auto">
            Say Goodbye to Paper Registers. <br className="hidden sm:inline"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-violet-500 font-black">
              Manage Your Repair Shop Digitally
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            A secure, cloud-backed service register to organize customer repair entries, track parts inventory, log product sales, and automatically dispatch WhatsApp service confirmations.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center py-4 px-8 bg-primary hover:bg-primary/95 text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl transition-all hover:translate-y-[-1px] active:translate-y-0 gap-2 text-sm"
            >
              Register Your Shop
              <ArrowRight size={16} />
            </Link>
            
            <Link 
              href="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center py-4 px-8 bg-white/5 hover:bg-white/10 text-slate-300 font-extrabold rounded-2xl border border-white/10 transition-all hover:translate-y-[-1px] active:translate-y-0 gap-2 text-sm"
            >
              Sign In to Store
            </Link>
          </div>

          {/* INTERACTIVE PREVIEW MOCKUP */}
          <div className="pt-10 max-w-4xl mx-auto w-full">
            <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 text-left animate-in zoom-in-95 duration-500">
              {/* Mockup Toolbar */}
              <div className="bg-[#0e1422] px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider ml-3">Registry Dashboard Live Preview</span>
                </div>
                <div className="w-32 h-6 bg-[#070a13] rounded-lg border border-slate-800 flex items-center justify-center">
                  <span className="text-[9px] text-slate-500 font-mono">job-wale.com</span>
                </div>
              </div>
              
              {/* Mockup Body */}
              <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Total Records</p>
                    <p className="text-xl font-black text-white mt-1">128</p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Active Repairs</p>
                    <p className="text-xl font-black text-emerald-400 mt-1">84</p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Pending Cash</p>
                    <p className="text-xl font-black text-amber-400 mt-1">₹18,400</p>
                  </div>
                </div>
                
                {/* Simulated Records List */}
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Jobs Register</p>
                  <div className="space-y-2">
                    {MOCK_RECORDS.map((row, idx) => (
                      <div key={idx} className="p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between gap-4 text-xs font-semibold text-slate-300">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-500">{row.job}</span>
                          <div>
                            <p className="font-bold text-white text-sm">{row.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{row.device}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-slate-400">{row.issue}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.status === "Done" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                            row.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>{row.status}</span>
                          <span className="font-black text-white">{row.amt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRADITIONAL PAPER VS DIGITAL REGISTER COMPARISON */}
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900 mt-10">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">The Evolution of Service Register</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Why Switch to Digital Register?</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">Traditional paper ledger notebooks lead to critical issues. Here is how we transform your shop operation.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* The Old Way */}
            <div className="p-8 bg-red-950/5 border border-red-500/10 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/25">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="font-extrabold text-xl text-white">Traditional Paper Register (Old Way)</h3>
              </div>
              <ul className="space-y-4 text-xs font-semibold text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>Messy handwriting makes reading customer phone numbers, serials, and laptop password configurations difficult.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>No search capability; finding older repair dates requires flipping through hundreds of paper pages manually.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>Leaking cash accounts. Unpaid balances, technician costs, and customer advance offsets are hard to track accurately.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>No security boundaries. Anyone in the shop can browse, look up, or tamper with customer registry records.</span>
                </li>
              </ul>
            </div>

            {/* The Digital Way */}
            <div className="p-8 bg-[#0b0f19] border border-indigo-500/20 rounded-3xl space-y-6 relative overflow-hidden shadow-lg shadow-indigo-500/[0.02]">
              <div className="absolute top-0 right-0 p-3 bg-indigo-600 text-white rounded-bl-2xl text-[9px] font-black uppercase tracking-wider">Recommended</div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/25">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-extrabold text-xl text-white">Digital Register Portal (New Way)</h3>
              </div>
              <ul className="space-y-4 text-xs font-semibold text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>**Auto-Generated Unique Job Numbers** & integrated verification checklists to prevent hardware disputes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>**Instant Search Bar:** Find any customer repair history, device model, or status in less than a second.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>**Instant WhatsApp Alerts:** Pre-filled template alerts containing job receipt details to send to customer.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>**Secure Data Isolation:** Dynamic cryptographically signed session cookies ensure no manager leaks data.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* DETAILED CORE FEATURES TOUR */}
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Designed for Performance</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Core Features Built for You</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-3xl transition-all space-y-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 w-fit">
                <Wrench size={22} />
              </div>
              <h4 className="font-extrabold text-base text-white">Repair Registry</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log laptop brands, main issues, customer configurations, passwords, signature status, and expected delivery timers.
              </p>
            </div>

            <div className="p-6 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-3xl transition-all space-y-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 w-fit">
                <Package size={22} />
              </div>
              <h4 className="font-extrabold text-base text-white">Parts Inventory</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add screens, SSDs, keyboards, or RAM. Monitor stock levels with auto-triggered low stock warnings (under 5 items).
              </p>
            </div>

            <div className="p-6 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-3xl transition-all space-y-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 w-fit">
                <Cpu size={22} />
              </div>
              <h4 className="font-extrabold text-base text-white">Log Shop Sales</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Make sales entries of spare parts directly to clients. The system updates stock levels and records transaction logs automatically.
              </p>
            </div>

            <div className="p-6 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-3xl transition-all space-y-4">
              <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20 w-fit">
                <Download size={22} />
              </div>
              <h4 className="font-extrabold text-base text-white">Excel Sync Backups</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bulk import existing Excel worksheets or download active register lists for accounting offline.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING & SUBSCRIPTION SECTION */}
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Affordable License Plans</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Select Shop Subscription</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">Get started instantly. Licenses are manually activated by Super Admin.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="p-6 bg-[#0a0d18] border border-slate-800 rounded-3xl flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Basic access</span>
                <h4 className="font-extrabold text-lg text-white mt-1">1 Month License</h4>
                <p className="text-2xl font-black text-white mt-4">₹21<span className="text-xs text-slate-500 font-semibold">/month</span></p>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">Perfect for test periods. Manual activation by admin.</p>
              </div>
              <Link href="/register" className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-center font-bold text-xs rounded-xl transition-all text-white">Register & Subscribe</Link>
            </div>

            <div className="p-6 bg-[#0b0f19] border border-indigo-500/30 rounded-3xl flex flex-col justify-between space-y-6 relative shadow-lg shadow-indigo-500/[0.02]">
              <span className="absolute top-0 right-6 p-2 bg-indigo-600 text-white rounded-b-xl text-[8px] font-black uppercase tracking-wider">Most Popular</span>
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Quarterly plan</span>
                <h4 className="font-extrabold text-lg text-white mt-1">Quarterly (3 Months)</h4>
                <p className="text-2xl font-black text-white mt-4">₹60<span className="text-xs text-slate-500 font-semibold">/3 months</span></p>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">Save on manual fees. Recommended for established shops.</p>
              </div>
              <Link href="/register" className="w-full py-3 bg-primary hover:bg-primary/95 text-center font-bold text-xs rounded-xl transition-all text-white shadow-md shadow-primary/10">Register & Subscribe</Link>
            </div>

            <div className="p-6 bg-[#0a0d18] border border-slate-800 rounded-3xl flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Best value</span>
                <h4 className="font-extrabold text-lg text-white mt-1">6 Months License</h4>
                <p className="text-2xl font-black text-white mt-4">₹120<span className="text-xs text-slate-500 font-semibold">/6 months</span></p>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">Maximum value option. Fully synced backups guaranteed.</p>
              </div>
              <Link href="/register" className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-center font-bold text-xs rounded-xl transition-all text-white">Register & Subscribe</Link>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="max-w-3xl mx-auto px-6 py-20 border-t border-slate-900">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Have Questions?</span>
            <h2 className="text-3xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is my computer repair shop data private?", a: "Yes. Every user's record set is isolated at the database query layer. Supported by cryptographically signed HTTP-only cookies, no other store keeper can see, search, or edit your entries." },
              { q: "How do I activate my license plan?", a: "Once you register and choose a plan in the 'License System' panel, click 'Activate/Extend'. You can send the amount (e.g. ₹60) to the Super Admin via UPI or call support. Admin will activate your registry instantly." },
              { q: "Can I import bulk customer records from Excel?", a: "Yes. In the registry dashboard, we provide an 'Upload Excel' option. Download our sample Excel sheet, paste your existing customer data, and upload to sync instantly." },
              { q: "How does the WhatsApp service confirmation work?", a: "When you submit a new repair job entry, a success card appears with a green 'WhatsApp Confirmation' button. Clicking it automatically opens a formatted message template in WhatsApp Web or App pre-filled with the Job Number, device model, issues, and cost for the customer." },
            ].map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-2xl bg-white/[0.01] overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex justify-between items-center text-xs sm:text-sm font-bold text-white hover:bg-white/[0.02] transition-colors"
                >
                  <span className="flex items-center gap-2"><HelpCircle size={16} className="text-primary shrink-0" /> {faq.q}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 shrink-0 text-slate-500 ${openFaq === idx ? "rotate-180 text-white" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 border-t border-slate-900 text-xs text-slate-400 leading-relaxed font-semibold animate-in slide-in-from-top-2 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FOUNDER & SPONSOR MESSAGE */}
        <section className="max-w-4xl mx-auto px-6 py-12 border-t border-slate-900 mt-10">
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="space-y-4 flex-1">
              <span className="text-[10px] bg-slate-800 px-3 py-1 rounded-full font-bold text-slate-300 uppercase tracking-wider w-fit block">Vision & Sponsorship</span>
              <blockquote className="text-sm font-semibold text-slate-300 italic leading-relaxed">
                "We faced massive difficulties managing laptop service forms and pending customer balances on paper sheets. Collaborating with developer Devraj Singh Tomar, we built Digital Register to provide an absolute digital ledger solution for laptop repair shops nationwide."
              </blockquote>
              <div>
                <p className="font-bold text-sm text-white">National Computer</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5"> Allahabad (Sponsor & Co-founder)</p>
              </div>
            </div>
            
            {/* Developer showcase */}
            <div className="bg-[#0b0f19] border border-indigo-500/20 rounded-2xl p-6 md:w-80 shrink-0 space-y-4">
              <span className="text-[9px] text-primary font-bold uppercase tracking-widest">Designed & Developed By</span>
              <div>
                <h4 className="font-black text-sm text-white">Devraj Singh Tomar</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-1">Full-stack software architect specializing in database speed and secure POS portals.</p>
              </div>
              <a 
                href="https://devrajsinghtomar.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-2.5 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-center font-bold text-xs rounded-xl transition-all text-primary flex items-center justify-center gap-1"
              >
                Visit Portfolio
                <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#04060d] border-t border-slate-900 py-12 mt-20 text-center text-xs text-slate-500 font-semibold space-y-2">
          <p className="uppercase tracking-widest text-[9px] text-slate-600">V1.0.0 • NATIONAL COMPUTER REGISTER BOOK</p>
          <p>© 2026 Digital Register. Developed by Devraj Singh Tomar.</p>
        </footer>
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
