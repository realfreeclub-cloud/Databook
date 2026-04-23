"use client";

import { useState } from "react";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { addRecord } from "@/lib/data";

export default function AddRecord() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [chargerCollected, setChargerCollected] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Get today's date in YYYY-MM-DD format for the default value
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addRecord({
      id: Date.now().toString(),
      date: formData.get('date') as string,
      jobNumber: formData.get('jobNumber') as string,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      laptop: formData.get('laptopName') as string,
      password: formData.get('password') as string || "",
      issue: formData.get('issue') as string,
      extraProblem: formData.get('extraProblem') as string || "",
      chargerCollected,
      work: formData.get('work') as string || "",
      amount: parseFloat(formData.get('amount') as string) || 0,
      isPaid
    });

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="flex flex-col min-h-screen p-6 pt-10 pb-24">
      <header className="flex items-center mb-8 space-x-3">
        <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Add Repair</h1>
          <p className="text-muted-foreground text-sm">Create a new service record</p>
        </div>
      </header>

      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-200">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Record Added!</h2>
          <p className="text-muted-foreground mb-8">The repair details have been saved successfully.</p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="w-full max-w-xs px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            Add Another Record
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
          {/* Base Info Section */}
          <div className="space-y-5 p-5 bg-white border border-border rounded-2xl shadow-sm">
            <div className="space-y-1.5">
              <label htmlFor="date" className="text-sm font-semibold text-foreground">
                Date
              </label>
              <input 
                id="date"
                name="date"
                type="date" 
                defaultValue={today}
                required
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="jobNumber" className="text-sm font-semibold text-foreground">
                Job Number
              </label>
              <input 
                id="jobNumber"
                name="jobNumber"
                type="text" 
                required
                placeholder="E.g., JOB-1042" 
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
              />
            </div>
          </div>

          {/* Customer Info Section */}
          <div className="space-y-5 p-5 bg-white border border-border rounded-2xl shadow-sm">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-foreground">
                Customer Name
              </label>
              <input 
                id="name"
                name="name"
                type="text" 
                required
                placeholder="Full Name" 
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-semibold text-foreground">
                Phone Number
              </label>
              <input 
                id="phone"
                name="phone"
                type="tel" 
                required
                placeholder="000-000-0000" 
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
              />
            </div>
          </div>

          {/* Device & Issue Section */}
          <div className="space-y-5 p-5 bg-white border border-border rounded-2xl shadow-sm">
            <div className="space-y-1.5">
              <label htmlFor="laptopName" className="text-sm font-semibold text-foreground">
                Laptop Name / Model
              </label>
              <input 
                id="laptopName"
                name="laptopName"
                type="text" 
                required
                placeholder="E.g., Dell XPS 15" 
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">
                Password / PIN (Optional)
              </label>
              <input 
                id="password"
                name="password"
                type="text" 
                placeholder="Device login password" 
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>Charger Collected?</span>
              </label>
              <div className="flex bg-background border border-border p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setChargerCollected(true)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    chargerCollected 
                      ? "bg-white text-primary shadow-sm border border-border/50" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setChargerCollected(false)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    !chargerCollected 
                      ? "bg-white text-foreground shadow-sm border border-border/50" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="issue" className="text-sm font-semibold text-foreground">
                Main Issue
              </label>
              <textarea 
                id="issue"
                name="issue"
                required
                rows={3}
                placeholder="Describe the primary problem..." 
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="extraProblem" className="text-sm font-semibold text-foreground">
                Extra Problem / Notes (Optional)
              </label>
              <textarea 
                id="extraProblem"
                name="extraProblem"
                rows={2}
                placeholder="Any additional issues or scratches..." 
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base resize-none"
              />
            </div>
          </div>

          {/* Pricing & Work Section */}
          <div className="space-y-5 p-5 bg-white border border-border rounded-2xl shadow-sm">
            <div className="space-y-1.5">
              <label htmlFor="work" className="text-sm font-semibold text-foreground">
                Work Done / Required
              </label>
              <textarea 
                id="work"
                name="work"
                rows={3}
                placeholder="Details of the repair work..." 
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="amount" className="text-sm font-semibold text-foreground">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                <input 
                  id="amount"
                  name="amount"
                  type="number" 
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00" 
                  className="w-full pl-9 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>Payment Status</span>
              </label>
              <div className="flex bg-background border border-border p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsPaid(true)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    isPaid 
                      ? "bg-green-500 text-white shadow-sm border border-green-600" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Paid
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaid(false)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    !isPaid 
                      ? "bg-amber-500 text-white shadow-sm border border-amber-600" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Unpaid
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="mt-2 w-full py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            Save Record
          </button>
        </form>
      )}
    </main>
  );
}
