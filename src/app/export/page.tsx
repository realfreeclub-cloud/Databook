"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { getRecordsFromDB } from "@/lib/actions";
import { RecordItem } from "@/lib/data";

type FilterType = "All" | "Paid" | "Unpaid";

export default function ExportRecords() {
  const [filter, setFilter] = useState<FilterType>("All");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      getRecordsFromDB(user.id).then(setRecords);
    }
  }, []);

  const filteredRecords = records.filter((record) => {
    if (filter === "Paid") return record.isPaid;
    if (filter === "Unpaid") return !record.isPaid;
    return true;
  });

  const handleExport = () => {
    setIsExporting(true);

    try {
      // Prepare data for Excel
      const exportData = filteredRecords.map((record) => ({
        "Received Date": record.receivedDate,
        "Job Number": record.jobNumber,
        "Name": record.name,
        "Phone": record.phone,
        "Laptop": record.laptop,
        "Issue": record.issue,
        "Extra": record.extraProblem || "",
        "Charger": record.chargerCollected ? "Yes" : "No",
        "Signature": record.signature ? "Yes" : "No",
        "Work Status": record.workStatus,
        "Amount": record.amount,
        "Paid": record.isPaid ? "Yes" : "No",
        "Pending Amount": record.pendingAmount || 0,
        "Expected Date": record.expectedDeliveryDate,
        "Completed Date": record.completedDate || "",
        "Actual Date": record.actualDeliveryDate || "",
        "Final Status": record.finalStatus,
        "Password": record.password || "",
        "Notes": record.notes || "",
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Records");

      // Generate Excel file and trigger download
      const fileName = `Records_${filter}_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export records. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen p-6 pt-10 pb-24">
      <header className="flex items-center mb-8 space-x-3">
        <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Export Data</h1>
          <p className="text-muted-foreground text-sm">Download records as Excel</p>
        </div>
      </header>

      <div className="flex flex-col flex-1">
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-lg mb-4">Export Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Filter by Status
              </label>
              <div className="flex bg-muted p-1 rounded-xl">
                {(["All", "Paid", "Unpaid"] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      filter === f 
                        ? "bg-white text-primary shadow-sm border border-border/50" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground">Records to export:</span>
                <span className="font-bold text-foreground">{filteredRecords.length}</span>
              </div>
              
              <button
                onClick={handleExport}
                disabled={filteredRecords.length === 0 || isExporting}
                className="w-full py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  "Exporting..."
                ) : (
                  <>
                    <Download size={20} />
                    Download .xlsx
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0 h-fit">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Standard Format</h3>
            <p className="text-sm text-blue-700">
              The exported file will use the same column format required for imports, making it easy to backup and restore your data.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
