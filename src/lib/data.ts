// Initial mock data
export const INITIAL_RECORDS: RecordItem[] = [];

export interface RecordItem {
  id: string;
  receivedDate: string;
  jobNumber: string;
  name: string;
  phone: string;
  laptop: string;
  issue: string;
  extraProblem?: string;
  chargerCollected: boolean;
  signature: boolean;
  workStatus: string;
  amount: number;
  isPaid: boolean;
  pendingAmount?: number;
  expectedDeliveryDate: string;
  completedDate?: string;
  actualDeliveryDate?: string;
  finalStatus: string;
  password?: string;
  notes?: string;
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
