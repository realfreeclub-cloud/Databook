"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Plus, List, Package, User, LogIn, LogOut, ShieldCheck, LifeBuoy } from "lucide-react";
import { logoutUser } from "@/app/login/actions";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    setIsLoggedIn(!!savedUser);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, [pathname]); // Refresh on navigation

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Failed to sign out:", e);
    }
    localStorage.removeItem("user");
    router.push("/login");
  };

  const isSuperAdmin = user && (user as any).role === "SUPER_ADMIN";

  const navItems = [
    { name: "Home Dashboard", href: isSuperAdmin ? "/admin" : "/", icon: Home },
    ...(!isSuperAdmin ? [
      { name: "Repair Records", href: isLoggedIn ? "/records" : "/login", icon: List },
      { name: "Add Entry", href: isLoggedIn ? "/add" : "/login", icon: Plus },
      { name: "Shop Inventory", href: isLoggedIn ? "/inventory" : "/login", icon: Package }
    ] : []),
    { name: "Support Center", href: "/support", icon: LifeBuoy },
    { 
      name: isLoggedIn ? "My Profile" : "Log In", 
      href: isLoggedIn ? "/profile" : "/login", 
      icon: isLoggedIn ? User : LogIn 
    },
  ];

  if (!isLoggedIn) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0a0d18] text-slate-200 border-r border-slate-800 min-h-screen p-6 sticky top-0 z-40">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 className="font-bold text-white leading-none tracking-tight">Digital Register</h2>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">Repair Manager</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all ${
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/10" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account Action */}
      <div className="border-t border-slate-800 pt-6 mt-6">
        {isLoggedIn && user ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-bold text-sm">
                {user.name ? user.name.split(" ").map(n => n[0]).join("") : "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-100 truncate leading-none">{user.name}</p>
                <span className="text-[10px] text-slate-500 font-semibold uppercase mt-1 block">Logged In</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900/30 transition-all font-bold text-xs rounded-xl"
            >
              <LogOut size={14} />
              Log Out
            </button>
          </div>
        ) : (
          <div className="px-2">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Log in to manage records, parts, and view reports.
            </p>
          </div>
        )}
        
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center mt-6">
          V1.0.0 • NATIONAL COMPUTER
        </p>
      </div>
    </aside>
  );
}
