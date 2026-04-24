"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, User, Laptop, Wrench, IndianRupee, Lock, AlertTriangle, CalendarIcon, FileText } from "lucide-react";
import { getRecords, saveRecords, RecordItem } from "@/lib/data";

export default function RecordDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [record, setRecord] = useState<RecordItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const records = getRecords();
    const found = records.find(r => r.id === resolvedParams.id);
    setRecord(found || null);
    setIsLoading(false);
  }, [resolvedParams.id]);

  const handleDelete = () => {
    if (!resolvedParams.id) return;
    const records = getRecords();
    const updated = records.filter(r => r.id !== resolvedParams.id);
    saveRecords(updated);
    
    setIsDeleted(true);
    setTimeout(() => {
      router.push("/records");
    }, 1500);
  };

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium animate-pulse">Loading record details...</p>
      </main>
    );
  }

  if (!record) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-muted/20">
        <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-amber-100">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-2xl font-black mb-2 text-foreground">Record Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-xs font-medium">
          The repair record you are looking for might have been deleted or doesn't exist.
        </p>
        <Link href="/records" className="w-full max-w-xs py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.98]">
          Back to Records
        </Link>
      </main>
    );
  }

  if (isDeleted) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/20">
        <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-red-100 animate-in zoom-in">
          <Trash2 size={48} />
        </div>
        <h2 className="text-2xl font-black">Record Deleted</h2>
        <p className="text-muted-foreground mt-2 font-medium">Redirecting to records list...</p>
      </main>
    );
  }

  const getBadgeColor = (status: string, type: 'work' | 'payment' | 'final') => {
    if (type === 'payment') return status === 'true' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';
    if (status === 'Done' || status === 'Complete') return 'bg-green-100 text-green-700';
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <main className="flex flex-col min-h-screen p-4 pt-8 pb-28 bg-muted/20">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Link href="/records" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors bg-white rounded-full shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">{record.jobNumber}</h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{record.receivedDate}</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
          record.isPaid ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {record.isPaid ? 'Paid' : 'Unpaid'}
        </div>
      </header>

      <div className="flex flex-col gap-5">
        {/* Customer Info */}
        <section className="bg-white border border-border rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><User size={18} /></div>
            <h2 className="font-bold text-sm tracking-wide">Customer Info</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Name</p>
              <p className="font-semibold text-foreground mt-1">{record.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</p>
              <p className="font-semibold text-foreground mt-1">{record.phone}</p>
            </div>
          </div>
        </section>

        {/* Device Info */}
        <section className="bg-white border border-border rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Laptop size={18} /></div>
            <h2 className="font-bold text-sm tracking-wide">Device Details</h2>
          </div>
          <div className="grid gap-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Laptop Model</p>
              <p className="font-semibold text-foreground mt-1">{record.laptop}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Charger Collected</p>
                <div className={`mt-1 inline-flex px-2.5 py-1 rounded-md text-xs font-bold ${record.chargerCollected ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {record.chargerCollected ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Signature</p>
                <div className={`mt-1 inline-flex px-2.5 py-1 rounded-md text-xs font-bold ${record.signature ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {record.signature ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl flex items-center gap-3 border border-border mt-2">
              <Lock size={18} className="text-muted-foreground" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Password / PIN</p>
                <p className="font-semibold text-foreground text-sm">{record.password || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Work Details & Status */}
        <section className="bg-white border border-border rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Wrench size={18} /></div>
            <h2 className="font-bold text-sm tracking-wide">Issue & Status</h2>
          </div>
          <div className="grid gap-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Main Issue</p>
              <p className="font-semibold text-foreground mt-1 bg-muted/30 p-3 rounded-xl border border-border/50 text-sm">{record.issue}</p>
            </div>
            {record.extraProblem && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Extra Notes</p>
                <p className="font-medium text-foreground mt-1 text-sm">{record.extraProblem}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Work Status</p>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getBadgeColor(record.workStatus, 'work')}`}>
                  {record.workStatus}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Final Status</p>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getBadgeColor(record.finalStatus, 'final')}`}>
                  {record.finalStatus}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Dates */}
        <section className="bg-white border border-border rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl"><CalendarIcon size={18} /></div>
            <h2 className="font-bold text-sm tracking-wide">Timeline</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 gap-y-6">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Received Date</p>
              <p className="font-semibold text-foreground mt-1">{record.receivedDate}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Expected Delivery</p>
              <p className="font-semibold text-amber-600 mt-1">{record.expectedDeliveryDate}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completed Date</p>
              <p className="font-semibold text-foreground mt-1">{record.completedDate || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Actual Delivery</p>
              <p className="font-semibold text-green-600 mt-1">{record.actualDeliveryDate || '-'}</p>
            </div>
          </div>
        </section>

        {/* Payment Details */}
        <section className="bg-white border border-border rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-xl"><IndianRupee size={18} /></div>
            <h2 className="font-bold text-sm tracking-wide">Payment</h2>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border">
              <span className="font-bold text-muted-foreground text-sm uppercase tracking-wider">Total Amount</span>
              <span className="text-xl font-black">₹{record.amount?.toFixed(2) || "0.00"}</span>
            </div>
            
            {!record.isPaid && (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                <span className="font-bold text-red-600 text-sm uppercase tracking-wider">Pending Amount</span>
                <span className="text-xl font-black text-red-700">₹{record.pendingAmount?.toFixed(2) || "0.00"}</span>
              </div>
            )}
          </div>
        </section>

        {/* Notes */}
        {record.notes && (
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-xl"><FileText size={18} /></div>
              <h2 className="font-bold text-sm tracking-wide">Notes</h2>
            </div>
            <p className="text-sm font-medium text-foreground bg-muted/30 p-4 rounded-2xl border border-border/50">
              {record.notes}
            </p>
          </section>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white text-foreground font-bold rounded-2xl shadow-sm border border-border hover:bg-muted/30 transition-all active:scale-[0.98]"
          >
            <Edit2 size={18} />
            Edit Record
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 font-bold rounded-2xl shadow-sm border border-red-100 hover:bg-red-100 transition-all active:scale-[0.98]"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] p-6 w-full max-w-sm shadow-2xl border border-border animate-in slide-in-from-bottom-8">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto border border-red-100 shadow-sm">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black mb-2 text-center tracking-tight">Delete Record?</h3>
            <p className="text-muted-foreground font-medium mb-8 text-center text-sm">
              Are you sure you want to delete <span className="font-bold text-foreground">{record.jobNumber}</span> for {record.name}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-4 bg-muted/50 text-foreground font-bold rounded-2xl hover:bg-muted transition-colors border border-border/50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
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
