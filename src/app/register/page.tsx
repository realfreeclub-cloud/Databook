"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Smartphone, Lock, Eye, EyeOff, Loader2, User, ShieldCheck } from "lucide-react";
import { registerUser } from "./actions";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter a valid name");
      return;
    }
    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUser(name, phone, password);

      if (result.success) {
        // Store user info in localStorage for display purposes
        localStorage.setItem("user", JSON.stringify(result.user));
        router.push("/");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-background relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Logo Section */}
        <div className="mb-8 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Digital Register</h1>
          <p className="text-muted-foreground text-sm mt-1">Mobile Repair Management</p>
        </div>

        {/* Register Form */}
        <div className="w-full bg-white border border-border rounded-[2rem] p-8 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <h2 className="text-xl font-bold mb-6 text-foreground">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center gap-2 animate-in fade-in shake">
                <Smartphone size={16} />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Phone Number
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Smartphone size={18} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="000-000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create access password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4.5 bg-primary text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-70 disabled:translate-y-0 flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="mt-10 text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] animate-in fade-in duration-1000 delay-500">
          Powered by National Computer Allahabad
        </p>
      </div>
    </main>
  );
}
