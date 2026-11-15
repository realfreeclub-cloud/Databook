"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Search, 
  Laptop, 
  Wrench, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MessageSquare, 
  ArrowLeft, 
  Printer, 
  LogOut, 
  Lock, 
  Sparkles, 
  IndianRupee, 
  FileText,
  BadgeCheck,
  ChevronRight,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { getCustomerRepairRecords, CustomerSafeRecord } from "@/lib/customerActions";

function CustomerPortalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search / Login states
  const [phoneInput, setPhoneInput] = useState("");
  const [jobInput, setJobInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Authenticated Customer Data
  const [records, setRecords] = useState<CustomerSafeRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);

  // Initialize from URL query params (e.g. from WhatsApp: /track?job=559&phone=7905797354)
  useEffect(() => {
    const urlJob = searchParams.get("job") || "";
    const urlPhone = searchParams.get("phone") || "";

    if (urlJob) setJobInput(urlJob);
    if (urlPhone) setPhoneInput(urlPhone);

    if (urlPhone && urlPhone.replace(/\D/g, "").length >= 10) {
      loadRecords(urlPhone, urlJob);
    } else {
      // Check localStorage for saved customer session
      const savedPhone = localStorage.getItem("cx_phone");
      if (savedPhone) {
        setPhoneInput(savedPhone);
        loadRecords(savedPhone, "");
      }
    }
  }, [searchParams]);

  const loadRecords = async (phone: string, job?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await getCustomerRepairRecords({ phone, jobNumber: job });
      if (res.success && res.records && res.records.length > 0) {
        setRecords(res.records);
        setSelectedRecordId(res.records[0].id);
        const clean10 = phone.replace(/\D/g, "").slice(-10);
        setVerifiedPhone(clean10);
        localStorage.setItem("cx_phone", clean10);
      } else {
        setErrorMsg(res.error || "No matching repair records found for this phone number.");
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred while looking up records. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = phoneInput.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    loadRecords(cleanDigits, jobInput.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("cx_phone");
    setVerifiedPhone(null);
    setRecords([]);
    setSelectedRecordId(null);
    setPhoneInput("");
    setJobInput("");
    setErrorMsg(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeRecord = records.find(r => r.id === selectedRecordId) || records[0];

  // Helper to determine stage
  const getStageInfo = (record: CustomerSafeRecord) => {
    const status = (record.workStatus || "").toLowerCase();
    const final = (record.finalStatus || "").toLowerCase();

    if (record.actualDeliveryDate || final === "complete") {
      return {
        stage: 4,
        stageText: "Ready for Pickup / Delivered",
        color: "text-emerald-400",
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      };
    }
    if (status === "done" || final.includes("complete")) {
      return {
        stage: 4,
        stageText: "Repair Completed • Ready for Pickup",
        color: "text-emerald-400",
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      };
    }
    if (status === "non repair" || final.includes("return")) {
      return {
        stage: 3,
        stageText: "Diagnosed • Return / Non Repairable",
        color: "text-amber-400",
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"
      };
    }
    if (status === "pending" || !status) {
      return {
        stage: 2,
        stageText: "In Diagnosis & Chip-Level Rework",
        color: "text-blue-400",
        badge: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      };
    }
    return {
      stage: 1,
      stageText: "Device Checked In",
      color: "text-slate-300",
      badge: "bg-slate-500/10 text-slate-300 border-slate-500/30"
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Banner Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-300">Customer Support Portal</span>
            </div>

            {verifiedPhone && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 rounded-xl text-xs font-bold border border-slate-700 hover:border-red-500/40 transition-all flex items-center gap-1.5 ml-2"
                title="Log out from customer panel"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ===================================================================
            VIEW 1: CUSTOMER LOGIN / VERIFICATION CARD (IF NOT AUTHENTICATED)
        =================================================================== */}
        {!verifiedPhone || records.length === 0 ? (
          <div className="max-w-lg mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Logo & Headline */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 mb-2">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Customer Service Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                National Computer Allahabad • Track Live Repair, Job Cards & Invoices
              </p>
            </div>

            {/* Login Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
                <Lock size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200 leading-relaxed font-medium">
                  <strong>Privacy First:</strong> To prevent unauthorized viewing of customer details, enter the <strong>10-digit mobile number</strong> registered when handing over your device.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-300 text-xs font-semibold animate-in shake">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Registered Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      maxLength={14}
                      required
                      className="w-full pl-14 pr-4 py-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Job / Ticket Number (Optional)
                    </label>
                    <span className="text-[10px] text-slate-500 font-semibold">From WhatsApp / Receipt</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 559, NCA-1042 (Optional)"
                    value={jobInput}
                    onChange={(e) => setJobInput(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-sm font-black uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Verifying & Loading Jobs...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Access Customer Panel</span>
                    </>
                  )}
                </button>
              </form>

              {/* Direct WhatsApp Assistance */}
              <div className="pt-4 border-t border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400 font-medium">Need immediate help from our technician?</p>
                <a
                  href="https://wa.me/917860130721?text=Hello%20National%20Computer,%20I%20need%20help%20tracking%20my%20laptop%20repair%20record."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageSquare size={14} />
                  <span>Chat on WhatsApp (7860130721)</span>
                </a>
              </div>

            </div>

          </div>
        ) : (

          /* ===================================================================
              VIEW 2: AUTHENTICATED CUSTOMER DASHBOARD
          =================================================================== */
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Customer Greeting Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400">
                  <BadgeCheck size={14} />
                  <span>Verified Customer Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Hello, {activeRecord?.name || "Valued Customer"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Registered Mobile: <strong className="text-slate-200 font-mono">+91 {verifiedPhone}</strong> • Active Records: <strong className="text-blue-400">{records.length} Device(s)</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 shadow-sm print:hidden"
                >
                  <Printer size={15} className="text-blue-400" />
                  <span>Print Job Card</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-300 rounded-xl text-xs font-bold border border-slate-700 hover:border-red-500/30 transition-all flex items-center gap-2 print:hidden"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Multiple Devices Tab Selector (if customer has > 1 repair records) */}
            {records.length > 1 && (
              <div className="space-y-2 print:hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Submitted Devices:</div>
                <div className="flex flex-wrap gap-2">
                  {records.map((r) => {
                    const isSelected = r.id === activeRecord.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRecordId(r.id)}
                        className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <Laptop size={14} className={isSelected ? "text-white" : "text-slate-400"} />
                        <span>Job #{r.jobNumber} • {r.laptop}</span>
                        {r.isPaid ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Job Card Display */}
            {activeRecord && (() => {
              const stageInfo = getStageInfo(activeRecord);

              return (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
                  
                  {/* Top Ticket Status Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                          Job Ticket #{activeRecord.jobNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">• {activeRecord.shopName}</span>
                      </div>
                      <h2 className="text-2xl font-black text-white">{activeRecord.laptop}</h2>
                      <p className="text-xs text-slate-400">
                        Received on: <strong className="text-slate-200">{activeRecord.receivedDate}</strong> • Expected: <strong className="text-slate-200">{activeRecord.expectedDeliveryDate || "In Inspection"}</strong>
                      </p>
                    </div>

                    <div className="sm:text-right space-y-1">
                      <div className="text-xs text-slate-400 font-medium">Live Work Status</div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${stageInfo.badge}`}>
                        {stageInfo.stageText}
                      </span>
                    </div>
                  </div>

                  {/* 4-Step Milestone Progress Stepper */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Repair Milestones & Status
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {[
                        { step: 1, name: "1. Intake Logged", desc: "Device inspected & checked in" },
                        { step: 2, name: "2. Diagnostics", desc: "Chip-level circuit & power testing" },
                        { step: 3, name: "3. Rework & Testing", desc: "Components fitted & burn-in run" },
                        { step: 4, name: "4. Ready for Pickup", desc: "QC verified & ready for handover" }
                      ].map(s => {
                        const isDone = s.step <= stageInfo.stage;
                        const isCurrent = s.step === stageInfo.stage;
                        return (
                          <div 
                            key={s.step} 
                            className={`p-3.5 rounded-2xl border transition-all ${
                              isCurrent
                                ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                                : isDone
                                ? "bg-emerald-500/10 border-emerald-500/30 text-slate-200"
                                : "bg-slate-950/60 border-slate-800 text-slate-500"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs">{s.name}</span>
                              {isDone ? (
                                <CheckCircle2 size={15} className={isCurrent ? "text-blue-400" : "text-emerald-400"} />
                              ) : (
                                <Clock size={15} className="text-slate-600" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 leading-snug">{s.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Technical & Accessories Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Reported Issue & Notes */}
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <Wrench size={14} className="text-amber-400" />
                        <span>Reported Problem</span>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {activeRecord.issue}
                      </p>
                      {activeRecord.extraProblem && (
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Additional Observations:</span>
                          <p className="text-xs text-slate-300">{activeRecord.extraProblem}</p>
                        </div>
                      )}
                    </div>

                    {/* Accessories Check */}
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <Laptop size={14} className="text-blue-400" />
                        <span>Accessories & Intake State</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Charger / Adapter:</span>
                          <span className={`text-xs font-bold mt-1 inline-block ${activeRecord.chargerCollected ? "text-emerald-400" : "text-slate-400"}`}>
                            {activeRecord.chargerCollected ? "✓ Collected with Device" : "✗ Not Collected"}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Intake Signature:</span>
                          <span className="text-xs font-bold text-blue-400 mt-1 inline-block">
                            {activeRecord.signature ? "✓ Signed & Verified" : "Logged in System"}
                          </span>
                        </div>
                      </div>

                      {activeRecord.completedDate && (
                        <div className="text-xs text-slate-400 pt-1">
                          Completion Date: <strong className="text-emerald-400">{activeRecord.completedDate}</strong>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Billing & Settlement Summary */}
                  <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Repair Quote</div>
                      <div className="text-3xl font-black text-white flex items-baseline gap-1">
                        <span>₹</span>
                        <span>{activeRecord.amount.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {activeRecord.isPaid 
                          ? "✓ Full amount settled upon pickup" 
                          : activeRecord.pendingAmount > 0
                          ? `Pending Balance: ₹${activeRecord.pendingAmount.toFixed(2)} (Payable at shop pickup)`
                          : "Payable upon delivery & verification"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border ${
                        activeRecord.isPaid
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                      }`}>
                        {activeRecord.isPaid ? "Payment Completed" : "Payment Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Actions & WhatsApp Support */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800 print:hidden">
                    <button
                      onClick={handlePrint}
                      className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Printer size={15} />
                      <span>Print Official Job Card</span>
                    </button>

                    <a
                      href={`https://wa.me/917860130721?text=${encodeURIComponent(
                        `Hello National Computer, I am checking the status of my Job Ticket #${activeRecord.jobNumber} for ${activeRecord.laptop}. My name is ${activeRecord.name}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      <MessageSquare size={16} />
                      <span>Chat with Technician on WhatsApp</span>
                    </a>
                  </div>

                  {/* Shop Contact & Address Card */}
                  <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 text-xs text-slate-400 space-y-1">
                    <div className="font-bold text-slate-300">National Computer Allahabad — Service Center:</div>
                    <p>Prayagraj, Uttar Pradesh • Support Desk: +91 7786961902, +91 7860130721 • Working Hours: Mon - Sat: 10:00 AM - 8:00 PM</p>
                  </div>

                </div>
              );
            })()}

          </div>
        )}

      </main>

    </div>
  );
}

export default function CustomerTrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw size={20} className="animate-spin text-blue-500" />
          <span className="text-sm font-semibold text-slate-300">Loading Customer Portal...</span>
        </div>
      </div>
    }>
      <CustomerPortalContent />
    </Suspense>
  );
}
