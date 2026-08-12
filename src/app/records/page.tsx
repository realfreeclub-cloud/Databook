"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Laptop, Wrench, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { getRecordsFromDB, getCurrentUser } from "@/lib/actions";
import { RecordItem } from "@/lib/data";

type FilterType = "All" | "Paid" | "Unpaid";

const SkeletonCard = () => (
  <div className="flex flex-col bg-white border border-border rounded-2xl p-4 shadow-sm animate-pulse space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-slate-100 rounded-lg w-1/2"></div>
        <div className="h-4 bg-slate-100 rounded-lg w-1/3"></div>
      </div>
      <div className="h-6 bg-slate-100 rounded-lg w-16"></div>
    </div>
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-100 rounded-lg"></div>
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-slate-100 rounded-lg w-1/4"></div>
          <div className="h-4 bg-slate-100 rounded-lg w-2/3"></div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-100 rounded-lg"></div>
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-slate-100 rounded-lg w-1/4"></div>
          <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
        </div>
      </div>
    </div>
    <div className="border-t border-border pt-4 flex justify-between items-center">
      <div className="h-6 bg-slate-100 rounded-lg w-20"></div>
      <div className="h-8 bg-slate-100 rounded-lg w-14"></div>
    </div>
  </div>
);

export default function Records() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }
        const recordsData = await getRecordsFromDB();
        setRecords(recordsData);
      } catch (e) {
        console.error("Failed to load records list:", e);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, [router]);

  // Filter and search logic
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.phone.includes(searchTerm);
      
    if (!matchesSearch) return false;
    
    if (filter === "Paid") return record.isPaid;
    if (filter === "Unpaid") return !record.isPaid;
    return true; // "All"
  });

  return (
    <main className="flex flex-col min-h-screen p-4 pt-8 pb-28 bg-muted/10">
      <header className="flex items-center mb-6 space-x-3">
        <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">Repair Records</h1>
          <p className="text-muted-foreground text-xs font-medium">Manage jobs and payments</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search by name or phone..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium shadow-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white border border-border p-1 rounded-2xl shadow-sm mb-6">
        {(["All", "Paid", "Unpaid"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              filter === f 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Records List (Card UI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <Link 
              href={`/records/${record.id}`}
              key={record.id} 
              className="flex flex-col bg-white border border-border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all active:scale-[0.98]"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start p-4 border-b border-border bg-muted/30">
                <div>
                  <h3 className="font-bold text-foreground text-base leading-none">{record.name}</h3>
                  <div className="flex items-center text-muted-foreground text-xs mt-1.5 space-x-1">
                    <Phone size={12} />
                    <span>{record.phone}</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-background border border-border rounded-lg text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  {record.jobNumber}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                    <Laptop size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Device</p>
                    <p className="text-xs font-semibold text-foreground">{record.laptop}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5">
                    <Wrench size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Issue</p>
                    <p className="text-xs text-foreground line-clamp-2">{record.issue}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between p-4 bg-muted/10 border-t border-border mt-auto">
                <div className="flex items-baseline space-x-1">
                  <span className="text-muted-foreground font-bold text-xs">₹</span>
                  <span className="text-base font-black text-foreground">{record.amount.toFixed(2)}</span>
                </div>
                
                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  record.isPaid 
                    ? "bg-green-100 text-green-700 border-green-200" 
                    : "bg-amber-100 text-amber-700 border-amber-200"
                }`}>
                  {record.isPaid ? "Paid" : "Unpaid"}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground col-span-full">
            <p>No records found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
}
