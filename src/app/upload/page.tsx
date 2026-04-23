"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, CheckCircle2, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { getRecords, saveRecords, RecordItem } from "@/lib/data";

export default function UploadExcel() {
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<{ success: number; updated: number; total: number } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setResults(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, string | number | boolean>[];

      const existingRecords = getRecords();
      const existingJobNumbersMap = new Map(existingRecords.map(r => [r.jobNumber.trim().toLowerCase(), r]));

      let successCount = 0;
      let updatedCount = 0;

      const newRecords: RecordItem[] = [];
      const recordsToUpdate: Map<string, RecordItem> = new Map();

      for (const row of jsonData) {
        // Map Excel columns to RecordItem keys
        const jobNumber = String(row["Job Number"] || row["JobNumber"] || row["Job"] || "").trim();
        if (!jobNumber) continue; // Skip rows without Job Number

        // Format boolean fields
        const chargerStr = String(row["Charger"] || row["Charger Collected"] || "").toLowerCase();
        const chargerCollected = chargerStr === 'yes' || chargerStr === 'true' || chargerStr === '1' || chargerStr === 'y';

        const paidStr = String(row["Paid"] || "").toLowerCase();
        const isPaid = paidStr === 'yes' || paidStr === 'true' || paidStr === '1' || paidStr === 'y';

        // Parse date properly (Excel dates might be numeric)
        let formattedDate = new Date().toISOString().split('T')[0];
        if (row["Date"]) {
          if (typeof row["Date"] === 'number') {
            // Excel serial date to JS date
            const dateObj = new Date((row["Date"] - (25567 + 2)) * 86400 * 1000);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = dateObj.toISOString().split('T')[0];
            }
          } else {
            formattedDate = new Date(String(row["Date"])).toISOString().split('T')[0];
          }
        }

        const recordData: Omit<RecordItem, 'id'> = {
          date: formattedDate,
          jobNumber,
          name: String(row["Name"] || "Unknown"),
          phone: String(row["Phone"] || ""),
          laptop: String(row["Laptop"] || ""),
          password: String(row["Password"] || ""),
          issue: String(row["Issue"] || ""),
          extraProblem: String(row["Extra"] || ""),
          chargerCollected,
          work: String(row["Work"] || ""),
          amount: parseFloat(String(row["Amount"])) || 0,
          isPaid,
        };

        const lowerCaseJob = jobNumber.toLowerCase();
        
        if (existingJobNumbersMap.has(lowerCaseJob)) {
          // Exists -> Update
          const existing = existingJobNumbersMap.get(lowerCaseJob)!;
          recordsToUpdate.set(existing.id, { ...recordData, id: existing.id });
          updatedCount++;
        } else {
          // New -> Insert
          const newRecord = {
            ...recordData,
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          };
          newRecords.push(newRecord);
          existingJobNumbersMap.set(lowerCaseJob, newRecord); // Prevent dupes in same file
          successCount++;
        }
      }

      // Merge Updates and New Records
      let finalRecords = [...existingRecords];
      
      if (recordsToUpdate.size > 0) {
        finalRecords = finalRecords.map(r => recordsToUpdate.has(r.id) ? recordsToUpdate.get(r.id)! : r);
      }
      
      if (newRecords.length > 0) {
        finalRecords = [...finalRecords, ...newRecords];
      }

      if (recordsToUpdate.size > 0 || newRecords.length > 0) {
        saveRecords(finalRecords);
      }

      setResults({
        total: jsonData.length,
        success: successCount,
        updated: updatedCount
      });
    } catch (error) {
      console.error("Error parsing Excel:", error);
      alert("Failed to parse the Excel file. Please make sure it's a valid .xlsx file.");
    } finally {
      setIsUploading(false);
      // Clear the input
      e.target.value = '';
    }
  };

  return (
    <main className="flex flex-col min-h-screen p-6 pt-10 pb-24">
      <header className="flex items-center mb-8 space-x-3">
        <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Upload Data</h1>
          <p className="text-muted-foreground text-sm">Import or Update records from Excel</p>
        </div>
      </header>

      <div className="flex flex-col flex-1">
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-lg mb-2">Instructions</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload an `.xlsx` file with the following column headers exactly:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {['Date', 'Job Number', 'Name', 'Phone', 'Laptop', 'Issue', 'Extra', 'Charger', 'Work', 'Amount', 'Paid', 'Password'].map(col => (
              <span key={col} className="px-2 py-1 bg-muted rounded-md font-mono text-muted-foreground border border-border">
                {col}
              </span>
            ))}
          </div>
        </div>

        {results ? (
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm animate-in fade-in flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Upload Complete</h2>
            <div className="w-full grid grid-cols-2 gap-4 mt-6 text-left">
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                <p className="text-sm text-green-700 font-medium">New Records</p>
                <p className="text-3xl font-bold text-green-800 mt-1">{results.success}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <div className="flex items-center space-x-1.5">
                  <UploadCloud size={14} className="text-blue-600" />
                  <p className="text-sm text-blue-700 font-medium">Updated</p>
                </div>
                <p className="text-3xl font-bold text-blue-800 mt-1">{results.updated}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Processed {results.total} total rows from the file.
            </p>
            <button 
              onClick={() => setResults(null)}
              className="mt-6 w-full py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
            >
              Upload Another
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-3xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileSpreadsheet size={32} />
              </div>
              <p className="mb-2 text-sm text-foreground font-medium">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">XLSX files only</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        )}

        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
            <div className="flex flex-col items-center">
              <UploadCloud size={48} className="text-primary animate-bounce mb-4" />
              <p className="text-lg font-medium text-foreground">Processing File...</p>
              <p className="text-sm text-muted-foreground mt-1">Please wait</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
