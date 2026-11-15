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
  ChevronRight,
  ShieldCheck,
  Cpu,
  Zap,
  Globe,
  Code2,
  Layers,
  ExternalLink,
  Search,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Check,
  BarChart3,
  QrCode,
  MessageSquare,
  ShoppingCart,
  Send,
  RefreshCw,
  Headphones,
  Server,
  Laptop
} from "lucide-react";
import { getRecordsFromDB, getCurrentUser } from "@/lib/actions";
import { logoutUser } from "@/app/login/actions";
import { createSupportRequest } from "@/lib/adminActions";
import LaunchSoftwareModal from "@/components/LaunchSoftwareModal";
import { getCustomerRepairRecords, CustomerSafeRecord } from "@/lib/customerActions";

// Interactive Mockup Data for Hero
const HERO_TICKETS = [
  {
    id: "JOB-1042",
    customer: "Rajesh K. Verma",
    phone: "+91 98390 XXXXX",
    device: "Dell Latitude 5420",
    issue: "Motherboard Power IC & BIOS",
    status: "Ready for Pickup",
    statusColor: "emerald",
    amount: "₹3,400",
    delivery: "Today, 5:00 PM"
  },
  {
    id: "JOB-1043",
    customer: "Priya Srivastava",
    phone: "+91 94152 XXXXX",
    device: "HP Pavilion 15 Gaming",
    issue: "144Hz FHD Screen Replacement",
    status: "In Progress",
    statusColor: "blue",
    amount: "₹4,200",
    delivery: "Tomorrow, 12:00 PM"
  },
  {
    id: "JOB-1044",
    customer: "Alok Tripathi",
    phone: "+91 79058 XXXXX",
    device: "Lenovo ThinkPad E14",
    issue: "Liquid Spill Ultrasonic Clean",
    status: "Diagnosing",
    statusColor: "amber",
    amount: "₹1,800",
    delivery: "Tomorrow, 6:00 PM"
  }
];

const HERO_PARTS = [
  { name: "512GB NVMe M.2 SSD (Gen 3x4)", stock: 3, alert: true, price: "₹2,650", category: "Storage" },
  { name: "15.6\" Slim 30-Pin FHD IPS Screen", stock: 8, alert: false, price: "₹3,700", category: "Displays" },
  { name: "16GB DDR4 3200MHz Laptop RAM", stock: 14, alert: false, price: "₹2,400", category: "Memory" },
];

const HERO_SALES = [
  { id: "SALE-812", client: "Deepak Sharma", item: "Crucial 1TB NVMe SSD + Fitting", amount: "₹4,950", date: "Just now" },
  { id: "SALE-813", client: "Allahabad Coaching Inst.", item: "3x 65W Original Type-C Adapters", amount: "₹3,600", date: "1 hr ago" },
  { id: "SALE-814", client: "Vikram Rajput", item: "Dell Inspiron Original Keyboard", amount: "₹1,250", date: "3 hrs ago" },
];

