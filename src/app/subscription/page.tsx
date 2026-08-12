"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle2, ArrowLeft, AlertCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { getMySubscription, requestSubscriptionActivation } from "@/lib/adminActions";

const PLANS = [
  { id: "1_MONTH", name: "1 MONTH LICENSE", priceText: "₹21 Online / Manual Activation", value: "1 Month", months: 1 },
  { id: "3_MONTHS", name: "QUARTERLY LICENSE (3 MONTHS)", priceText: "₹60 Manual Plan", value: "Quarterly", months: 3 },
  { id: "6_MONTHS", name: "6 MONTHS LICENSE", priceText: "₹120 Manual Plan", value: "6 Months", months: 6 },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("1_MONTH");
  const [subStatus, setSubStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    setIsLoading(true);
    try {
      const res = await getMySubscription();
      if (!res) {
        router.push("/login");
      } else {
        setSubStatus(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestActivation = async () => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    if (!plan) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await requestSubscriptionActivation(plan.name, plan.months);
      if (res.success) {
        setSuccessMsg(
          `Request for ${plan.name} submitted! Please contact Super Admin at +917786961902 to complete manual activation.`
        );
        loadSubscription();
      } else {
        setErrorMsg(res.error || "Failed to submit request.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium">Checking license status...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen p-4 pt-8 pb-24 max-w-4xl mx-auto w-full bg-muted/10">
      <header className="flex items-center mb-8 space-x-3">
        <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">License Subscription</h1>
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Manage your repair shop registry access</p>
        </div>
      </header>

      {/* Subscription Status Card */}
      <div className="bg-white border border-border rounded-3xl p-6 shadow-sm mb-8 space-y-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Current License Status</h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/20 border border-border">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${subStatus?.active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              {subStatus?.active ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">
                {subStatus?.active ? "Active Subscription" : "No Active License"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Active Plan: <span className="font-semibold text-foreground">{subStatus?.plan}</span>
              </p>
            </div>
          </div>

          {subStatus?.active && subStatus?.expiresAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold bg-white border border-border px-3.5 py-2 rounded-xl shadow-sm self-start sm:self-auto">
              <Calendar size={14} className="text-primary" />
              Expires on: {new Date(subStatus.expiresAt).toLocaleDateString()}
            </div>
          )}
        </div>
        
        {subStatus?.pendingPlan && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-2xl flex items-center gap-2 mt-4 animate-pulse">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>Pending activation: {subStatus.pendingPlan} ({subStatus.pendingMonths} Months extension requested)</span>
          </div>
        )}
      </div>

      {/* Main Subscription Interface */}
      <div className="bg-white border border-border rounded-[2.5rem] p-6 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Plans Selection */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Select Subscription Plan</span>
            <div className="space-y-4">
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-center relative ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/[0.03] shadow-md shadow-indigo-500/5"
                        : "border-border hover:border-slate-300 bg-white"
                    }`}
                  >
                    <h4 className="font-extrabold text-sm text-foreground tracking-tight">{plan.name}</h4>
                    <p className="text-xs text-slate-500 font-bold mt-1.5">{plan.priceText}</p>
                    
                    {isSelected && (
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-indigo-200" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Request Action */}
        <div className="bg-muted/15 border border-border/80 rounded-3xl p-6 md:p-8 space-y-6 h-full flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-base text-foreground">Manual & Online Activation</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Choose your desired quarterly, half-yearly, or monthly license. Click below to submit your activation request. The Super Admin will review your shop details and extend your access immediately.
            </p>
            
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-4 bg-green-50 border border-green-100 text-green-600 text-xs font-bold rounded-2xl flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  <span>Submitted Successfully</span>
                </div>
                <p className="text-[10px] text-green-600 font-medium leading-relaxed mt-0.5">{successMsg}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleRequestActivation}
            disabled={isSubmitting}
            className="w-full py-4.5 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            <CreditCard size={18} />
            Activate / Extend
          </button>
        </div>
      </div>
    </main>
  );
}
