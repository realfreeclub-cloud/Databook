"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, User, Laptop, Wrench, IndianRupee, Lock, AlertTriangle } from "lucide-react";
import { getRecords, saveRecords, RecordItem } from "@/lib/data";

export default function RecordDetail({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [record, setRecord] = useState<RecordItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
      
      const records = getRecords();
      const found = records.find(r => r.id === resolvedParams.id);
      setRecord(found || null);
      setIsLoading(false);
    };
    
    resolveParams();
  }, [params]);

  const handleDelete = () => {
    if (!id) return;
    const records = getRecords();
    const updated = records.filter(r => r.id !== id);
    saveRecords(updated);
    
    setIsDeleted(true);
    setTimeout(() => {
      router.push("/records");
    }, 1500);
  };

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground animate-pulse">Loading record details...</p>
      </main>
    );
  }

  if (!record) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={40} />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-foreground">Record Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-xs">
          The repair record you are looking for might have been deleted or doesn't exist.
        </p>
        <Link href="/records" className="w-full max-w-xs py-4 bg-primary text-primary-foreground font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
          Back to Records
        </Link>
      </main>
    );
  }

  if (isDeleted) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 animate-in zoom-in">
          <Trash2 size={32} />
        </div>
        <h2 className="text-xl font-bold">Record Deleted</h2>
        <p className="text-muted-foreground mt-2">Redirecting to records list...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen p-6 pt-10 pb-24 relative">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Link href="/records" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{record.jobNumber}</h1>
            <p className="text-muted-foreground text-sm">{record.date}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
          record.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {record.isPaid ? 'Paid' : 'Unpaid'}
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {/* Customer Info */}
        <section className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-primary mb-4">
            <User size={20} />
            <h2 className="font-semibold text-lg">Customer Info</h2>
          </div>
          <div className="grid gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium text-foreground">{record.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">{record.phone}</p>
            </div>
          </div>
        </section>

        {/* Device Info */}
        <section className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-blue-500 mb-4">
            <Laptop size={20} />
            <h2 className="font-semibold text-lg">Device Details</h2>
          </div>
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Laptop Model</p>
              <p className="font-medium text-foreground">{record.laptop}</p>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Charger Collected</p>
                <p className="font-medium text-foreground">{record.chargerCollected ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl flex items-center space-x-3 border border-border">
              <Lock size={18} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Password / PIN</p>
                <p className="font-medium text-foreground">{record.password || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Work Details */}
        <section className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-500 mb-4">
            <Wrench size={20} />
            <h2 className="font-semibold text-lg">Issue & Work</h2>
          </div>
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Main Issue</p>
              <p className="font-medium text-foreground mt-1 bg-muted/30 p-3 rounded-lg border border-border/50">{record.issue}</p>
            </div>
            {record.extraProblem && (
              <div>
                <p className="text-sm text-muted-foreground">Extra Notes</p>
                <p className="text-sm text-foreground mt-1">{record.extraProblem}</p>
              </div>
            )}
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">Work Performed</p>
              <p className="font-medium text-foreground mt-1">{record.work}</p>
            </div>
          </div>
        </section>

        {/* Payment Details */}
        <section className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-green-500 mb-4">
            <IndianRupee size={20} />
            <h2 className="font-semibold text-lg">Payment</h2>
          </div>
          <div className="flex items-center justify-between bg-background p-4 rounded-xl border border-border">
            <span className="font-medium text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold">₹{record.amount.toFixed(2)}</span>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-muted text-foreground font-semibold rounded-2xl hover:bg-muted/80 transition-colors"
          >
            <Edit2 size={18} />
            Edit Record
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition-colors"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-background rounded-3xl p-6 w-full max-w-sm shadow-xl border border-border">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Delete Record?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <span className="font-semibold text-foreground">{record.jobNumber}</span> for {record.name}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
