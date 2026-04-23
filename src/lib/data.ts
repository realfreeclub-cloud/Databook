// Initial mock data
export const INITIAL_RECORDS = [
  { 
    id: "1", 
    jobNumber: "JOB-1042", 
    name: "John Smith", 
    phone: "555-0192", 
    laptop: "Dell XPS 15", 
    password: "1234",
    issue: "Screen flickering randomly", 
    extraProblem: "Small scratch on lid",
    chargerCollected: true,
    work: "Replaced display flex cable",
    amount: 150.00, 
    isPaid: true,
    date: "2026-04-24" 
  },
  { 
    id: "2", 
    jobNumber: "JOB-1043", 
    name: "Sarah Jenkins", 
    phone: "555-8841", 
    laptop: "MacBook Air M1", 
    password: "",
    issue: "Battery draining very fast", 
    extraProblem: "",
    chargerCollected: false,
    work: "Pending battery replacement",
    amount: 85.00, 
    isPaid: false,
    date: "2026-04-23" 
  },
];

export interface RecordItem {
  id: string;
  jobNumber: string;
  name: string;
  phone: string;
  laptop: string;
  password?: string;
  issue: string;
  extraProblem?: string;
  chargerCollected: boolean;
  work?: string;
  amount: number;
  isPaid: boolean;
  date: string;
}

export function getRecords(): RecordItem[] {
  if (typeof window === 'undefined') return INITIAL_RECORDS;
  
  const stored = localStorage.getItem('repair_records');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse records", e);
    }
  }
  
  // If no records in local storage, initialize with mock data
  saveRecords(INITIAL_RECORDS);
  return INITIAL_RECORDS;
}

export function saveRecords(records: RecordItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('repair_records', JSON.stringify(records));
}

export function addRecord(record: RecordItem) {
  const records = getRecords();
  records.push(record);
  saveRecords(records);
}
