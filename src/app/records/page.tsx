"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Laptop, Wrench, Phone } from "lucide-react";
import { getRecords, RecordItem } from "@/lib/data";

type FilterType = "All" | "Paid" | "Unpaid";

export default function Records() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [records, setRecords] = useState<RecordItem[]>([]);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

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
    <main className="flex flex-col min-h-screen p-6 pt-10 pb-24">
      <header className="flex items-center mb-6 space-x-3">
        <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Repair Records</h1>
          <p className="text-muted-foreground text-sm">Manage jobs and payments</p>
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
          className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base shadow-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white border border-border p-1 rounded-xl shadow-sm mb-6">
        {(["All", "Paid", "Unpaid"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
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
      <div className="flex flex-col gap-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <Link 
              href={`/records/${record.id}`}
              key={record.id} 
              className="flex flex-col bg-white border border-border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all active:scale-[0.98]"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start p-4 border-b border-border bg-muted/30">
                <div>
                  <h3 className="font-bold text-foreground text-lg">{record.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-0.5 space-x-1">
                    <Phone size={14} />
                    <span>{record.phone}</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-background border border-border rounded-lg text-xs font-semibold tracking-wide text-muted-foreground">
                  {record.jobNumber}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                    <Laptop size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Device</p>
                    <p className="text-sm font-medium text-foreground">{record.laptop}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Issue</p>
                    <p className="text-sm text-foreground line-clamp-2">{record.issue}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between p-4 bg-muted/10 border-t border-border">
                <div className="flex items-baseline space-x-1">
                  <span className="text-muted-foreground font-medium text-sm">₹</span>
                  <span className="text-xl font-bold text-foreground">{record.amount.toFixed(2)}</span>
                </div>
                
                <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center justify-center ${
                  record.isPaid 
                    ? "bg-green-100 text-green-700 border border-green-200" 
                    : "bg-amber-100 text-amber-700 border border-amber-200"
                }`}>
                  {record.isPaid ? "Paid" : "Unpaid"}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>No records found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
}
