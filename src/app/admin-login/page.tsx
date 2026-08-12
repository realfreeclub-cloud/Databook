"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Smartphone, Loader2, AlertCircle } from "lucide-react";
import { loginUser } from "@/app/login/actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (phone.trim() !== "9999999999") {
      setErrorMsg("Unauthorized access. This portal is strictly for the Super Admin. Store keepers must login through the regular sign-in page.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser(phone, password);

      if (result.success) {
        // Store user session attributes
        localStorage.setItem("user", JSON.stringify(result.user));
        router.push("/admin");
      } else {
        setErrorMsg(result.error || "Invalid administrator credentials.");
      }
    } catch (err) {
      setErrorMsg("Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#f8fafc] w-full relative">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Brand Header */}
        <div className="mb-10 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 mb-4 rotate-3">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Admin Control Desk</h1>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-1">Authorized Personnel Only</p>
        </div>

        {/* Login Panel */}
        <div className="w-full bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl shadow-slate-200/80 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Super Admin Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-650 text-xs font-bold rounded-2xl flex gap-2 animate-in fade-in shake leading-relaxed">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="phone" className="text-[10px] font-bold text-slate-450 uppercase tracking-widest ml-1">
                Admin Phone
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Smartphone size={16} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter admin phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-bold text-slate-450 uppercase tracking-widest ml-1">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter security key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary text-white font-black text-sm rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-1px] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>
        </div>

        {/* Helper links */}
        <p className="mt-8 text-center text-xs text-slate-450 font-semibold">
          Forgot password? Contact National Computer Allahabad support desk.
        </p>
      </div>
    </main>
  );
}
