"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  ArrowLeft, 
  CalendarIcon, 
  Smartphone, 
  User, 
  Laptop, 
  AlertCircle, 
  Wrench, 
  IndianRupee, 
  FileText,
  Package,
  Barcode,
  Database,
  ArrowRight,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { addRecordToDB, getCurrentUser } from "@/lib/actions";
import { addInventoryItem, getNextJobNumber } from "@/lib/inventoryActions";

// Job form validation
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
  workStatus: z.string().min(1, "Work Status is required"),
  amount: z.union([z.string(), z.number()]),
  isPaid: z.boolean(),
  pendingAmount: z.union([z.string(), z.number()]).optional(),
  expectedDeliveryDate: z.string().min(1, "Expected delivery date is required"),
  completedDate: z.string().optional(),
  actualDeliveryDate: z.string().optional(),
  finalStatus: z.string().min(1, "Final Status is required"),
  password: z.string().optional(),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

// Product form validation
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const LAPTOP_BRANDS = ["Dell", "HP", "Lenovo", "Asus", "Acer", "Apple", "MSI", "Other"];
const ISSUES = ["Screen Broken", "Battery Issue", "Keyboard Not Working", "Motherboard Issue", "Software Issue", "Data Recovery", "Other"];
const WORK_STATUSES = ["Pending", "Done", "Non Repair"];
const FINAL_STATUSES = ["Complete", "Return Item", "Non Repairing", "Pending"];

const toYYYYMMDD = (d: string) => {
  if (!d || !d.includes('/')) return '';
  const parts = d.split('/');
  if (parts.length !== 3) return '';
  const [dd, mm, yy] = parts;
  return `20${yy}-${mm}-${dd}`;
};

