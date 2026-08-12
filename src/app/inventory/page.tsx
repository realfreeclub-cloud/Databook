"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  IndianRupee, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit, 
  DollarSign, 
  Search, 
  TrendingDown, 
  ArrowLeft,
  X,
  History,
  ShoppingCart,
  Database,
  CheckCircle2
} from "lucide-react";
import { getCurrentUser } from "@/lib/actions";
import { 
  getInventoryItems, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem, 
  recordSale, 
  getSalesHistory 
} from "@/lib/inventoryActions";

export default function InventoryDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [activeModal, setActiveModal] = useState<"none" | "add" | "edit" | "sale">("none");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", sku: "", stock: 0, price: 0 });
  const [saleQuantity, setSaleQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    getCurrentUser().then(sessionUser => {
      if (!sessionUser) {
        localStorage.removeItem("user");
        router.push("/login");
      } else {
        setUser(sessionUser);
        loadDashboardData();
      }
    });
  }, [router]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const invData = await getInventoryItems();
      const salesData = await getSalesHistory();
      setInventory(invData);
      setSales(salesData);
    } catch (e) {
      console.error("Error loading dashboard:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Stats calculation
  const totalItems = inventory.length;
  const totalStockValue = inventory.reduce((acc, item) => acc + (item.stock * item.price), 0);
  const lowStockItems = inventory.filter(item => item.stock < 5).length;
  
  // Calculate today's sales revenue
  const today = new Date().toDateString();
  const todaySalesValue = sales
    .filter(sale => new Date(sale.saleDate).toDateString() === today)
    .reduce((acc, sale) => acc + sale.totalAmount, 0);

  // Handlers
  const handleOpenAdd = () => {
    setFormData({ name: "", sku: "", stock: 0, price: 0 });
    setErrorMsg("");
    setSuccessMsg("");
    setActiveModal("add");
  };

  const handleOpenEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({ name: item.name, sku: item.sku || "", stock: item.stock, price: item.price });
    setErrorMsg("");
    setSuccessMsg("");
    setActiveModal("edit");
  };

  const handleOpenSale = (item: any) => {
    setSelectedItem(item);
    setSaleQuantity(1);
    setErrorMsg("");
    setSuccessMsg("");
    setActiveModal("sale");
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return setErrorMsg("Product name is required");
    
    try {
      const res = await addInventoryItem({
        name: formData.name,
        sku: formData.sku,
        stock: Number(formData.stock),
        price: Number(formData.price)
      });
      if (res.success) {
        setSuccessMsg("Product added successfully!");
        setTimeout(() => {
          setActiveModal("none");
          loadDashboardData();
        }, 1000);
      } else {
        setErrorMsg(res.error || "Failed to add product");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return setErrorMsg("Product name is required");
    
    try {
      const res = await updateInventoryItem(selectedItem.id, {
        name: formData.name,
        sku: formData.sku,
        stock: Number(formData.stock),
        price: Number(formData.price)
      });
      if (res.success) {
        setSuccessMsg("Product updated successfully!");
        setTimeout(() => {
          setActiveModal("none");
          loadDashboardData();
        }, 1000);
      } else {
        setErrorMsg(res.error || "Failed to update product");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    }
  };

  const handleSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saleQuantity <= 0) return setErrorMsg("Quantity must be greater than 0");
    if (selectedItem.stock < saleQuantity) return setErrorMsg(`Insufficient stock. Only ${selectedItem.stock} left.`);

    try {
      const res = await recordSale(selectedItem.id, saleQuantity, selectedItem.price);
      if (res.success) {
        setSuccessMsg("Sale transaction recorded successfully!");
        setTimeout(() => {
          setActiveModal("none");
          loadDashboardData();
        }, 1000);
      } else {
        setErrorMsg(res.error || "Failed to record sale");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name} from inventory?`)) {
      try {
        const res = await deleteInventoryItem(id);
        if (res.success) {
          loadDashboardData();
        } else {
          alert("Error: " + res.error);
        }
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading && inventory.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium animate-pulse">Loading shop inventory...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen p-4 pt-8 pb-28 bg-muted/10">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors bg-white rounded-full shadow-sm md:hidden">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Shop Inventory</h1>
            <p className="text-muted-foreground text-sm font-medium">Manage spare parts, stock levels, and store sales</p>
          </div>
        </div>
        
        <button 
          onClick={handleOpenAdd}
          className="bg-primary text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-primary/10 hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 text-sm self-start md:self-auto"
        >
          <Plus size={18} />
          Add Product / Part
        </button>
      </header>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Package size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Items</p>
            <p className="text-2xl font-black text-foreground mt-0.5">{totalItems}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
            <IndianRupee size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Asset Value</p>
            <p className="text-2xl font-black text-foreground mt-0.5">₹{totalStockValue.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Low Stock</p>
            <p className="text-2xl font-black text-foreground mt-0.5">{lowStockItems}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sales Today</p>
            <p className="text-2xl font-black text-foreground mt-0.5">₹{todaySalesValue.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Inventory Section (Col-span 2) */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                <Database size={18} className="text-primary" />
                In-Stock Inventory
              </h3>
              
              {/* Search Bar */}
              <div className="relative max-w-xs w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                  <Search size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search parts/SKU..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                />
              </div>
            </div>

            {filteredInventory.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto text-muted-foreground opacity-30 mb-3" size={48} />
                <p className="text-muted-foreground font-bold text-sm">No inventory items found</p>
                <button 
                  onClick={handleOpenAdd}
                  className="text-primary font-bold text-xs mt-2 hover:underline"
                >
                  Create your first product record
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/20 sm:bg-transparent">
                      <th className="py-4 px-6 font-bold">Item Name</th>
                      <th className="py-4 px-4 font-bold">SKU</th>
                      <th className="py-4 px-4 font-bold text-right">Price</th>
                      <th className="py-4 px-4 font-bold text-center">Stock</th>
                      <th className="py-4 px-6 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map(item => {
                      const isLow = item.stock < 5;
                      return (
                        <tr key={item.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-6 font-bold text-foreground">
                            {item.name}
                            {isLow && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-red-50 text-[10px] font-black text-red-600 border border-red-100 uppercase tracking-wider animate-pulse">
                                Low
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 font-semibold text-muted-foreground">{item.sku || "—"}</td>
                          <td className="py-4 px-4 font-black text-right text-foreground">₹{item.price.toFixed(2)}</td>
                          <td className={`py-4 px-4 font-black text-center ${isLow ? 'text-red-600' : 'text-foreground'}`}>
                            {item.stock}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleOpenSale(item)}
                                disabled={item.stock === 0}
                                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 font-bold text-xs rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                <ShoppingCart size={12} />
                                Sell
                              </button>
                              <button 
                                onClick={() => handleOpenEdit(item)}
                                className="p-2 bg-muted hover:bg-primary/5 text-muted-foreground hover:text-primary rounded-lg transition-colors border border-border"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors border border-red-200"
                              >
                                <Trash2 size={14} />
                              </button>
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
        </div>

        {/* Sales Logs Section (Col-span 1) */}
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-3xl p-6 shadow-sm flex flex-col h-[60vh] max-h-[550px]">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2 mb-6 border-b border-border pb-4">
              <History size={18} className="text-emerald-500" />
              Recent Sales Log
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 -mr-2">
              {sales.length === 0 ? (
                <div className="text-center py-12 h-full flex flex-col justify-center">
                  <TrendingDown className="mx-auto text-muted-foreground opacity-30 mb-3" size={36} />
                  <p className="text-muted-foreground font-bold text-xs">No transactions recorded yet</p>
                  <p className="text-[10px] text-slate-400 mt-1">Use the "Sell" quick button on stock items to record customer purchases.</p>
                </div>
              ) : (
                sales.map(sale => (
                  <div key={sale.id} className="p-4 bg-muted/20 border border-border rounded-2xl flex justify-between items-start gap-2 hover:bg-muted/30 transition-all">
                    <div>
                      <p className="font-bold text-sm text-foreground leading-snug">{sale.itemName}</p>
                      {sale.sku && <p className="text-[10px] font-mono text-muted-foreground mt-0.5">SKU: {sale.sku}</p>}
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-black text-slate-600">
                          Qty: {sale.quantity}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {new Date(sale.saleDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-emerald-600">₹{sale.totalAmount.toFixed(2)}</p>
                      <p className="text-[9px] text-muted-foreground font-medium mt-1">₹{ (sale.totalAmount / sale.quantity).toFixed(2) }/ea</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL OVERLAYS */}
      {activeModal !== "none" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-border animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
              <h3 className="text-lg font-black text-foreground">
                {activeModal === "add" && "Add New Stock"}
                {activeModal === "edit" && "Edit Product"}
                {activeModal === "sale" && "Log Customer Purchase"}
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
                <AlertTriangle size={14} />
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 size={14} />
                {successMsg}
              </div>
            )}

            {/* Forms */}
            {(activeModal === "add" || activeModal === "edit") && (
              <form onSubmit={activeModal === "add" ? handleAddSubmit : handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Product Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g., 8GB DDR4 Crucial RAM"
                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">SKU / Part Code</label>
                  <input 
                    type="text" 
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="E.g., RAM-DDR4-8G"
                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Stock Level</label>
                    <input 
                      type="number" 
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Selling Price (₹)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setActiveModal("none")}
                    className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-lg text-sm"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            )}

            {activeModal === "sale" && selectedItem && (
              <form onSubmit={handleSaleSubmit} className="space-y-4">
                <div className="p-4 bg-muted/20 border border-border rounded-2xl space-y-1">
                  <p className="font-bold text-sm text-foreground">{selectedItem.name}</p>
                  <p className="text-xs text-muted-foreground">Price: ₹{selectedItem.price.toFixed(2)} | In Stock: {selectedItem.stock}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Quantity to Sell</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSaleQuantity(Math.max(1, saleQuantity - 1))}
                      className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-xl font-bold flex items-center justify-center text-lg active:scale-95 transition-all"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={saleQuantity}
                      onChange={(e) => setSaleQuantity(Math.min(selectedItem.stock, Math.max(1, Number(e.target.value))))}
                      className="flex-1 h-10 bg-muted/30 border border-border rounded-xl text-center font-black text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSaleQuantity(Math.min(selectedItem.stock, saleQuantity + 1))}
                      className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-xl font-bold flex items-center justify-center text-lg active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Charge</span>
                  <span className="font-black text-emerald-700 text-lg">₹{(selectedItem.price * saleQuantity).toFixed(2)}</span>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setActiveModal("none")}
                    className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10 hover:shadow-lg text-sm"
                  >
                    Complete Sale
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
