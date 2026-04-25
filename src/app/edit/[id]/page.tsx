"use client";

import { useState, useEffect, use } from "react";
import { CheckCircle2, ArrowLeft, CalendarIcon, Smartphone, User, Laptop, AlertCircle, Wrench, IndianRupee, FileText } from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { getRecordsFromDB, updateRecordInDB } from "@/lib/actions";

const formSchema = z.object({
  receivedDate: z.string().min(1, "Received date is required"),
  jobNumber: z.string().min(1, "Job number is required"),
  name: z.string().min(1, "Customer name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  laptop: z.string().min(1, "Laptop is required"),
  issue: z.string().min(1, "Issue is required"),
  extraProblem: z.string().optional(),
  chargerCollected: z.boolean(),
  signature: z.boolean(),
  workStatus: z.enum(["Done", "Pending", "Non Repair"]),
  amount: z.union([z.string(), z.number()]),
  isPaid: z.boolean(),
  pendingAmount: z.union([z.string(), z.number()]).optional(),
  expectedDeliveryDate: z.string().min(1, "Expected delivery date is required"),
  completedDate: z.string().optional(),
  actualDeliveryDate: z.string().optional(),
  finalStatus: z.enum(["Complete", "Non Repairing", "Return Item"]),
  password: z.string().optional(),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

// Common options
const LAPTOP_BRANDS = ["Dell", "HP", "Lenovo", "Asus", "Acer", "Apple", "MSI", "Other"];
const ISSUES = ["Screen Broken", "Battery Issue", "Keyboard Not Working", "Motherboard Issue", "Software Issue", "Data Recovery", "Other"];
const WORK_STATUSES = ["Pending", "Done", "Non Repair"];
const FINAL_STATUSES = ["Complete", "Return Item", "Non Repairing"];

export default function EditRecord({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeSelect, setActiveSelect] = useState<{ field: string, options: string[], allowManual?: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receivedDate: today,
      chargerCollected: false,
      signature: false,
      workStatus: "Pending",
      isPaid: false,
      finalStatus: "Complete",
      amount: 0,
    }
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      getRecordsFromDB(user.id).then(records => {
        const found = records.find(r => r.id === resolvedParams.id);
        if (found) {
          reset({
            ...found,
            amount: found.amount,
            pendingAmount: found.pendingAmount,
          });
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [resolvedParams.id, reset]);

  const watchPaid = watch("isPaid");
  const watchActualDeliveryDate = watch("actualDeliveryDate");
  const watchCompletedDate = watch("completedDate");
  const watchExpectedDeliveryDate = watch("expectedDeliveryDate");
  const watchWorkStatus = watch("workStatus");

  // Smart logic: Update fields based on dependencies
  useEffect(() => {
    if (watchActualDeliveryDate) {
      setValue("finalStatus", "Complete");
      setValue("workStatus", "Done");
    }
  }, [watchActualDeliveryDate, setValue]);

  useEffect(() => {
    if (watchCompletedDate && watchWorkStatus !== "Done") {
      setValue("workStatus", "Done");
    }
  }, [watchCompletedDate, watchWorkStatus, setValue]);

  const isOverdue = watchExpectedDeliveryDate && new Date(today) > new Date(watchExpectedDeliveryDate) && !watchActualDeliveryDate;

  const onSubmit = async (data: FormValues) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    
    await updateRecordInDB(user.id, resolvedParams.id, {
      ...data,
      amount: Number(data.amount) || 0,
      pendingAmount: data.isPaid ? 0 : (data.pendingAmount ? Number(data.pendingAmount) : 0)
    });
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      router.push(`/records/${resolvedParams.id}`);
    }, 1500);
  };

  const getBadgeColor = (status: string, type: 'work' | 'payment' | 'final') => {
    if (type === 'payment') return status === 'true' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    if (status === 'Done' || status === 'Complete') return 'bg-green-100 text-green-700';
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium animate-pulse">Loading record details...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen p-4 pt-8 pb-28 bg-muted/20">
      <header className="flex items-center mb-6 space-x-3">
        <Link href={`/records/${resolvedParams.id}`} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">Edit Repair</h1>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Update service record</p>
        </div>
      </header>

      {isOverdue && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-red-800 text-sm">Overdue Delivery</h4>
            <p className="text-xs text-red-600 mt-0.5">The expected delivery date has passed.</p>
          </div>
        </div>
      )}

      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-center animate-in fade-in slide-in-from-bottom-4 bg-white rounded-[2rem] shadow-sm border border-border p-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-green-200">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black mb-2 tracking-tight">Record Updated!</h2>
          <p className="text-muted-foreground mb-8 text-sm font-medium">The repair details have been updated securely.</p>
          <button 
            onClick={() => router.push(`/records/${resolvedParams.id}`)}
            className="w-full max-w-xs px-6 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Back to Record
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          
          {/* 1. BASIC INFO */}
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><User size={18} /></div>
              <h3 className="font-bold text-sm tracking-wide">Basic Info</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Received Date</label>
                <input 
                  type="date" 
                  {...register("receivedDate")}
                  className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                />
                {errors.receivedDate && <p className="text-red-500 text-xs ml-1">{errors.receivedDate.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Job Number</label>
                <input 
                  type="text" 
                  placeholder="JOB-1042"
                  {...register("jobNumber")}
                  className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                />
                {errors.jobNumber && <p className="text-red-500 text-xs ml-1">{errors.jobNumber.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Customer Name</label>
              <input 
                type="text" 
                placeholder="Full Name"
                {...register("name")}
                className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
              />
              {errors.name && <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Contact Number</label>
              <input 
                type="tel" 
                placeholder="000-000-0000"
                {...register("phone")}
                className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
              />
              {errors.phone && <p className="text-red-500 text-xs ml-1">{errors.phone.message}</p>}
            </div>
          </section>

          {/* 2. LAPTOP DETAILS */}
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Laptop size={18} /></div>
              <h3 className="font-bold text-sm tracking-wide">Laptop Details</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Laptop Name / Model</label>
              <div 
                className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl cursor-pointer text-sm font-medium flex justify-between items-center"
                onClick={() => setActiveSelect({ field: "laptop", options: LAPTOP_BRANDS, allowManual: true })}
              >
                <Controller
                  control={control}
                  name="laptop"
                  render={({ field }) => (
                    <span className={field.value ? "text-foreground" : "text-muted-foreground"}>
                      {field.value || "Select Laptop Brand"}
                    </span>
                  )}
                />
              </div>
              {errors.laptop && <p className="text-red-500 text-xs ml-1">{errors.laptop.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Primary Issue</label>
              <div 
                className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl cursor-pointer text-sm font-medium flex justify-between items-center"
                onClick={() => setActiveSelect({ field: "issue", options: ISSUES, allowManual: true })}
              >
                <Controller
                  control={control}
                  name="issue"
                  render={({ field }) => (
                    <span className={field.value ? "text-foreground" : "text-muted-foreground"}>
                      {field.value || "Select Main Issue"}
                    </span>
                  )}
                />
              </div>
              {errors.issue && <p className="text-red-500 text-xs ml-1">{errors.issue.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Extra Problem (Optional)</label>
              <input 
                type="text" 
                placeholder="E.g., Missing screws, scratches"
                {...register("extraProblem")}
                className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Device Password (Optional)</label>
              <input 
                type="text" 
                placeholder="PIN or Password"
                {...register("password")}
                className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
              />
            </div>
          </section>

          {/* 3. ACCESSORIES */}
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Smartphone size={18} /></div>
              <h3 className="font-bold text-sm tracking-wide">Accessories & Verification</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Charger Collected</label>
                <Controller
                  control={control}
                  name="chargerCollected"
                  render={({ field }) => (
                    <div className="flex bg-muted/30 border border-border p-1 rounded-2xl">
                      <button type="button" onClick={() => field.onChange(true)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${field.value ? "bg-white text-primary shadow-sm" : "text-muted-foreground"}`}>Yes</button>
                      <button type="button" onClick={() => field.onChange(false)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!field.value ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}>No</button>
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Customer Signature</label>
                <Controller
                  control={control}
                  name="signature"
                  render={({ field }) => (
                    <div className="flex bg-muted/30 border border-border p-1 rounded-2xl">
                      <button type="button" onClick={() => field.onChange(true)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${field.value ? "bg-white text-primary shadow-sm" : "text-muted-foreground"}`}>Yes</button>
                      <button type="button" onClick={() => field.onChange(false)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!field.value ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}>No</button>
                    </div>
                  )}
                />
              </div>
            </div>
          </section>

          {/* 4. WORK STATUS & 7. FINAL STATUS */}
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Wrench size={18} /></div>
              <h3 className="font-bold text-sm tracking-wide">Status Tracking</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Work Status</label>
              <div 
                className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl cursor-pointer text-sm font-medium flex justify-between items-center"
                onClick={() => setActiveSelect({ field: "workStatus", options: WORK_STATUSES, allowManual: false })}
              >
                <Controller
                  control={control}
                  name="workStatus"
                  render={({ field }) => (
                    <span className={`px-3 py-1 rounded-md text-sm font-bold ${field.value ? getBadgeColor(field.value, 'work') : 'text-muted-foreground'}`}>
                      {field.value || "Select Work Status"}
                    </span>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Final Status</label>
              <div 
                className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl cursor-pointer text-sm font-medium flex justify-between items-center"
                onClick={() => setActiveSelect({ field: "finalStatus", options: FINAL_STATUSES, allowManual: false })}
              >
                <Controller
                  control={control}
                  name="finalStatus"
                  render={({ field }) => (
                    <span className={`px-3 py-1 rounded-md text-sm font-bold ${field.value ? getBadgeColor(field.value, 'final') : 'text-muted-foreground'}`}>
                      {field.value || "Select Final Status"}
                    </span>
                  )}
                />
              </div>
            </div>
          </section>

          {/* 6. IMPORTANT DATES */}
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl"><CalendarIcon size={18} /></div>
              <h3 className="font-bold text-sm tracking-wide">Important Dates</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1 text-red-500 flex items-center gap-1">Expected Date <span className="text-[10px]">*</span></label>
                <input 
                  type="date" 
                  {...register("expectedDeliveryDate")}
                  className="w-full px-4 py-3.5 bg-red-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm font-bold text-red-900"
                />
                {errors.expectedDeliveryDate && <p className="text-red-500 text-xs ml-1">{errors.expectedDeliveryDate.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Completed Date</label>
                <input 
                  type="date" 
                  {...register("completedDate")}
                  className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Actual Delivery Date</label>
                <input 
                  type="date" 
                  {...register("actualDeliveryDate")}
                  className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                />
              </div>
            </div>
          </section>

          {/* 5. PAYMENT INFO */}
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-50 text-green-600 rounded-xl"><IndianRupee size={18} /></div>
              <h3 className="font-bold text-sm tracking-wide">Payment Info</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Job Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</span>
                <input 
                  type="number" 
                  placeholder="0.00"
                  {...register("amount")}
                  className="w-full pl-9 pr-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-black text-foreground"
                />
              </div>
              {errors.amount && <p className="text-red-500 text-xs ml-1">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Payment Status</label>
              <Controller
                control={control}
                name="isPaid"
                render={({ field }) => (
                  <div className="flex bg-muted/30 border border-border p-1 rounded-2xl">
                    <button type="button" onClick={() => field.onChange(true)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${field.value ? "bg-green-500 text-white shadow-sm" : "text-muted-foreground"}`}>Paid Full</button>
                    <button type="button" onClick={() => field.onChange(false)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!field.value ? "bg-amber-500 text-white shadow-sm" : "text-muted-foreground"}`}>Unpaid / Advance</button>
                  </div>
                )}
              />
            </div>

            {!watchPaid && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-red-500 uppercase tracking-wider ml-1">Pending Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 font-bold">₹</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    {...register("pendingAmount")}
                    className="w-full pl-9 pr-4 py-3.5 bg-red-50 border border-red-200 rounded-2xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-base font-black text-red-700"
                  />
                </div>
              </div>
            )}
          </section>

          {/* 8. NOTES */}
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-xl"><FileText size={18} /></div>
              <h3 className="font-bold text-sm tracking-wide">Delivery Notes</h3>
            </div>
            
            <textarea 
              rows={3}
              placeholder="Any specific delivery instructions or notes..."
              {...register("notes")}
              className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium resize-none"
            />
          </section>

          <button 
            type="submit"
            className="w-full py-5 bg-primary text-primary-foreground font-black text-lg rounded-[2rem] shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98] mt-2 mb-10 border border-primary-foreground/10"
          >
            Update Record
          </button>
        </form>
      )}

      {/* Bottom Sheet for Selections */}
      {activeSelect && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveSelect(null)} />
          <div className="relative bg-white rounded-t-[2.5rem] p-6 pb-12 animate-in slide-in-from-bottom shadow-2xl border-t border-border">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-6 tracking-tight text-center">
              Select {
                activeSelect.field === "laptop" ? "Laptop Brand" : 
                activeSelect.field === "issue" ? "Primary Issue" : 
                activeSelect.field === "workStatus" ? "Work Status" : 
                activeSelect.field === "finalStatus" ? "Final Status" : ""
              }
            </h3>
            <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto px-2">
              {activeSelect.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setValue(activeSelect.field as any, option);
                    setActiveSelect(null);
                  }}
                  className="w-full text-left py-4 px-6 rounded-2xl hover:bg-muted/50 active:bg-muted font-semibold text-foreground transition-colors border border-transparent hover:border-border"
                >
                  {option}
                </button>
              ))}
            </div>
            {/* Allow manual entry */}
            {activeSelect.allowManual !== false && (
              <div className="mt-4 pt-4 border-t border-border px-2">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Or enter manually</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    id={`manual-${activeSelect.field}`}
                    placeholder="Type here..."
                    className="flex-1 px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.currentTarget.value;
                        if (val) {
                          setValue(activeSelect.field as any, val);
                          setActiveSelect(null);
                        }
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(`manual-${activeSelect.field}`) as HTMLInputElement;
                      if (el && el.value) {
                        setValue(activeSelect.field as any, el.value);
                        setActiveSelect(null);
                      }
                    }}
                    className="px-4 py-3 bg-primary text-white font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