// Helper to compute live stage for CustomerSafeRecord
function computeSafeRecordStage(record: CustomerSafeRecord) {
  const status = (record.workStatus || "").toLowerCase();
  const final = (record.finalStatus || "").toLowerCase();

  if (record.actualDeliveryDate || final === "complete") {
    return {
      stage: 4,
      stageText: "Ready for Pickup / Delivered",
      notes: "Device inspection & burn-in passed. Ready for customer collection."
    };
  }
  if (status === "done" || final.includes("complete")) {
    return {
      stage: 4,
      stageText: "Repair Completed • Ready for Pickup",
      notes: "Components fitted and tested on bench station. Unit sanitized and bagged."
    };
  }
  if (status === "non repair" || final.includes("return")) {
    return {
      stage: 3,
      stageText: "Diagnosed • Return Item / Non Repairable",
      notes: "Hardware inspected under microscope. Customer advised regarding spares availability."
    };
  }
  if (status === "pending" || !status) {
    return {
      stage: 2,
      stageText: "In Diagnosis & Chip-Level Rework",
      notes: "Device logged in National Computer Prayagraj register. Bench testing in progress."
    };
  }
  return {
    stage: 1,
    stageText: "Device Checked In",
    notes: "Device received at service desk. Initial physical assessment recorded."
  };
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, paid: 0, unpaid: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Landing Page Interactive States
  const [heroTab, setHeroTab] = useState<"tickets" | "inventory" | "sales">("tickets");
  const [activeModuleTab, setActiveModuleTab] = useState<number>(0);
  const [isAnnualPricing, setIsAnnualPricing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Privacy-Protected Track Repair Widget State
  const [trackJobId, setTrackJobId] = useState("");
  const [trackPhone, setTrackPhone] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackResult, setTrackResult] = useState<CustomerSafeRecord | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Contact Form State
  const [selectedServices, setSelectedServices] = useState<string[]>(["Web Development"]);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactBusiness, setContactBusiness] = useState("");
  const [contactBudget, setContactBudget] = useState("₹25k - ₹75k");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

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
            const total = records.length;
            const paid = records.filter(r => r.isPaid).length;
            const unpaid = records.filter(r => !r.isPaid).length;
            setStats({ total, paid, unpaid });
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to load user or records:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = trackPhone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setTrackError("Please enter your 10-digit registered mobile number to verify ownership.");
      setTrackResult(null);
      setTrackSearched(true);
      return;
    }

    setTrackLoading(true);
    setTrackError(null);

    try {
      const res = await getCustomerRepairRecords({
        phone: cleanDigits,
        jobNumber: trackJobId.trim() || undefined
      });

      if (res.success && res.records && res.records.length > 0) {
        setTrackResult(res.records[0]);
        setTrackError(null);
      } else {
        setTrackResult(null);
        setTrackError(res.error || "No repair record found matching this mobile number and Job ID.");
      }
      setTrackSearched(true);
    } catch (err: any) {
      setTrackResult(null);
      setTrackError("Unable to verify repair status. Please try again or open our Customer Portal.");
      setTrackSearched(true);
    } finally {
      setTrackLoading(false);
    }
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactSubmitting) return;
    setContactSubmitting(true);

    const fullMessage = `[PROJECT INQUIRY]\nServices: ${selectedServices.join(", ")}\nBusiness Name: ${contactBusiness || "N/A"}\nBudget/Timeline: ${contactBudget}\nBrief: ${contactMessage}`;

    try {
      await createSupportRequest(contactName, contactPhone, fullMessage);
      setContactSubmitted(true);
    } catch (err) {
      console.error(err);
      setContactSubmitted(true); // Graceful UX confirmation
    } finally {
      setContactSubmitting(false);
    }
  };

  const triggerExportMock = () => {
    setExportNotice("Exported national_computer_repair_register.xlsx (556 records saved to local drive)");
    setTimeout(() => setExportNotice(null), 3500);
  };

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-900 text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-semibold text-sm animate-pulse">Initializing National Computer Portal...</p>
      </main>
    );
  }

  // =========================================================================
  // 1. PUBLIC WEBSITE (When user is NOT logged in)
  // =========================================================================
  if (!user) {
    return (
      <main id="home" className="flex flex-col min-h-screen bg-[#0b1120] text-slate-100 overflow-x-hidden w-full selection:bg-blue-600 selection:text-white">
        
        {/* Ambient Tech Lighting Gradients */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-[140px] pointer-events-none -z-10" />
        <div className="fixed top-[45%] right-[-10%] w-[550px] h-[550px] bg-emerald-500/[0.04] rounded-full blur-[160px] pointer-events-none -z-10" />

        {/* ===================================================================
            SECTION B: HERO SECTION
        =================================================================== */}
        <section className="relative pt-12 md:pt-20 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & Action Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Pillar Badges Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-bold text-slate-300 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Web • Custom Software • Public SaaS • IT Solutions</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Web Development,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                  Custom Software
                </span>{" "}
                & Complete IT Solutions.
              </h1>

              {/* Sub-headline */}
              <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
                At National Computer Allahabad, we build modern websites, engineer custom business software, offer public-use SaaS tools for repair & retail shops, and deliver expert IT support in Prayagraj.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#software"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                >
                  <Sparkles size={16} />
                  <span>Explore Public Software</span>
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                >
                  <Send size={15} className="text-blue-400" />
                  <span>Get a Web / Software Quote</span>
                </a>
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">12+ Years</div>
                  <div className="text-xs text-slate-400 font-semibold mt-0.5">Engineering Lab</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">550+</div>
                  <div className="text-xs text-slate-400 font-semibold mt-0.5">Shops & Clients</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-blue-400">99.9%</div>
                  <div className="text-xs text-slate-400 font-semibold mt-0.5">Cloud SaaS Uptime</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">Prayagraj</div>
                  <div className="text-xs text-slate-400 font-semibold mt-0.5">Flagship Studio</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive UI Mockup Preview Card */}
            <div className="lg:col-span-5 relative">
              
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/40 via-indigo-600/30 to-emerald-500/30 rounded-[2.5rem] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

              {/* Dashboard Preview Window */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-[2.2rem] p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
                
                {/* Simulated Window Frame Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-[11px] font-mono text-slate-400">cloud.nationalcomputerallahabad.com</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                    Live SaaS Demo
                  </span>
                </div>

                {/* Metric Counters Banner */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-xs font-semibold text-slate-400">Active Jobs</div>
                    <div className="text-base font-black text-white mt-0.5">24</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-xs font-semibold text-slate-400">Today Sales</div>
                    <div className="text-base font-black text-emerald-400 mt-0.5">₹18,600</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-xs font-semibold text-slate-400">Parts Low</div>
                    <div className="text-base font-black text-amber-400 mt-0.5">3 Items</div>
                  </div>
                </div>

                {/* Low-Stock Warning Alert Badge (< 5 units) */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-300">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle size={15} className="text-amber-400 shrink-0" />
                    <span>Low Stock Alert: NVMe 512GB SSD (<strong className="font-bold text-white">&lt; 5 units</strong> left)</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-extrabold rounded text-[10px] uppercase shrink-0">
                    Reorder
                  </span>
                </div>

                {/* Interactive Inner Filter Tabs */}
                <div className="flex items-center justify-between gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setHeroTab("tickets")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      heroTab === "tickets" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Repairs (3)
                  </button>
                  <button
                    onClick={() => setHeroTab("inventory")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      heroTab === "inventory" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Parts Stock
                  </button>
                  <button
                    onClick={() => setHeroTab("sales")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      heroTab === "sales" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Counter Sales
                  </button>
                </div>

                {/* Tab Dynamic Body */}
                <div className="space-y-2 min-h-[175px]">
                  {heroTab === "tickets" && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      {HERO_TICKETS.map(t => (
                        <div key={t.id} className="p-3 bg-slate-950/60 border border-slate-800/90 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-blue-400">{t.id}</span>
                              <span className="text-xs font-bold text-white">{t.customer}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">{t.device} • {t.issue}</div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              t.statusColor === "emerald" 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : t.statusColor === "blue"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}>
                              {t.status}
                            </span>
                            <div className="text-xs font-extrabold text-white mt-0.5">{t.amount}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {heroTab === "inventory" && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      {HERO_PARTS.map(p => (
                        <div key={p.name} className="p-3 bg-slate-950/60 border border-slate-800/90 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-white">{p.name}</div>
                            <div className="text-[11px] text-slate-400">{p.category} • Cost Price: {p.price}</div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              p.alert ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-400"
                            }`}>
                              {p.stock} In Stock
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {heroTab === "sales" && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      {HERO_SALES.map(s => (
                        <div key={s.id} className="p-3 bg-slate-950/60 border border-slate-800/90 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-emerald-400 font-bold">{s.id}</span>
                              <span className="text-xs font-bold text-white">{s.client}</span>
                            </div>
                            <div className="text-[11px] text-slate-400">{s.item}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-black text-emerald-400">{s.amount}</div>
                            <div className="text-[10px] text-slate-500">{s.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mockup Action Footer Bar */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800/80">
                  <button
                    onClick={triggerExportMock}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 active:scale-95"
                    title="Export active registry records"
                  >
                    <Download size={13} className="text-emerald-400" />
                    <span>Export .XLSX</span>
                  </button>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-blue-600/30 active:scale-95"
                  >
                    <PlusCircle size={13} />
                    <span>Launch Full App</span>
                  </button>
                </div>

                {/* Export Toast Notification */}
                {exportNotice && (
                  <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold text-center animate-in fade-in slide-in-from-bottom-2">
                    {exportNotice}
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* ===================================================================
            SECTION C: 4 CORE BUSINESS PILLARS GRID ("WHAT WE DO")
        =================================================================== */}
        <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-bold text-blue-400 uppercase tracking-widest">
              Comprehensive Technology Offerings
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Four Core Pillars of Our IT Studio
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-medium">
              From crafting digital presences to architecting custom business software and delivering precision chip-level hardware repair in Prayagraj.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Pillar 1: Web Development */}
            <div className="group p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/90 transition-all duration-300 space-y-5 relative shadow-lg">
              <div className="w-14 h-14 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Globe size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                  1. Web Development
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Custom corporate websites, high-converting e-commerce stores, full-stack web applications, and cloud server deployment.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 font-semibold pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>Next.js 16, React, Node.js & High-Speed Tailwind CSS</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>Technical SEO optimization & Core Web Vitals under 1.0s</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>Integrated Indian payment gateways (UPI, Cards, NetBanking)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>AWS & Vercel automated CI/CD cloud deployment</span>
                </li>
              </ul>
              <div className="pt-2">
                <a 
                  href="#contact" 
                  onClick={() => setSelectedServices(["Web Development"])}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition-all"
                >
                  <span>Request Web Development Quote</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Pillar 2: Custom Software Development */}
            <div className="group p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-300 space-y-5 relative shadow-lg">
              <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Code2 size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">
                  2. Custom Software Development
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Tailor-made ERP, CRM, POS billing systems, and business workflow automation built around your exact operations.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 font-semibold pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-indigo-400 shrink-0" />
                  <span>Tailored relational database modeling (PostgreSQL / Prisma)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-indigo-400 shrink-0" />
                  <span>Granular role-based staff permissions (Admin, Cashier, Technician)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-indigo-400 shrink-0" />
                  <span>Real-time WhatsApp & SMS API business triggers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-indigo-400 shrink-0" />
                  <span>Automated GST billing, inventory reduction & audit logs</span>
                </li>
              </ul>
              <div className="pt-2">
                <a 
                  href="#contact" 
                  onClick={() => setSelectedServices(["Custom Software / ERP"])}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 group-hover:translate-x-1 transition-all"
                >
                  <span>Discuss Custom Software Specs</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Pillar 3: Public-Use SaaS Software (Flagship Product) */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/40 hover:border-blue-400 transition-all duration-300 space-y-5 relative shadow-xl">
              <div className="absolute top-6 right-6">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">
                  Flagship Cloud Product
                </span>
              </div>
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 border border-blue-400/30 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Database size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                  3. Public-Use SaaS Software
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Ready-to-use cloud software for computer & mobile repair shops to manage tickets, parts stock, sales, and Excel backups—open for anyone to sign up and use.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 font-semibold pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Instant cloud access with zero software installation needed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>4 core modules: Registry, Inventory, Direct Sales & Excel Sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Automated WhatsApp customer reminder notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Multi-device compatibility: Desktop, Tablet & Smartphone</span>
                </li>
              </ul>
              <div className="pt-2 flex items-center gap-4">
                <a 
                  href="#software" 
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition-all"
                >
                  <span>Explore SaaS Spotlight</span>
                  <ArrowRight size={14} />
                </a>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Launch App
                </button>
              </div>
            </div>

            {/* Pillar 4: IT Hardware Repair & Corporate AMC */}
            <div className="group p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 space-y-5 relative shadow-lg">
              <div className="w-14 h-14 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Wrench size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  4. Chip-Level Repair & Corporate AMC
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Trusted hardware diagnostics, motherboard repair, and office AMC in Prayagraj. Equipped with advanced BGA rework stations and precision micro-soldering labs.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 font-semibold pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Laptop motherboard chip-level repair (Power IC, IO Controller, PCH)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Comprehensive Annual Maintenance Contracts (AMC) for corporate offices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Fast turnaround with genuine OEM replacement components</span>
                </li>
              </ul>
              
              {/* Prominent Refurhub Sister Brand Link */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">Sister Hardware Division</div>
                  <div className="text-xs text-slate-200 font-medium">Looking to buy refurbished laptops or spare parts?</div>
                </div>
                <a
                  href="https://refurhub.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                >
                  <span>Visit Refurhub.com</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ===================================================================
            SECTION D: FLAGSHIP PUBLIC SOFTWARE SPOTLIGHT SECTION
        =================================================================== */}
        <section id="software" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-bold text-blue-400 uppercase tracking-widest">
              <Sparkles size={13} />
              <span>Flagship SaaS Platform</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Built by Technicians, Open for Everyone.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-medium">
              Running a repair shop shouldn&apos;t mean losing track of job numbers or inventory. Our cloud platform gives any service center the tools to operate like a tier-1 service company.
            </p>
          </div>

          {/* Interactive Module Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { id: 0, title: "1. Repair Registry", subtitle: "Customer & Device Intake", icon: Laptop },
              { id: 1, title: "2. Parts Inventory", subtitle: "Stock & Low-Stock Alerts", icon: Package },
              { id: 2, title: "3. Log Shop Sales", subtitle: "Direct Counter Billing", icon: ShoppingCart },
              { id: 3, title: "4. Excel Sync Backups", subtitle: "1-Click Offline Backups", icon: Download }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveModuleTab(tab.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  activeModuleTab === tab.id
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30 scale-[1.02]"
                    : "bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <tab.icon size={22} className={activeModuleTab === tab.id ? "text-white mb-2" : "text-blue-400 mb-2"} />
                <div>
                  <div className="font-black text-sm">{tab.title}</div>
                  <div className={`text-xs mt-0.5 ${activeModuleTab === tab.id ? "text-blue-100" : "text-slate-400"}`}>
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Module Detailed Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-16">
            
            {activeModuleTab === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                    Core Module 1: Comprehensive Intake
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Digital Repair Registry & Job Tracking
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Log laptop brands, main issues, customer configurations, device passwords/patterns, digital signature status, and expected delivery countdown timers. Say goodbye to forgotten notes on customer paper slips.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 font-semibold pt-2">
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Device Passcode / Pattern Save</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Charger Collected Checkbox</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Digital Customer Signature</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Expected Delivery Deadline</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                    >
                      <span>Try Registry In Live Demo</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Laptop size={18} className="text-blue-400" />
                      <span className="font-bold text-sm text-white">Sample Job Record: JOB-1285</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded uppercase">
                      Active Ticket
                    </span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Customer Name:</span>
                      <span className="font-bold text-white">Ved Prakash (+91 98390 XXXXX)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Laptop Brand & Model:</span>
                      <span className="font-bold text-white">Dell Vostro 3568 (Core i3)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Reported Problem:</span>
                      <span className="font-bold text-amber-300">Charging Jack Broken & Power Pin Loose</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Charger Collected:</span>
                      <span className="font-bold text-emerald-400">Yes (With Power Cord)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Customer Signature:</span>
                      <span className="font-bold text-blue-400">Digitally Verified on Intake</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Estimated Cost:</span>
                      <span className="font-black text-sm text-white">₹650.00 (Unpaid)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModuleTab === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    Core Module 2: Warehouse Control
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Parts Inventory with Auto Low-Stock Alarms
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Add screens, SSDs, keyboards, RAM sticks, and chargers. Monitor live stock levels with auto-triggered low-stock warnings when inventory drops below 5 units so your workshop never halts mid-repair.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 font-semibold pt-2">
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>&lt; 5 Units Low-Stock Alarm</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Part SKU / Serial Barcode</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Cost vs Sale Price Margin</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>1-Click Stock Adjustment</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                    >
                      <span>Explore Inventory Module</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Package size={18} className="text-emerald-400" />
                      <span className="font-bold text-sm text-white">Live Spare Parts Roster</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Showing 3 of 84 items</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Western Digital 500GB NVMe SSD</div>
                        <div className="text-[10px] text-red-400 font-extrabold">⚠️ Warning: Only 2 units remaining (&lt; 5 threshold)</div>
                      </div>
                      <span className="px-2 py-1 bg-red-500/20 text-red-300 font-black text-xs rounded">
                        2 Left
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">14.0&quot; LED Slim 40-Pin HD Display</div>
                        <div className="text-[10px] text-slate-400">Stock Status: Healthy</div>
                      </div>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-black text-xs rounded">
                        11 Left
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Universal 65W Laptop Charger (19.5V)</div>
                        <div className="text-[10px] text-slate-400">Stock Status: Healthy</div>
                      </div>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-black text-xs rounded">
                        22 Left
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModuleTab === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    Core Module 3: Retail Sales
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Counter Spare Part Sales & Auto Stock Deduction
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Make direct sales entries of spare parts to clients. Automatically deducts stock levels from your warehouse in real time and records daily transaction logs with profit metrics.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 font-semibold pt-2">
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Instant Inventory Deduction</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Cash / Online / UPI Tracking</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Daily Revenue Analytics</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Print Thermal Bill Slips</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                    >
                      <span>Test Counter Sales Entry</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={18} className="text-indigo-400" />
                      <span className="font-bold text-sm text-white">Direct Counter Checkout</span>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">
                      Invoice #NC-9821
                    </span>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>1x Crucial BX500 480GB SATA SSD</span>
                      <span className="font-bold text-white">₹2,450.00</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>1x 2.5&quot; USB 3.0 External Caddy</span>
                      <span className="font-bold text-white">₹450.00</span>
                    </div>
                    <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-2 font-bold">
                      <span className="text-emerald-400">Total Billed:</span>
                      <span className="text-emerald-400 text-sm font-black">₹2,900.00</span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Inventory stock deducted automatically: Crucial SSD (9 → 8 units)</span>
                  </div>
                </div>
              </div>
            )}

            {activeModuleTab === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-md bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
                    Core Module 4: Offline Security
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Excel Sync & 1-Click Backup Export
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Bulk import existing Excel worksheets or download active register lists in one click for offline accounting, CA audits, or safe local backups. You own 100% of your business records.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 font-semibold pt-2">
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>1-Click .XLSX Export</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Bulk Excel File Uploader</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Offline Accounting Peace</span>
                    </div>
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Encrypted Cloud Sync</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={triggerExportMock}
                      className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                    >
                      <Download size={14} />
                      <span>Simulate Excel Export Now</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20">
                    <Download size={28} />
                  </div>
                  <h4 className="font-bold text-white text-base">Bulk Spreadsheet Engine</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Already have hundreds of jobs recorded in Microsoft Excel or Google Sheets? Upload your spreadsheet to automatically migrate all historical records into your cloud register.
                  </p>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300">
                    File: NCA_Repair_Registry_2026.xlsx • Verified 556 Records
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Smart Add-on Highlights (3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                <QrCode size={20} />
              </div>
              <h4 className="font-black text-white text-base">QR Code Receipt Tracking</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Every repair intake receipt generates a unique QR code. Customers simply scan it with their phone camera to view live diagnostic and component status without disturbing your counter technicians.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <h4 className="font-black text-white text-base">Automated WhatsApp Alerts</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Dispatches pre-formatted WhatsApp notifications on intake (&ldquo;Dear Customer, we received Job #1285...&rdquo;) and completion (&ldquo;Job #1285 is Ready! Amount: ₹280...&rdquo;) directly to customer numbers.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h4 className="font-black text-white text-base">GST Invoice & Thermal Bills</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Produce professional 80mm thermal POS counter slips or formal A4 GST tax invoices featuring your shop name, logo, GSTIN, HSN codes, and legal terms in 1-click.
              </p>
            </div>

          </div>

          {/* =================================================================
              SaaS Free vs Pro Quick Comparison Toggle
          ================================================================== */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">SaaS Subscription Plans</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Transparent, technician-friendly pricing for single stores & multi-branch hubs.</p>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setIsAnnualPricing(false)}
                  className={`py-1.5 px-3 rounded-lg transition-all ${
                    !isAnnualPricing ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnualPricing(true)}
                  className={`py-1.5 px-3 rounded-lg transition-all flex items-center gap-1.5 ${
                    isAnnualPricing ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Annual</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-black text-[9px] rounded uppercase">
                    Save 25%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Plan 1: Free Forever */}
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-lg text-white">Community Free Tier</h4>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded uppercase">
                    Zero Cost
                  </span>
                </div>
                <div className="text-3xl font-black text-white">
                  ₹0 <span className="text-xs text-slate-400 font-semibold">/ Free Forever</span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Ideal for small repair shops or technicians getting started with digital registers.</p>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span>Up to 50 active repair tickets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span>Basic parts inventory (up to 25 items)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span>Manual WhatsApp alerts via web chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span>Single store manager login</span>
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl block text-center transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Plan 2: Pro Storekeeper */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-950 border border-blue-500/60 space-y-4 relative shadow-lg">
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-lg text-white">Pro Storekeeper Plan</h4>
                </div>
                <div className="text-3xl font-black text-white">
                  {isAnnualPricing ? "₹375" : "₹499"}{" "}
                  <span className="text-xs text-slate-400 font-semibold">
                    / month {isAnnualPricing && "(Billed ₹4,499 annually)"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">For busy repair centers handling daily customer volume and spare parts sales.</p>
                <ul className="space-y-2 text-xs text-slate-200 font-semibold">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span>Unlimited repair jobs & complete history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span>Unlimited parts inventory with &lt; 5 stock alarms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span>Automated WhatsApp customer reminder dispatch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span>1-Click Excel backup export & bulk sheet import</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span>GST tax invoices & 80mm thermal slip printing</span>
                  </li>
                </ul>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl block text-center shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5"
                >
                  Create Free Account / Try Live Demo
                </button>
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================================
            SECTION E: PRIVACY-PROTECTED "TRACK YOUR REPAIR" UTILITY WIDGET
        =================================================================== */}
        <section id="track-repair" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-slate-800/80">
          
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <ShieldCheck size={13} />
              <span>Privacy-Protected Customer Tracker</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Track Your Repair in Real Time
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Had your laptop, desktop, or gadget submitted at our Prayagraj service center? Enter your registered mobile number and Job ID below for verified live status.
            </p>
          </div>

          {/* Quick Access to Full Customer Portal Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
                <Laptop size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Dedicated Customer Support Portal (CX Login)</h4>
                <p className="text-[11px] text-slate-300">View complete repair history, print official job cards, and check pending bills.</p>
              </div>
            </div>
            <Link
              href="/track"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Open Customer Portal</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Search Lookup Bar with Phone & Job ID Verification */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-3xl shadow-xl max-w-2xl mx-auto mb-8">
            <form onSubmit={handleTrackSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Registered Phone Field */}
                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Registered Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={trackPhone}
                      onChange={(e) => setTrackPhone(e.target.value)}
                      maxLength={14}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Job ID / Ticket Number Field */}
                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Job / Ticket Number (Optional)
                  </label>
                  <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. 559, NCA-1042"
                      value={trackJobId}
                      onChange={(e) => setTrackJobId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={trackLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {trackLoading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Verifying Customer Record...</span>
                  </>
                ) : (
                  <>
                    <Search size={15} />
                    <span>Track Repair Status</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <Lock size={12} className="text-emerald-400" />
                <span>Protected by Customer Phone Authentication. Zero public data exposure.</span>
              </div>
            </form>
          </div>

          {/* Error Notice */}
          {trackSearched && trackError && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-300 text-xs font-semibold max-w-2xl mx-auto mb-6 animate-in shake">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{trackError}</p>
                <div className="mt-2 flex items-center gap-3">
                  <Link href="/track" className="text-blue-400 hover:underline font-bold">
                    Go to Full Customer Portal →
                  </Link>
                  <a 
                    href="https://wa.me/917860130721?text=Hello%20National%20Computer,%20I%20need%20assistance%20tracking%20my%20device." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    Contact Support on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Live Repair Status Result Card (Verified Data) */}
          {trackSearched && trackResult && (() => {
            const stageInfo = computeSafeRecordStage(trackResult);
            return (
              <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        Ticket #{trackResult.jobNumber}
                      </span>
                      <span className="text-xs text-slate-400">• {trackResult.shopName}</span>
                    </div>
                    <h3 className="text-xl font-black text-white">{trackResult.laptop}</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Customer: <strong className="text-slate-200">{trackResult.name}</strong> • Registered: +91 {trackResult.maskedPhone}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-xs text-slate-400">Current Phase</div>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">{stageInfo.stageText}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Received: <strong className="text-white">{trackResult.receivedDate}</strong> • Expected: <strong className="text-white">{trackResult.expectedDeliveryDate || "In Inspection"}</strong>
                    </div>
                  </div>
                </div>

                {/* 4-Stage Interactive Progress Stepper */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Diagnostic & Repair Milestones</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                      { step: 1, name: "1. Intake Logged", desc: "Inspection & intake logged" },
                      { step: 2, name: "2. Diagnosing", desc: "Chip-level circuit analysis" },
                      { step: 3, name: "3. Repaired / Tested", desc: "Component fitted & burn-in" },
                      { step: 4, name: "4. Ready for Pickup", desc: "Quality check passed" }
                    ].map(s => {
                      const isDone = s.step <= stageInfo.stage;
                      const isCurrent = s.step === stageInfo.stage;
                      return (
                        <div 
                          key={s.step} 
                          className={`p-3 rounded-2xl border transition-all ${
                            isCurrent
                              ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                              : isDone
                              ? "bg-emerald-500/10 border-emerald-500/30 text-slate-200"
                              : "bg-slate-950/50 border-slate-800 text-slate-500"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs">{s.name}</span>
                            {isDone ? (
                              <CheckCircle2 size={14} className={isCurrent ? "text-blue-400" : "text-emerald-400"} />
                            ) : (
                              <Clock size={14} className="text-slate-600" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{s.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Technician Notes Box */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bench Technician Observation:</div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    &ldquo;{stageInfo.notes}&rdquo;
                  </p>
                </div>

                {/* Direct WhatsApp Contact & Full Portal CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-400">
                    Repair Amount: <strong className="text-white text-sm font-black">₹{trackResult.amount.toFixed(2)}</strong>{" "}
                    <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      trackResult.isPaid ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {trackResult.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href={`/track?job=${encodeURIComponent(trackResult.jobNumber)}&phone=${encodeURIComponent(trackPhone.replace(/\D/g, "").slice(-10))}`}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Laptop size={14} className="text-blue-400" />
                      <span>Open in Customer Portal</span>
                    </Link>

                    <a
                      href={`https://wa.me/917860130721?text=${encodeURIComponent(`Hello National Computer, I am checking status of my Ticket #${trackResult.jobNumber} for ${trackResult.laptop}. Customer: ${trackResult.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      <MessageSquare size={14} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })()}

        </section>

        {/* ===================================================================
            SECTION F: REFURHUB.COM SISTER-BRAND CALLOUT BANNER
        =================================================================== */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-black text-emerald-300 uppercase tracking-widest">
                  <ShieldCheck size={14} />
                  <span>Sister Hardware Division • Refurhub</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  Need Certified Refurbished Laptops, Desktops, or Genuine Spare Parts?
                </h3>

                <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
                  Explore our dedicated hardware e-commerce platform <strong className="text-white font-bold">Refurhub.com</strong>—tested business laptops, SSD/RAM upgrades, and bulk B2B deals backed by National Computer Allahabad&apos;s technical quality check.
                </p>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    6-Month Hardware Warranty
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    40-Point Hardware Diagnostic
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    Pan-India Express Delivery
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
                <a
                  href="https://refurhub.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-100 transition-all text-center"
                >
                  <span>Shop on Refurhub.com</span>
                  <ExternalLink size={16} />
                </a>
                <span className="text-[11px] text-slate-400 mt-2 font-medium">Opens official e-commerce storefront in a new tab</span>
              </div>

            </div>

          </div>
        </section>

        {/* ===================================================================
            SECTION G: PROJECT INQUIRY & CONTACT SECTION
        =================================================================== */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-bold text-blue-400 uppercase tracking-widest">
              Direct Engagement
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Start a Project or Request a Service Quote
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-medium">
              Whether you need a custom corporate website, scalable ERP software, a public SaaS store setup, or corporate hardware AMC in Prayagraj, our engineering team is ready.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Interactive Project Inquiry Form */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              
              {contactSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Inquiry Received Successfully!</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto">
                    Thank you, <strong className="text-white">{contactName}</strong>. Your project brief has been recorded in our system. A senior engineer from National Computer Allahabad will contact you shortly.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <a
                      href={`https://wa.me/917860130721?text=${encodeURIComponent(`Hello National Computer, I just submitted an inquiry for ${selectedServices.join(", ")} on your website. My name is ${contactName}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={14} />
                      <span>Continue Conversation on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="px-6 py-3 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  
                  {/* Service Multi-Select Checkboxes */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Select Interested Services (Click to toggle)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        "Web Development",
                        "Custom Software / ERP",
                        "Public SaaS Store Demo",
                        "Corporate AMC / Repair"
                      ].map(service => {
                        const isSelected = selectedServices.includes(service);
                        return (
                          <button
                            type="button"
                            key={service}
                            onClick={() => handleServiceToggle(service)}
                            className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-blue-600/20 border-blue-500 text-white shadow-sm"
                                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            <span>{service}</span>
                            {isSelected && <Check size={14} className="text-blue-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alok Sharma"
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">WhatsApp / Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98390 12345"
                        value={contactPhone}
                        onChange={e => setContactPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Business Name and Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Company / Shop Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sharma Infotech / Retail Hub"
                        value={contactBusiness}
                        onChange={e => setContactBusiness(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Estimated Budget / Scope</label>
                      <select
                        value={contactBudget}
                        onChange={e => setContactBudget(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="Under ₹25,000">Under ₹25,000</option>
                        <option value="₹25k - ₹75k">₹25,000 – ₹75,000</option>
                        <option value="₹75k - ₹2 Lakh">₹75,000 – ₹2,00,000</option>
                        <option value="Enterprise / Custom Contract">Enterprise / Custom AMC Contract</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Brief */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Project Brief / Service Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your website, custom software, SaaS requirements, or hardware maintenance needs..."
                      value={contactMessage}
                      onChange={e => setContactMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {contactSubmitting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Recording Project Brief...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Send Project Inquiry</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>

            {/* Right: Business Info Card */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white">National Computer Allahabad</h3>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mt-0.5">Technology Studio & Hardware Diagnostics Lab</p>
                </div>

                <div className="space-y-4 text-xs font-medium text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Physical Address</div>
                      <div className="text-slate-400 mt-0.5">
                        Civil Lines / Katra Hub, Prayagraj (Allahabad),<br />
                        Uttar Pradesh – 211002, India
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Operating Hours</div>
                      <div className="text-slate-400 mt-0.5">
                        Mon – Sat: 10:00 AM – 8:30 PM<br />
                        Sunday: Closed (Emergency AMC on call)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Direct Phone Lines</div>
                      <div className="text-slate-400 mt-0.5">
                        +91 7786961902 / +91 7860130721
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Official Correspondence</div>
                      <div className="text-slate-400 mt-0.5">
                        info@nationalcomputerallahabad.com<br />
                        support@refurhub.com
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Button */}
                <div className="pt-2">
                  <a
                    href="https://wa.me/917860130721?text=Hello%20National%20Computer%20Allahabad,%20I%20want%20to%20discuss%20a%20project%20or%20software%20requirement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <MessageSquare size={15} />
                    <span>Chat Directly on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Founder / Technical Direction Credit Card */}
              <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Engineering Direction</div>
                <div className="text-sm font-bold text-white">
                  Founded & Headed by <strong className="text-blue-400">Devraj Singh Tomar</strong>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Leading full-stack architect & hardware technician with over a decade of production experience across India.
                </p>
                <div className="pt-1">
                  <a
                    href="https://devrajsinghtomar.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
                  >
                    <span>View Developer Portfolio</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================================
            SECTION H: FOOTER (4 High-Readability Columns)
        =================================================================== */}
        <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs w-full">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              
              {/* Column 1: Brand Summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                    <Cpu size={18} />
                  </div>
                  <span className="font-black text-sm text-white">National Computer Allahabad</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Prayagraj&apos;s premier IT studio & service hub. Crafting responsive web apps, custom business software, public-use repair shop SaaS, and precision chip-level hardware diagnostics since 2014.
                </p>
                <div className="text-slate-500 font-semibold">
                  Official Domain: <span className="text-slate-300">nationalcomputerallahabad.com</span>
                </div>
              </div>

              {/* Column 2: Technology Services */}
              <div className="space-y-3">
                <div className="font-bold text-xs uppercase tracking-wider text-white">Services</div>
                <ul className="space-y-2 font-medium">
                  <li><a href="#services" className="hover:text-white transition-colors">Custom Web Development</a></li>
                  <li><a href="#services" className="hover:text-white transition-colors">Full-Stack Web Applications</a></li>
                  <li><a href="#services" className="hover:text-white transition-colors">Custom ERP & CRM Engineering</a></li>
                  <li><a href="#services" className="hover:text-white transition-colors">E-Commerce Web Platforms</a></li>
                  <li><a href="#services" className="hover:text-white transition-colors">Chip-Level Laptop Repair & AMC</a></li>
                </ul>
              </div>

              {/* Column 3: Public Software (SaaS) */}
              <div className="space-y-3">
                <div className="font-bold text-xs uppercase tracking-wider text-white">Public Software (SaaS)</div>
                <ul className="space-y-2 font-medium">
                  <li><a href="#software" className="hover:text-white transition-colors">Repair Registry Module</a></li>
                  <li><a href="#software" className="hover:text-white transition-colors">Spare Parts Inventory Roster</a></li>
                  <li><a href="#software" className="hover:text-white transition-colors">Direct Counter Sales Logger</a></li>
                  <li><a href="#software" className="hover:text-white transition-colors">1-Click Excel Sync Backups</a></li>
                  <li><a href="#software" className="hover:text-white transition-colors">SaaS Free vs. Pro Pricing</a></li>
                  <li><Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold">Create Free Shop Account →</Link></li>
                </ul>
              </div>

              {/* Column 4: Ecosystem & Quick Links */}
              <div className="space-y-3">
                <div className="font-bold text-xs uppercase tracking-wider text-white">Ecosystem Links</div>
                <ul className="space-y-2 font-medium">
                  <li>
                    <a href="https://refurhub.com/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                      <span>Refurhub Hardware Store ↗</span>
                    </a>
                  </li>
                  <li><a href="#track-repair" className="hover:text-white transition-colors">Track Repair Status</a></li>
                  <li><Link href="/login" className="hover:text-white transition-colors">Store Keeper Login</Link></li>
                  <li><Link href="/admin-login" className="hover:text-white transition-colors">Super Admin Portal</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About National Computer</Link></li>
                  <li><Link href="/support" className="hover:text-white transition-colors">Customer Support Center</Link></li>
                </ul>
              </div>

            </div>

            {/* Bottom Credit Strip */}
            <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-500 font-medium">
              <div>
                © {new Date().getFullYear()} National Computer Allahabad. All rights reserved.
              </div>
              <div>
                Designed & Developed by{" "}
                <a
                  href="https://devrajsinghtomar.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-slate-300 hover:text-blue-400 transition-colors underline decoration-slate-700 underline-offset-4"
                >
                  Devraj Singh Tomar
                </a>
              </div>
            </div>

          </div>
        </footer>

        {/* Global Interactive Launch Software Modal */}
        <LaunchSoftwareModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      </main>
    );
  }

  // =========================================================================
  // 2. SUBSCRIPTION INACTIVE LOCKOUT WALL (When logged in with expired license)
  // =========================================================================
  if (user && !user.subscriptionActive) {
    return (
      <main className="flex flex-col min-h-[85vh] justify-center p-6 bg-slate-900 text-white">
        <div className="max-w-md mx-auto w-full text-center space-y-6 bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Subscription Inactive</h2>
          <p className="text-slate-400 text-sm font-medium">
            Your store account subscription license is currently inactive or expired. Please contact the Super Admin or extend your subscription plan to regain access.
          </p>
          <div className="space-y-3 pt-2">
            <Link
              href="/subscription"
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg block text-sm transition-all"
            >
              Manage & Extend Subscription
            </Link>
            <button
              onClick={async () => {
                await logoutUser();
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // 3. REGULAR STORE DASHBOARD PANEL (When store keeper is logged in)
  // =========================================================================
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Records</p>
            <p className="text-2xl font-black text-foreground mt-0.5">{stats.total}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-green-50 text-green-600 rounded-2xl">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Paid Jobs</p>
            <p className="text-2xl font-black text-foreground mt-0.5">{stats.paid}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Unpaid Jobs</p>
            <p className="text-2xl font-black text-foreground mt-0.5">{stats.unpaid}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="space-y-3 mb-8">
        <Link
          href="/add"
          className="flex items-center justify-between p-5 bg-primary text-primary-foreground font-bold rounded-3xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <PlusCircle size={22} />
            <span className="text-base tracking-tight font-extrabold">New Repair Record</span>
          </div>
          <ArrowRight size={20} />
        </Link>

        <Link
          href="/records"
          className="flex items-center justify-between p-5 bg-white border border-border text-foreground font-bold rounded-3xl shadow-sm hover:bg-muted/40 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <List size={22} className="text-primary" />
            <span className="text-base tracking-tight font-extrabold">View All Register Entries</span>
          </div>
          <ArrowRight size={20} className="text-muted-foreground" />
        </Link>

        <Link
          href="/inventory"
          className="flex items-center justify-between p-5 bg-white border border-border text-foreground font-bold rounded-3xl shadow-sm hover:bg-muted/40 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <Package size={22} className="text-primary" />
            <span className="text-base tracking-tight font-extrabold">Shop Parts Inventory</span>
          </div>
          <ArrowRight size={20} className="text-muted-foreground" />
        </Link>

        <Link
          href="/export"
          className="flex items-center justify-between p-5 bg-white border border-border text-foreground font-bold rounded-3xl shadow-sm hover:bg-muted/40 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <Download size={22} className="text-primary" />
            <span className="text-base tracking-tight font-extrabold">Export Data (Excel)</span>
          </div>
          <ArrowRight size={20} className="text-muted-foreground" />
        </Link>
      </div>
    </main>
  );
}
