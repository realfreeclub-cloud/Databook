"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Smartphone, 
  LogOut, 
  ChevronRight, 
  Edit3, 
  Building2, 
  ShieldCheck,
  CreditCard
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <main className="flex flex-col min-h-screen p-6 pt-10 pb-24">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        </div>
        {user && (
          <button className="p-2 bg-muted rounded-xl text-primary hover:bg-primary/10 transition-colors flex items-center gap-2 px-4">
            <Edit3 size={18} />
            <span className="text-sm font-bold">Edit</span>
          </button>
        )}
      </header>

      {/* User Branding */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <div className="w-24 h-24 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <span className="text-3xl font-bold">{user?.name ? user.name.split(" ").map(n => n[0]).join("") : "?"}</span>
          </div>
          {user && <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-background rounded-full" />}
        </div>
        <h2 className="text-2xl font-bold text-foreground">{user?.name || "Guest User"}</h2>
        <p className="text-muted-foreground text-sm font-medium">{user ? "Service Manager" : "Not Logged In"}</p>
      </div>

      <div className="space-y-6">
        {/* Personal Details */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-4">Account Information</h3>
          <div className="bg-white border border-border rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-5 flex items-center gap-4 border-b border-border">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Smartphone size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone Number</p>
                <p className="font-bold text-base text-foreground">{user?.phone || "Not available"}</p>
              </div>
            </div>
            
            <div className="p-5 flex items-center gap-4 border-b border-border">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <Building2 size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Shop Name</p>
                <p className="font-bold text-base text-foreground">{user ? "National Genius Institute" : "---"}</p>
              </div>
            </div>

            <div className="p-5 flex items-center gap-4">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <CreditCard size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Subscription</p>
                <p className="font-bold text-base text-foreground">{user ? "Pro Plan" : "---"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Support */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-4">Preferences</h3>
          <div className="bg-white border border-border rounded-[2rem] overflow-hidden shadow-sm">
            <Link href="/about" className="w-full p-5 flex items-center gap-4 border-b border-border hover:bg-muted/30 transition-colors">
              <div className="p-2.5 bg-muted text-foreground rounded-xl">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm text-foreground">Security & Privacy</p>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </Link>
            
            {user ? (
              <button 
                onClick={handleLogout}
                className="w-full p-5 flex items-center gap-4 text-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="p-2.5 bg-red-100 rounded-xl">
                  <LogOut size={20} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm">Log Out</p>
                </div>
                <ChevronRight size={18} className="opacity-50" />
              </button>
            ) : (
              <Link href="/login" className="w-full p-5 flex items-center gap-4 text-primary hover:bg-primary/5 transition-colors">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <LogOut size={20} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm">Log In</p>
                </div>
                <ChevronRight size={18} className="opacity-50" />
              </Link>
            )}
          </div>
        </section>
      </div>

      <footer className="mt-auto pt-10 text-center">
        <div className="inline-block p-1 px-3 bg-muted rounded-full">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            App Version 1.0.0
          </p>
        </div>
      </footer>
    </main>
  );
}