const toDDMMYY = (d: string | undefined) => {
  if (!d) return '';
  if (d.includes('-')) {
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0].slice(-2)}`;
  }
  return d;
};

export default function AddRecord() {
  const router = useRouter();
  const [entryType, setEntryType] = useState<"none" | "job" | "product">("none");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeSelect, setActiveSelect] = useState<{ field: string, options: string[], allowManual?: boolean } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const [createdRecord, setCreatedRecord] = useState<{
    name: string;
    phone: string;
    laptop: string;
    issue: string;
    jobNumber: string;
    amount: number;
    isPaid: boolean;
    receivedDate: string;
    expectedDeliveryDate: string;
  } | null>(null);

  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const today = `${dd}/${mm}/${yy}`;

  const parseDate = (dateStr: string | undefined) => {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date(0);
    const [d, m, y] = parts;
    return new Date(2000 + parseInt(y), parseInt(m) - 1, parseInt(d));
  };

  // Job form setup
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receivedDate: today,
      chargerCollected: false,
      signature: false,
      workStatus: "",
      isPaid: false,
      finalStatus: "",
      amount: 0,
    }
  });

  // Product form setup
  const { register: registerProd, handleSubmit: handleSubmitProd, reset: resetProd, formState: { errors: errorsProd } } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      stock: 0,
      price: 0
    }
  });

  useEffect(() => {
    getCurrentUser().then(user => {
      if (!user) {
        localStorage.removeItem("user");
        router.push("/login");
      }
    });
  }, [router]);

  // Generate next sequential Job Number when entryType changes to 'job'
  useEffect(() => {
    if (entryType === "job") {
      getNextJobNumber().then(num => {
        setValue("jobNumber", num);
      });
    }
  }, [entryType, setValue]);

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

  const isOverdue = watchExpectedDeliveryDate && parseDate(today) > parseDate(watchExpectedDeliveryDate) && !watchActualDeliveryDate;

  const onJobSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await addRecordToDB({
        ...data,
        amount: Number(data.amount) || 0,
        pendingAmount: data.isPaid ? 0 : (data.pendingAmount ? Number(data.pendingAmount) : 0)
      });
      if (res && res.success && res.record) {
        setCreatedRecord({
          name: data.name,
          phone: data.phone,
          laptop: data.laptop,
          issue: data.issue,
          jobNumber: res.record.jobNumber || data.jobNumber,
          amount: Number(data.amount) || 0,
          isPaid: data.isPaid,
          receivedDate: data.receivedDate,
          expectedDeliveryDate: data.expectedDeliveryDate
        });
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitError(res?.error || "Failed to save record. Please check the details.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setSubmitError(err?.message || "An unexpected error occurred.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onProductSubmit = async (data: any) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await addInventoryItem({
        name: data.name,
        sku: data.sku,
        stock: data.stock,
        price: data.price
      });
      if (res && res.success) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitError(res.error || "Failed to save product.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = (record: typeof createdRecord) => {
    if (!record) return "";
    let cleanPhone = record.phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone; // Default to India country code
    }
    
    const shopName = currentUser?.name || "National Computer";
    const shopPhone = currentUser?.phone || "7786961902";
    const supportPhone = "7860130721";

    let message = "";
    if (!record.isPaid) {
      message = `Dear Customer ${record.name} , We have Received Your Item For Repairing. There JOB No. is ${record.jobNumber}. Thanks, ${shopName} ${shopPhone}, ${supportPhone}`;
    } else {
      message = `Dear Customer ${record.name}, Job No. ${record.jobNumber} is Ready And Job Amount Rs. ${record.amount}/- Only, Please Collect Immediate. ${shopName}. ${shopPhone}, ${supportPhone}`;
    }
      
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const getBadgeColor = (status: string, type: 'work' | 'payment' | 'final') => {
    if (type === 'payment') return status === 'true' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    if (status === 'Done' || status === 'Complete') return 'bg-green-100 text-green-700';
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // Render choice screen if no entry type is selected
  if (entryType === "none") {
    return (
      <main className="flex flex-col min-h-[85vh] justify-center p-6 bg-muted/20">
        <div className="max-w-md mx-auto w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div>
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-sm">
              <Plus size={32} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Add New Entry</h1>
            <p className="text-muted-foreground text-sm mt-1">Select the type of record you wish to create</p>
          </div>

          <div className="grid gap-4">
            <button
              onClick={() => setEntryType("job")}
              className="flex items-center text-left p-6 bg-white border border-border rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] group"
            >
              <div className="p-4 bg-primary/15 text-primary rounded-2xl mr-4 group-hover:scale-105 transition-transform">
                <Wrench size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-base text-foreground flex items-center gap-1.5">
                  Laptop Repair Job
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">Register customer device details, assign issues, and track repair status.</p>
              </div>
            </button>

            <button
              onClick={() => setEntryType("product")}
              className="flex items-center text-left p-6 bg-white border border-border rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] group"
            >
              <div className="p-4 bg-teal-500/15 text-teal-600 rounded-2xl mr-4 group-hover:scale-105 transition-transform">
                <Database size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-base text-foreground flex items-center gap-1.5">
                  Inventory Product
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">Add spare parts, accessories, or system items to inventory.</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen p-4 pt-8 pb-28 bg-muted/20">
      <header className="flex items-center mb-6 space-x-3">
        <button 
          onClick={() => {
            if (isSubmitted) {
              setIsSubmitted(false);
              setCreatedRecord(null);
            }
            setEntryType("none");
          }} 
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors bg-white rounded-full shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            {entryType === "job" ? "Add Repair Job" : "Add Inventory Product"}
          </h1>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            {entryType === "job" ? "Create a new service record" : "Register spare part/item"}
          </p>
        </div>
      </header>

      {isOverdue && entryType === "job" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-red-800 text-sm">Overdue Delivery</h4>
            <p className="text-xs text-red-600 mt-0.5">The expected delivery date has passed.</p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-red-800 text-sm">Error Saving Record</h4>
            <p className="text-xs text-red-600 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-center animate-in fade-in slide-in-from-bottom-4 bg-white rounded-[2rem] shadow-sm border border-border p-8 max-w-md mx-auto w-full">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-green-200">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black mb-2 tracking-tight">Record Added!</h2>
          <p className="text-muted-foreground mb-8 text-sm font-medium">The details have been saved securely.</p>
          
          {entryType === "job" && createdRecord && (
            <a
              href={getWhatsAppLink(createdRecord)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs mb-3 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.886 14.11 1.06 11.487 1.06 6.05 1.06 1.625 5.434 1.62 10.867c-.001 1.702.447 3.366 1.3 4.803l-1.052 3.841 3.938-1.033zM18.018 14.71c-.33-.165-1.953-.964-2.251-1.074-.299-.109-.517-.165-.733.165-.217.33-.84 1.074-1.03 1.293-.19.219-.38.244-.71.08-1.98-1.01-3.415-1.782-4.785-4.135-.362-.622.362-.577 1.035-1.926.113-.227.057-.425-.028-.59-.085-.165-.733-1.766-1.002-2.414-.262-.63-.529-.545-.733-.555-.19-.01-.407-.012-.624-.012-.217 0-.57.08-.87.408-.3.33-1.14 1.114-1.14 2.716 0 1.602 1.169 3.15 1.329 3.366.16.216 2.3 3.51 5.573 4.92.778.335 1.387.536 1.859.687.781.248 1.492.213 2.054.129.628-.094 1.953-.799 2.228-1.57.275-.771.275-1.431.19-1.57-.083-.14-.3-.227-.63-.393z"/>
              </svg>
              Send WhatsApp Alert
            </a>
          )}

          <button 
            onClick={() => {
              setIsSubmitted(false);
              setCreatedRecord(null);
              resetProd();
              setEntryType("none");
            }}
            className="w-full max-w-xs px-6 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Create Another Entry
          </button>
        </div>
      ) : entryType === "job" ? (
        <form onSubmit={handleSubmit(onJobSubmit)} className="flex flex-col gap-6 md:grid md:grid-cols-2 md:max-w-5xl md:mx-auto md:w-full">
          
          {/* 1. BASIC INFO */}
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><User size={18} /></div>
              <h3 className="font-bold text-sm tracking-wide">Basic Info</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Received Date</label>
                <Controller
                  control={control}
                  name="receivedDate"
                  render={({ field }) => (
                    <div 
                      className="relative cursor-pointer"
                      onClick={(e) => {
                        const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                        if (input) {
                          try {
                            input.showPicker();
                          } catch (err) {
                            input.click();
                          }
                        }
                      }}
                    >
                      <input 
                        type="text" 
                        value={field.value || ''}
                        readOnly
                        placeholder="DD/MM/YY"
                        className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium pointer-events-none"
                      />
                      <input 
                        type="date"
                        value={toYYYYMMDD(field.value || '')}
                        onChange={(e) => field.onChange(toDDMMYY(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                />
                {errors.receivedDate && <p className="text-red-500 text-xs ml-1">{errors.receivedDate.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Job Number</label>
                <input 
                  type="text" 
                  readOnly
                  placeholder="Generating..."
                  {...register("jobNumber")}
                  className="w-full px-4 py-3.5 bg-muted/50 border border-border rounded-2xl focus:outline-none transition-all text-sm font-bold text-muted-foreground cursor-not-allowed"
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
                      <button type="button" onClick={() => field.onChange(true)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${field.value ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}>Yes</button>
                      <button type="button" onClick={() => field.onChange(false)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!field.value ? "bg-zinc-800 text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}>No</button>
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
                      <button type="button" onClick={() => field.onChange(true)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${field.value ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}>Yes</button>
                      <button type="button" onClick={() => field.onChange(false)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!field.value ? "bg-zinc-800 text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}>No</button>
                    </div>
                  )}
                />
              </div>
            </div>
          </section>

          {/* 4. STATUS TRACKING */}
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Wrench size={18} /></div>
              <h3 className="font-bold text-sm tracking-wide">Status Tracking</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Work Status</label>
              <div 
                className={`w-full px-4 py-3.5 bg-muted/30 border rounded-2xl cursor-pointer text-sm font-medium flex justify-between items-center ${errors.workStatus ? 'border-red-500 focus:ring-red-500/20' : 'border-border'}`}
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
              {errors.workStatus && <p className="text-red-500 text-xs ml-1">{errors.workStatus.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Final Status</label>
              <div 
                className={`w-full px-4 py-3.5 bg-muted/30 border rounded-2xl cursor-pointer text-sm font-medium flex justify-between items-center ${errors.finalStatus ? 'border-red-500 focus:ring-red-500/20' : 'border-border'}`}
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
              {errors.finalStatus && <p className="text-red-500 text-xs ml-1">{errors.finalStatus.message}</p>}
            </div>
          </section>

          {/* 5. IMPORTANT DATES */}
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl"><CalendarIcon size={18} /></div>
              <h3 className="font-bold text-sm tracking-wide">Important Dates</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1 text-red-500 flex items-center gap-1">Expected Date <span className="text-[10px]">*</span></label>
                <Controller
                  control={control}
                  name="expectedDeliveryDate"
                  render={({ field }) => (
                    <div 
                      className="relative cursor-pointer"
                      onClick={(e) => {
                        const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                        if (input) {
                          try {
                            input.showPicker();
                          } catch (err) {
                            input.click();
                          }
                        }
                      }}
                    >
                      <input 
                        type="text" 
                        value={field.value || ''}
                        readOnly
                        placeholder="DD/MM/YY"
                        className="w-full px-4 py-3.5 bg-red-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm font-bold text-red-900 pointer-events-none"
                      />
                      <input 
                        type="date"
                        value={toYYYYMMDD(field.value || '')}
                        onChange={(e) => field.onChange(toDDMMYY(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                />
                {errors.expectedDeliveryDate && <p className="text-red-500 text-xs ml-1">{errors.expectedDeliveryDate.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Completed Date</label>
                <Controller
                  control={control}
                  name="completedDate"
                  render={({ field }) => (
                    <div 
                      className="relative cursor-pointer"
                      onClick={(e) => {
                        const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                        if (input) {
                          try {
                            input.showPicker();
                          } catch (err) {
                            input.click();
                          }
                        }
                      }}
                    >
                      <input 
                        type="text" 
                        value={field.value || ''}
                        readOnly
                        placeholder="DD/MM/YY"
                        className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium pointer-events-none"
                      />
                      <input 
                        type="date"
                        value={toYYYYMMDD(field.value || '')}
                        onChange={(e) => field.onChange(toDDMMYY(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Actual Delivery Date</label>
                <Controller
                  control={control}
                  name="actualDeliveryDate"
                  render={({ field }) => (
                    <div 
                      className="relative cursor-pointer"
                      onClick={(e) => {
                        const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                        if (input) {
                          try {
                            input.showPicker();
                          } catch (err) {
                            input.click();
                          }
                        }
                      }}
                    >
                      <input 
                        type="text" 
                        value={field.value || ''}
                        readOnly
                        placeholder="DD/MM/YY"
                        className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium pointer-events-none"
                      />
                      <input 
                        type="date"
                        value={toYYYYMMDD(field.value || '')}
                        onChange={(e) => field.onChange(toDDMMYY(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </section>

          {/* 6. PAYMENT INFO */}
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

          {/* 7. DELIVERY NOTES */}
          <section className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-3 md:col-span-2">
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

          <div className="md:col-span-2 mt-2 mb-10 flex gap-4">
            <button 
              type="button"
              onClick={() => setEntryType("none")}
              className="w-1/3 py-5 bg-muted text-foreground font-black text-lg rounded-[2rem] border border-border/80 transition-all hover:bg-muted/80 active:scale-[0.98]"
            >
              Back
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-5 bg-primary text-primary-foreground font-black text-lg rounded-[2rem] shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98] border border-primary-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Saving..." : "Create Record"}
            </button>
          </div>
        </form>
      ) : (
        /* Inventory Product Form */
        <form onSubmit={handleSubmitProd(onProductSubmit)} className="flex flex-col gap-6 max-w-md mx-auto w-full">
          
          <section className="bg-white border border-border rounded-3xl p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl"><Package size={18} /></div>
              <h3 className="font-bold text-sm tracking-wide">Product Details</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Product Name</label>
              <input 
                type="text" 
                placeholder="E.g., 500GB NVMe SSD"
                {...registerProd("name")}
                className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
              />
              {errorsProd.name && <p className="text-red-500 text-xs ml-1">{errorsProd.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">SKU / Code (Optional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"><Barcode size={18} /></span>
                <input 
                  type="text" 
                  placeholder="E.g., SSD-500-WD"
                  {...registerProd("sku")}
                  className="w-full pl-11 pr-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Initial Stock</label>
                <input 
                  type="number" 
                  placeholder="10"
                  {...registerProd("stock")}
                  className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                />
                {errorsProd.stock && <p className="text-red-500 text-xs ml-1">{errorsProd.stock.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Selling Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    {...registerProd("price")}
                    className="w-full pl-9 pr-4 py-3.5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  />
                </div>
                {errorsProd.price && <p className="text-red-500 text-xs ml-1">{errorsProd.price.message}</p>}
              </div>
            </div>
          </section>

          <div className="flex gap-4 mb-10">
            <button 
              type="button"
              onClick={() => setEntryType("none")}
              className="w-1/3 py-5 bg-muted text-foreground font-black text-lg rounded-[2rem] border border-border/80 transition-all hover:bg-muted/80 active:scale-[0.98]"
            >
              Back
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-5 bg-primary text-primary-foreground font-black text-lg rounded-[2rem] shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98] border border-primary-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      )}

      {/* Bottom Sheet Selection Modal */}
      {activeSelect && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveSelect(null)} />
          <div className="relative bg-white rounded-t-[2.5rem] p-6 pb-12 animate-in slide-in-from-bottom shadow-2xl border-t border-border max-w-md mx-auto w-full">
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
