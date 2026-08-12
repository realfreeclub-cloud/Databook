"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Search, 
  Key, 
  Calendar, 
  LogOut, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare,
  X,
  Sparkles
} from "lucide-react";
import { logoutUser } from "@/app/login/actions";
import { getCurrentUser } from "@/lib/actions";
import { getAllUsers, resetUserPassword, updateUserSubscription, getSupportRequests } from "@/lib/adminActions";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [supportRequests, setSupportRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"shops" | "support">("shops");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [activeModal, setActiveModal] = useState<"none" | "password" | "subscription">("none");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Reset password form state
  const [newPassword, setNewPassword] = useState("");
  
  // Subscription form state
  const [subPlan, setSubPlan] = useState("1 MONTH LICENSE");
  const [subMonths, setSubMonths] = useState(1);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user: any) => {
      if (!user) {
        localStorage.removeItem("user");
        router.push("/login");
      } else if (user.role !== "SUPER_ADMIN") {
        router.push("/"); // Redirect regular users to home
      } else {
        setAdmin(user);
        loadUsersData();
      }
    });
  }, [router]);

  const loadUsersData = async () => {
    setIsLoading(true);
    try {
      const uData = await getAllUsers();
      setUsers(uData);
      
      const sData = await getSupportRequests();
      setSupportRequests(sData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Modals opening
  const openPasswordModal = (user: any) => {
    setSelectedUser(user);
    setNewPassword("");
    setErrorMsg("");
    setSuccessMsg("");
    setActiveModal("password");
  };

  const openSubscriptionModal = (user: any) => {
    setSelectedUser(user);
    if (user.pendingPlan) {
      setSubPlan(user.pendingPlan);
      setSubMonths(user.pendingMonths || 1);
    } else {
      setSubPlan("1 MONTH LICENSE");
      setSubMonths(1);
    }
    setErrorMsg("");
    setSuccessMsg("");
    setActiveModal("subscription");
  };

  // Reset password submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return setErrorMsg("Password must be at least 6 characters.");
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await resetUserPassword(selectedUser.id, newPassword);
      if (res.success) {
        setSuccessMsg(`Password for ${selectedUser.name} reset successfully!`);
        setTimeout(() => {
          setActiveModal("none");
          loadUsersData();
        }, 1200);
      } else {
        setErrorMsg(res.error || "Failed to reset password.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Subscription submit
  const handleSubscriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await updateUserSubscription(selectedUser.id, subPlan, subMonths);
      if (res.success) {
        setSuccessMsg(`License updated for ${selectedUser.name} successfully!`);
        setTimeout(() => {
          setActiveModal("none");
          loadUsersData();
        }, 1200);
      } else {
        setErrorMsg(res.error || "Failed to update license.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp reminder link
  const getWhatsAppReminderLink = (user: any) => {
    let cleanPhone = user.phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone; // India country code
    }
    
    const expiryText = user.subscriptionExpiresAt 
      ? new Date(user.subscriptionExpiresAt).toLocaleDateString()
      : "Not set";
      
    const message = `*License Notice - National Computer*\n\n` +
      `Hello *${user.name}*,\n` +
      `Your Digital Register store account subscription status details:\n\n` +
      `*Status:* ${user.subscriptionActive ? "ACTIVE ✅" : "EXPIRED ❌"}\n` +
      `*Active Plan:* ${user.subscriptionPlan}\n` +
      `*Expiry Date:* ${expiryText}\n\n` +
      `Please contact administrative office or make activation request from your subscription panel to extend access.\n\n` +
      `Thank you for using Digital Register!`;
      
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm)
  );

  const activeLicenses = users.filter(u => u.subscriptionActive).length;
  const expiredLicenses = users.filter(u => !u.subscriptionActive).length;

  if (isLoading && users.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-semibold">Loading Admin Dashboard...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen p-6 bg-muted/10 pb-28">
      {/* Admin Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-primary/10">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">Super Admin Portal</h1>
            <p className="text-xs text-muted-foreground font-medium">Manage registry clients & licenses securely</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all font-bold text-xs rounded-xl self-start sm:self-auto"
        >
          <LogOut size={14} />
          Log Out
        </button>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Registered Shops</p>
            <p className="text-3xl font-black text-foreground mt-0.5">{users.length}</p>
          </div>
        </div>

        <div className="p-6 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Subscriptions</p>
            <p className="text-3xl font-black text-foreground mt-0.5">{activeLicenses}</p>
          </div>
        </div>

        <div className="p-6 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Expired Licenses</p>
            <p className="text-3xl font-black text-foreground mt-0.5">{expiredLicenses}</p>
          </div>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex gap-4 mb-6 border-b border-border pb-px">
        <button
          onClick={() => {
            setActiveTab("shops");
            setSearchTerm("");
          }}
          className={`pb-4 px-4 font-bold text-sm tracking-tight border-b-2 transition-all ${
            activeTab === "shops"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Registered Shops
        </button>
        <button
          onClick={() => {
            setActiveTab("support");
            setSearchTerm("");
          }}
          className={`pb-4 px-4 font-bold text-sm tracking-tight border-b-2 transition-all ${
            activeTab === "support"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Support Requests ({supportRequests.length})
        </button>
      </div>

      {activeTab === "shops" ? (
        /* User Table Card */
        <div className="bg-white border border-border rounded-[2rem] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              Active Store Registrations
            </h3>
            
            {/* Search Box */}
            <div className="relative max-w-xs w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search shop by name or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="mx-auto opacity-30 mb-3" size={48} />
              <p className="font-bold text-sm">No registry users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-4 px-6 font-bold">Shop Name</th>
                    <th className="py-4 px-4 font-bold">Phone Number</th>
                    <th className="py-4 px-4 font-bold text-center">Status</th>
                    <th className="py-4 px-4 font-bold">Current Plan</th>
                    <th className="py-4 px-4 font-bold">Expires On</th>
                    <th className="py-4 px-6 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isExp = !u.subscriptionActive;
                    return (
                      <tr key={u.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                        <td className="py-4 px-6 font-bold text-foreground">{u.name}</td>
                        <td className="py-4 px-4 font-semibold text-muted-foreground">{u.phone}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-block border ${
                            u.subscriptionActive 
                              ? "bg-green-50 border-green-200 text-green-700" 
                              : "bg-red-50 border-red-200 text-red-600"
                          }`}>
                            {u.subscriptionActive ? "Active" : "Expired"}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-foreground">
                          {u.subscriptionPlan}
                          {u.pendingPlan && (
                            <span className="block text-[10px] text-amber-700 font-extrabold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg mt-1 w-fit animate-pulse">
                              ⚠️ Req: {u.pendingPlan} ({u.pendingMonths}M)
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground font-semibold">
                          {u.subscriptionExpiresAt 
                            ? new Date(u.subscriptionExpiresAt).toLocaleDateString() 
                            : "Expired/None"}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openSubscriptionModal(u)}
                              className="px-3 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Calendar size={12} />
                              Activate Plan
                            </button>
                            
                            <button
                              onClick={() => openPasswordModal(u)}
                              className="px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Key size={12} />
                              Reset Pass
                            </button>

                            <a
                              href={getWhatsAppReminderLink(u)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-600 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <MessageSquare size={12} />
                              Send Alert
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Support Requests Card */
        <div className="bg-white border border-border rounded-[2rem] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              Incoming Client Support Requests
            </h3>
          </div>

          {supportRequests.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="mx-auto opacity-30 mb-3" size={48} />
              <p className="font-bold text-sm">No support requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-4 px-6 font-bold">Client Name</th>
                    <th className="py-4 px-4 font-bold">Phone</th>
                    <th className="py-4 px-4 font-bold">Received On</th>
                    <th className="py-4 px-6 font-bold">Message</th>
                    <th className="py-4 px-6 font-bold text-center">Reply</th>
                  </tr>
                </thead>
                <tbody>
                  {supportRequests.map((req) => {
                    let cleanPhone = req.phone ? req.phone.replace(/\D/g, '') : "";
                    if (cleanPhone.length === 10) {
                      cleanPhone = "91" + cleanPhone;
                    }
                    const waLink = cleanPhone 
                      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${req.name}, regarding your support message: "${req.message}"`)}`
                      : "#";
                    return (
                      <tr key={req.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                        <td className="py-4 px-6 font-bold text-foreground">{req.name}</td>
                        <td className="py-4 px-4 font-semibold text-muted-foreground">{req.phone || "None"}</td>
                        <td className="py-4 px-4 text-muted-foreground font-semibold">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-650 max-w-xs truncate font-medium" title={req.message}>
                          {req.message}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {req.phone && req.phone !== "None" ? (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-600 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
                            >
                              <MessageSquare size={12} />
                              Reply WhatsApp
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">No Phone</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL DIALOGS */}
      {activeModal !== "none" && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-border animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
              <h3 className="text-lg font-black text-foreground">
                {activeModal === "password" ? `Reset Password` : `Update License`}
              </h3>
              <button 
                onClick={() => setActiveModal("none")}
                className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Forms */}
            {activeModal === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="p-3 bg-muted/20 border border-border rounded-2xl">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Target Account</p>
                  <p className="font-extrabold text-sm text-foreground mt-0.5">{selectedUser.name} ({selectedUser.phone})</p>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">New Password</label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setActiveModal("none")}
                    className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-lg text-sm disabled:opacity-50"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}

            {activeModal === "subscription" && (
              <form onSubmit={handleSubscriptionSubmit} className="space-y-4">
                <div className="p-3 bg-muted/20 border border-border rounded-2xl">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Target Account</p>
                  <p className="font-extrabold text-sm text-foreground mt-0.5">{selectedUser.name} ({selectedUser.phone})</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Select Subscription Plan</label>
                  <select
                    value={subPlan}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSubPlan(val);
                      if (val === "1 MONTH LICENSE") setSubMonths(1);
                      else if (val === "QUARTERLY LICENSE (3 MONTHS)") setSubMonths(3);
                      else if (val === "6 MONTHS LICENSE") setSubMonths(6);
                    }}
                    className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-foreground cursor-pointer"
                  >
                    <option value="1 MONTH LICENSE">1 MONTH LICENSE (₹21)</option>
                    <option value="QUARTERLY LICENSE (3 MONTHS)">QUARTERLY LICENSE (₹60)</option>
                    <option value="6 MONTHS LICENSE">6 MONTHS LICENSE (₹120)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Plan Duration (Months)</label>
                  <input 
                    type="number"
                    value={subMonths}
                    onChange={(e) => setSubMonths(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setActiveModal("none")}
                    className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-lg text-sm disabled:opacity-50"
                  >
                    Activate License
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
