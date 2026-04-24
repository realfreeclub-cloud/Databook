"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Plus, List, LifeBuoy, User, LogIn } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [pathname]); // Refresh on navigation

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Records", href: isLoggedIn ? "/records" : "/login", icon: List },
    { name: "Add", href: isLoggedIn ? "/add" : "/login", icon: Plus, isCenter: true },
    { name: "Support", href: "/support", icon: LifeBuoy },
    { 
      name: isLoggedIn ? "Profile" : "Login", 
      href: isLoggedIn ? "/profile" : "/login", 
      icon: isLoggedIn ? User : LogIn 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-border pb-safe">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          if (item.isCenter) {
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className="relative -top-4 flex items-center justify-center"
              >
                <div className={`w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all active:scale-90 ${
                  isActive ? "bg-primary text-white" : "bg-primary text-white"
                }`}>
                  <Icon size={32} strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-95 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? "bg-primary/5" : ""}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? "opacity-100" : "opacity-70"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
